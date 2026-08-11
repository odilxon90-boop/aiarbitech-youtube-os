interface TranslateBatchItem {
  text: string;
  translation: string;
  targetLanguage: string;
  sourceLanguage: string;
  provider: string;
  cached: boolean;
}

interface ApiEnvelope<T> {
  data: T;
}

function resolveApiBaseUrl(): string {
  const configured = import.meta.env.VITE_PLATFORM_API_BASE_URL?.trim();
  const base = configured && configured.length > 0 ? configured : '/api/v1';
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

export async function translateBatch(
  texts: readonly string[],
  targetLanguage: string,
  sourceLanguage = 'en',
): Promise<TranslateBatchItem[]> {
  if (texts.length === 0) return [];

  const response = await fetch(`${resolveApiBaseUrl()}/i18n/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      texts,
      targetLanguage,
      sourceLanguage,
    }),
  });

  if (!response.ok) {
    throw new Error(`Translation API returned ${response.status}`);
  }

  const payload = (await response.json()) as ApiEnvelope<TranslateBatchItem[]>;
  return payload.data;
}
