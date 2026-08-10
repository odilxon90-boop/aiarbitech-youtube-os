const platforms = [
  { name: 'YouTube OS', description: 'Build, publish, and grow creator-led media with intelligent workflows.', color: 'from-red-500/30 to-red-950/40', accent: 'text-red-300', icon: '▶' },
  { name: 'AI Arbitrage', description: 'Turn market signals into faster, smarter opportunities across the ecosystem.', color: 'from-violet-500/30 to-violet-950/40', accent: 'text-violet-300', icon: '✦' },
  { name: 'AI Market Pulse Scalper', description: 'Real-time intelligence for decisive, data-informed market action.', color: 'from-emerald-500/30 to-emerald-950/40', accent: 'text-emerald-300', icon: '↗' },
  { name: 'AI Video Creator Studio', description: 'Transform concepts into polished video experiences at creative speed.', color: 'from-blue-500/30 to-blue-950/40', accent: 'text-blue-300', icon: '◆' },
  { name: 'AIArbiTech TV Global Media', description: 'Connect stories, audiences, and ideas across a borderless media network.', color: 'from-amber-500/30 to-amber-950/40', accent: 'text-amber-300', icon: '◉' },
];

const stats = [
  ['5+', 'Core Platforms', '▦'],
  ['∞', 'Global Coverage', '◎'],
  ['24/7', 'Enterprise Security', '◇'],
  ['AI', 'Powered', '✦'],
  ['1M+', 'Users', '♧'],
];

function NetworkOrb() {
  return (
    <div className="relative mx-auto h-72 w-72 sm:h-96 sm:w-96">
      <div className="absolute inset-8 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute inset-8 rounded-full border border-cyan-300/40 bg-gradient-to-br from-cyan-400/20 via-blue-700/20 to-violet-700/30 shadow-[0_0_80px_rgba(56,189,248,0.35)]" />
      <div className="absolute inset-16 rounded-full border border-dashed border-cyan-200/40 [transform:rotateX(62deg)_rotateZ(-20deg)]" />
      <div className="absolute inset-11 rounded-full border border-dashed border-violet-300/30 [transform:rotateY(62deg)_rotateZ(25deg)]" />
      {[
        'left-10 top-20', 'right-12 top-14', 'bottom-20 left-16', 'bottom-12 right-20', 'left-1/2 top-1/2',
      ].map((position, index) => (
        <span key={position} className={`absolute ${position} h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_18px_6px_rgba(103,232,249,0.7)]`} style={{ animationDelay: `${index * 350}ms` }} />
      ))}
      <div className="absolute inset-0 flex items-center justify-center text-6xl font-black tracking-tighter text-white/90">A<span className="text-cyan-300">I</span></div>
    </div>
  );
}

export function GlobalEcosystemHomePage() {
  return (
    <div className="overflow-hidden bg-[#0B0F19] text-white">
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pt-24">
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="relative">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.32em] text-cyan-300">AIArbiTechnology Global Ecosystem</p>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-7xl">AI-Powered.<br /><span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">Global.</span><br />Unlimited Possibilities.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">One intelligent ecosystem connecting ambitious people, platforms, and possibilities through secure infrastructure and purposeful AI.</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a href="#platforms" className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 font-bold shadow-[0_0_30px_rgba(34,211,238,0.25)] transition hover:-translate-y-0.5 hover:from-cyan-400 hover:to-blue-500">Explore Ecosystem <span aria-hidden="true">→</span></a>
            <a href="#platforms" className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-bold text-slate-200 backdrop-blur transition hover:border-cyan-300/50 hover:bg-white/10">View Platforms</a>
          </div>
        </div>
        <NetworkOrb />
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-6 pb-24 sm:grid-cols-5 lg:px-10">
        {stats.map(([value, label, icon]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 text-center backdrop-blur-xl">
            <div className="mb-3 text-xl text-cyan-300">{icon}</div>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">{label}</p>
          </div>
        ))}
      </section>

      <section id="platforms" className="mx-auto max-w-7xl px-6 pb-28 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-violet-300">One ecosystem</p><h2 className="text-4xl font-bold tracking-tight">Core Platforms</h2></div>
          <p className="max-w-md text-sm leading-6 text-slate-400">Purpose-built products, connected by one secure and intelligent foundation.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {platforms.map((platform) => (
            <article key={platform.name} className={`group rounded-3xl border border-white/10 bg-gradient-to-br ${platform.color} p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-2xl`}>
              <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-black/30 text-2xl ${platform.accent}`}>{platform.icon}</div>
              <h3 className="text-xl font-bold">{platform.name}</h3>
              <p className="mt-3 min-h-14 text-sm leading-6 text-slate-300">{platform.description}</p>
              <a href="#platforms" className={`mt-6 inline-flex items-center gap-2 text-sm font-bold ${platform.accent}`}>Enter Platform <span className="transition group-hover:translate-x-1">→</span></a>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>Build the future. Connect the world. <span className="text-cyan-300">Powered by possibility.</span></p>
          <div className="flex gap-5"><a href="#platforms" className="hover:text-white">Platforms</a><a href="mailto:hello@aiarbitech.com" className="hover:text-white">Contact</a><a href="#platforms" className="hover:text-white">LinkedIn</a></div>
        </div>
      </footer>
    </div>
  );
}
