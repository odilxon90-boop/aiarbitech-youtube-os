import { useState } from 'react';

const consentKey = 'aiarbitech-consent-v1';

export function ConsentBanner() {
  const [visible, setVisible] = useState(
    () => typeof window !== 'undefined' && window.localStorage.getItem(consentKey) === null,
  );

  const save = (analytics: boolean) => {
    window.localStorage.setItem(
      consentKey,
      JSON.stringify({ essential: true, analytics, updatedAt: new Date().toISOString() }),
    );
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <aside className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl rounded-2xl border border-cyan-300/30 bg-slate-950/95 p-5 text-sm text-slate-200 shadow-2xl backdrop-blur" aria-label="Privacy preferences">
      <strong className="text-white">Your privacy choices</strong>
      <p className="mt-2 leading-6 text-slate-400">Essential storage keeps the application secure. Optional analytics are disabled unless you accept them. You can request an export or deletion through support.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => save(false)} className="rounded-lg border border-white/20 px-4 py-2 font-semibold">Essential only</button>
        <button type="button" onClick={() => save(true)} className="rounded-lg bg-cyan-500 px-4 py-2 font-bold text-slate-950">Accept analytics</button>
      </div>
    </aside>
  );
}
