import type { EnvironmentConfig } from '../config/environment.js';
import { PlatformError } from '../shared/errors.js';

interface CacheEntry {
  value: string;
  expiresAt: number;
}

export interface TranslationResult {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  translation: string;
  provider: 'mock' | 'openai' | 'google';
  cached: boolean;
}

export interface AutoTranslateResponse {
  sourceText: string;
  sourceLanguage: string;
  translations: Record<string, string>;
  provider: 'mock' | 'openai' | 'google';
}

export class TranslationService {
  private readonly provider: 'mock' | 'openai' | 'google';

  private readonly ttlMs: number;

  private readonly cache = new Map<string, CacheEntry>();

  constructor(private readonly config: EnvironmentConfig) {
    this.provider = config.TRANSLATION_PROVIDER;
    this.ttlMs = config.TRANSLATION_CACHE_TTL_SECONDS * 1000;
  }

  async autoTranslateNewText(
    text: string,
    targetLanguages: readonly string[],
    sourceLanguage = 'auto',
  ): Promise<AutoTranslateResponse> {
    const normalizedText = text.trim();
    if (!normalizedText) {
      throw new PlatformError(400, 'INVALID_TRANSLATION_TEXT', 'Text must not be empty.');
    }

    const translations: Record<string, string> = {};
    for (const targetLanguage of targetLanguages) {
      if (targetLanguage === sourceLanguage || targetLanguage === 'auto') {
        translations[targetLanguage] = normalizedText;
        continue;
      }
      const result = await this.translateSingle(normalizedText, sourceLanguage, targetLanguage);
      translations[targetLanguage] = result.translation;
    }

    return {
      sourceText: normalizedText,
      sourceLanguage,
      translations,
      provider: this.provider,
    };
  }

  async translateBatch(
    texts: readonly string[],
    targetLanguage: string,
    sourceLanguage = 'auto',
  ): Promise<TranslationResult[]> {
    const normalizedTexts = texts.map((item) => item.trim()).filter(Boolean);
    if (normalizedTexts.length === 0) {
      throw new PlatformError(400, 'INVALID_TRANSLATION_TEXTS', 'At least one text is required.');
    }

    const results: TranslationResult[] = [];
    for (const text of normalizedTexts) {
      results.push(await this.translateSingle(text, sourceLanguage, targetLanguage));
    }
    return results;
  }

  cacheSize(): number {
    return this.cache.size;
  }

  private async translateSingle(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
  ): Promise<TranslationResult> {
    const cacheKey = `${this.provider}:${sourceLanguage}:${targetLanguage}:${text}`;
    const cached = this.readCache(cacheKey);
    if (cached) {
      return {
        text,
        sourceLanguage,
        targetLanguage,
        translation: cached,
        provider: this.provider,
        cached: true,
      };
    }

    const translated = await this.requestTranslation(text, sourceLanguage, targetLanguage);
    this.writeCache(cacheKey, translated);

    return {
      text,
      sourceLanguage,
      targetLanguage,
      translation: translated,
      provider: this.provider,
      cached: false,
    };
  }

  private readCache(key: string): string | undefined {
    const existing = this.cache.get(key);
    if (!existing) return undefined;
    if (existing.expiresAt <= Date.now()) {
      this.cache.delete(key);
      return undefined;
    }
    return existing.value;
  }

  private writeCache(key: string, value: string): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  private async requestTranslation(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
  ): Promise<string> {
    if (this.provider === 'mock') {
      return `[${targetLanguage}] ${text}`;
    }

    if (this.provider === 'google') {
      return this.requestGoogleTranslation(text, sourceLanguage, targetLanguage);
    }

    return this.requestOpenAiTranslation(text, sourceLanguage, targetLanguage);
  }

  private async requestGoogleTranslation(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
  ): Promise<string> {
    if (!this.config.GOOGLE_TRANSLATE_API_KEY) {
      throw new PlatformError(500, 'TRANSLATION_PROVIDER_NOT_CONFIGURED', 'Google Translate API key is missing.');
    }

    const params = new URLSearchParams({ key: this.config.GOOGLE_TRANSLATE_API_KEY });
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: [text],
        target: targetLanguage,
        format: 'text',
        ...(sourceLanguage !== 'auto' ? { source: sourceLanguage } : {}),
      }),
    });

    if (!response.ok) {
      throw new PlatformError(502, 'TRANSLATION_PROVIDER_ERROR', `Google Translate request failed with ${response.status}.`, true);
    }

    const payload = (await response.json()) as {
      data?: {
        translations?: Array<{ translatedText?: string }>;
      };
    };

    const translated = payload.data?.translations?.[0]?.translatedText;
    if (!translated) {
      throw new PlatformError(502, 'TRANSLATION_PROVIDER_ERROR', 'Google Translate returned an invalid payload.', true);
    }

    return translated;
  }

  private async requestOpenAiTranslation(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
  ): Promise<string> {
    if (!this.config.OPENAI_API_KEY) {
      throw new PlatformError(500, 'TRANSLATION_PROVIDER_NOT_CONFIGURED', 'OpenAI API key is missing.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: this.config.OPENAI_TRANSLATION_MODEL,
        temperature: 0,
        messages: [
          {
            role: 'system',
            content:
              'You are a translation engine. Return only the translated text. Do not add notes, quotes, or explanations.',
          },
          {
            role: 'user',
            content: `Translate this text from ${sourceLanguage} to ${targetLanguage}:\n\n${text}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new PlatformError(502, 'TRANSLATION_PROVIDER_ERROR', `OpenAI translation request failed with ${response.status}.`, true);
    }

    const payload = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };

    const translated = payload.choices?.[0]?.message?.content?.trim();
    if (!translated) {
      throw new PlatformError(502, 'TRANSLATION_PROVIDER_ERROR', 'OpenAI returned an empty translation.', true);
    }

    return translated;
  }
}
