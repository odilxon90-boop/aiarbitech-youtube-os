import { useEffect, useState } from 'react';
import { createPlatformApiClient, type CreatorStats } from '../platform-client';

const apiClient = createPlatformApiClient();
const chartBars = [42, 58, 50, 76, 64, 88, 72, 96, 81, 100, 92, 112];
type VideoRow = [string, string, string, string];

export function CreatorDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [directorPrompt, setDirectorPrompt] = useState('');
  const [notice, setNotice] = useState('');
  const [stats, setStats] = useState<CreatorStats>();
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const loadDashboard = async () => {
      const [creatorStats, revenueData, videoData] = await Promise.all([
        apiClient.getCreatorStats(),
        apiClient.getRevenue(),
        apiClient.getVideos(),
      ]);
      setStats(creatorStats);
      setRevenue(revenueData.points.reduce((total, point) => total + point.value, 0));
      setVideos(videoData.videos.map((video) => [video.title, 'Published', `${video.views.toLocaleString()} views`, `${video.ctr}%`] as VideoRow));
    };
    void loadDashboard().catch((error: unknown) => setNotice(error instanceof Error ? error.message : 'Unable to load creator data.'));
  }, []);

  const createDraft = async () => {
    if (!directorPrompt.trim()) return;
    const plan = await apiClient.createVideoPlan(directorPrompt);
    setNotice(`AI Director ${plan.status.toLowerCase()} your video brief.`);
    setDirectorPrompt('');
  };

  return (
    <div className="min-h-screen bg-[#070b16] text-white">
      <header className="border-b border-white/10 bg-[#070b16]/90 px-6 py-5 backdrop-blur-xl lg:px-10">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <a href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/40 bg-cyan-400/10 font-black text-cyan-200">AI</span><span><strong className="block text-sm">Creator Dashboard</strong><small className="text-[9px] uppercase tracking-[.3em] text-slate-500">YouTube OS</small></span></a>
          <a href="/" className="text-sm text-slate-400 hover:text-white">← Ecosystem</a>
        </div>
      </header>
      <main className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.3em] text-cyan-300">Creator command center</p><h1 className="text-3xl font-black tracking-tight sm:text-5xl">Turn attention into <span className="text-cyan-300">momentum.</span></h1><p className="mt-3 max-w-xl text-slate-400">One workspace for your audience, revenue, videos, and AI production pipeline.</p></div><button className="rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 text-sm font-bold shadow-[0_0_24px_rgba(56,189,248,.2)]">+ Upload video</button></div>
        <nav className="mb-6 flex gap-2 overflow-x-auto border-b border-white/10 pb-px">{['Overview', 'Analytics', 'Revenue', 'Videos', 'AI Director'].map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold ${activeTab === tab ? 'border-cyan-300 text-cyan-200' : 'border-transparent text-slate-500 hover:text-white'}`}>{tab}</button>)}</nav>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(stats?.kpis ?? []).map((metric, index) => <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><p className="text-xs text-slate-500">{metric.label}</p><p className={`mt-3 text-3xl font-black ${['text-cyan-300', 'text-violet-300', 'text-emerald-300', 'text-amber-300'][index % 4]}`}>{metric.value}</p><p className="mt-2 text-xs text-emerald-300">+{metric.delta}% <span className="text-slate-500">vs last month</span></p></div>)}
        </section>
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[.04] p-6"><div className="flex items-center justify-between"><div><h2 className="font-bold">Audience analytics</h2><p className="mt-1 text-sm text-slate-500">Views and retention · Last 30 days</p></div><span className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400">Last 30 days⌄</span></div><div className="mt-8 flex h-48 items-end gap-2 border-b border-white/10">{chartBars.map((height, index) => <div key={index} className="group relative flex-1"><div style={{ height: `${height}%` }} className="rounded-t-md bg-gradient-to-t from-violet-600 to-cyan-300 opacity-80 transition group-hover:opacity-100" /></div>)}</div><div className="mt-3 flex justify-between text-[10px] text-slate-600"><span>May 12</span><span>May 26</span><span>Jun 10</span></div></div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-400/10 to-cyan-400/[.03] p-6"><div className="flex items-center justify-between"><h2 className="font-bold">Revenue split</h2><span className="text-xs text-emerald-300">70 / 30</span></div><div className="mt-8 flex items-center gap-6"><div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full" style={{ background: 'conic-gradient(#34d399 0deg 252deg, #475569 252deg 360deg)' }}><div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#101827] text-center"><span className="text-xl font-black">${revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}<small className="block text-[9px] font-normal text-slate-500">this month</small></span></div></div><div className="grid gap-4 text-sm"><p><i className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />You <strong className="ml-2">70%</strong></p><p><i className="mr-2 inline-block h-2 w-2 rounded-full bg-slate-500" />Platform <strong className="ml-2">30%</strong></p><p className="text-xs text-slate-500">Next payout <span className="block font-semibold text-slate-300">Based on API schedule</span></p></div></div></div>
        </section>
        <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[.04] p-6"><div className="mb-5 flex items-center justify-between"><h2 className="font-bold">Your videos</h2><button className="text-sm text-cyan-300 hover:text-white">View all →</button></div><div className="grid gap-3">{videos.map(([title, status, views, ctr]) => <div key={title} className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/20 p-3"><div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/60 to-cyan-500/30 text-lg">▶</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{title}</p><p className="mt-1 text-xs text-slate-500">{status} · {views} views · {ctr} CTR</p></div><span className={`hidden rounded-full px-2 py-1 text-[10px] sm:block ${status === 'Published' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-amber-400/10 text-amber-300'}`}>{status}</span></div>)}</div></div>
          <div className="rounded-2xl border border-violet-300/20 bg-gradient-to-br from-violet-500/15 to-cyan-500/[.04] p-6"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-200">✦</span><div><h2 className="font-bold">AI Director</h2><p className="text-xs text-slate-500">Create your next story</p></div></div><p className="mt-6 text-sm leading-6 text-slate-300">Describe a video and your AI production team will prepare the outline, hook, scenes, and publishing plan.</p><textarea value={directorPrompt} onChange={(event) => setDirectorPrompt(event.target.value)} placeholder="I want to make a video about..." className="mt-5 h-24 w-full resize-none rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400" /><button onClick={createDraft} className="mt-3 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold hover:bg-violet-500">Generate production plan ✦</button>{notice && <p className="mt-3 text-center text-xs text-emerald-300">{notice}</p>}</div>
        </section>
      </main>
    </div>
  );
}
