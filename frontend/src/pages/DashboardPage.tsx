import React from 'react';

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-8 text-white">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">AIArbiTech YouTube OS</h1>
        <div className="rounded-full bg-gray-800 px-4 py-2 text-sm">Gate 08 · Foundation 0.1.0</div>
      </header>
      <div className="mb-6 rounded-2xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
        <h2 className="mb-2 text-lg font-medium text-gray-300">Creator Dashboard</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ['Success score', '72', 'text-white'],
            ['Active workflows', '2', 'text-white'],
            ['Quality score', '91', 'text-white'],
            ['Views trend', '+12%', 'text-green-400'],
          ].map(([label, value, color]) => (
            <div key={label} className="rounded-xl border border-gray-700 bg-gray-900/50 p-4">
              <p className="text-xs text-gray-400">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-6 rounded-2xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
        <h2 className="mb-4 text-lg font-medium text-gray-300">Analytics</h2>
        <div className="flex h-40 items-end justify-between gap-2">
          {['h-20', 'h-32', 'h-40', 'h-24', 'h-36'].map((height) => (
            <div key={height} className={`w-2 rounded-full bg-green-500 ${height}`} />
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-400">Retention 68% · Mock revenue $420</p>
      </div>
      <div className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
        <h2 className="mb-2 text-lg font-medium text-gray-300">AI Assistant</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Help me plan a video..."
            className="flex-1 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-purple-500"
          />
          <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500">
            Send message
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
