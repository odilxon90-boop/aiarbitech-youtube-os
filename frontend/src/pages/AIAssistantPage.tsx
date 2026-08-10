import { useState } from 'react';
import type { ChatSession } from '../ai/types';

interface AIAssistantPageProps {
  initialSessions?: ChatSession[];
}

export function AIAssistantPage({ initialSessions }: AIAssistantPageProps = {}) {
  const [prompt, setPrompt] = useState('Help me plan a video');
  const [response, setResponse] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResponse('Mock AI response: Start with a focused opening hook.');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-purple-300">Creator Experience</p>
            <h1 className="text-4xl font-bold tracking-tight">AI Assistant</h1>
            <p className="mt-2 max-w-xl text-slate-300">Turn your next idea into a focused, high-retention video plan.</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">Mock AI workspace</span>
        </header>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-200">Conversations</h2>
              <button type="button" className="rounded-lg bg-purple-500/20 px-3 py-1 text-xs text-purple-200 hover:bg-purple-500/30">
                New chat
              </button>
            </div>
            {initialSessions?.length ? (
              <div className="space-y-2">
                {initialSessions.map((session) => (
                  <div key={session.id} className="rounded-xl bg-white/10 px-3 py-3 text-sm text-slate-200">
                    {session.title}
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-sm text-slate-400">Loading conversations…</p>
            )}
          </aside>

          <section className="flex min-h-[560px] flex-col rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-xl md:p-8" aria-labelledby="assistant-title">
            <div className="mb-8 flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-xl font-bold">AI</div>
              <div>
                <h2 id="assistant-title" className="font-semibold">Your creative copilot</h2>
                <p className="text-sm text-emerald-300">Ready to help</p>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <p className="max-w-md text-center text-lg text-slate-300">Ask the AI Assistant anything about your channel.</p>
            </div>
            {response && <p className="mb-4 rounded-2xl bg-purple-500/15 p-4 text-sm text-purple-100" role="status">{response}</p>}
            <form onSubmit={handleSubmit} className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-2">
              <input
                aria-label="AI message"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-white outline-none placeholder:text-slate-500"
                placeholder="Help me plan a video..."
              />
              <button type="submit" className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-semibold transition hover:from-blue-500 hover:to-purple-500">
                Send message
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
