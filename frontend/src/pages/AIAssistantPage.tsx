import React, { useState } from 'react';

type Message = { role: 'user' | 'ai'; text: string };

export function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hello! I am your AI Director. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((currentMessages) => [...currentMessages, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'ai', text: 'That is a great question! Let me analyze your channel data...' },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-6 text-white">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <div className="rounded-full bg-gray-800 px-4 py-2 text-sm text-gray-300">Mock AI Only</div>
      </header>

      <div className="flex h-[calc(100vh-180px)] flex-col rounded-2xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                {message.text}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-b-2xl border-t border-gray-700 bg-gray-800/30 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              aria-label="AI message"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSend()}
              placeholder="Ask your AI Director anything..."
              className="flex-1 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-white outline-none focus:border-purple-500"
            />
            <button type="button" onClick={handleSend} className="rounded-xl bg-purple-600 px-6 py-3 font-semibold transition hover:bg-purple-500">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistantPage;
