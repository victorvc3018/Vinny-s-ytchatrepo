import React, { useState } from 'react';

interface UserSetupProps {
  onUserSetup: (username: string) => void;
}

const UserSetup: React.FC<UserSetupProps> = ({ onUserSetup }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onUserSetup(username.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/50 text-white p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-[#212121] rounded-2xl shadow-2xl ring-1 ring-white/10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome to DittoTube Chat</h1>
          <p className="text-gray-400 mt-2">Choose a username for this session</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="sr-only">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="off"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-[#121212] border border-gray-600 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 text-base font-semibold text-black bg-[#3ea6ff] rounded-full hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors disabled:opacity-50"
              disabled={!username.trim()}
            >
              Start Chatting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSetup;