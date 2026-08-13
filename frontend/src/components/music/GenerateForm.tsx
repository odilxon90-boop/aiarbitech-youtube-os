import { useState, type FormEvent } from 'react';

export function GenerateForm({ onGenerate }: { onGenerate: (query: string) => void }) {
  const [query, setQuery] = useState('');
  const submit = (event: FormEvent) => { event.preventDefault(); if (query.trim()) onGenerate(query.trim()); };
  return <form className="music-generate-form" onSubmit={submit}><label htmlFor="music-query">Describe a mood, genre, or creator use case</label><div><input id="music-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. upbeat technology intro" /><button type="submit">Find tracks</button></div></form>;
}
