import React, { useState } from 'react';

interface RoomManagerProps {
  onRoomSelect: (roomId: string) => void;
}

const RoomManager: React.FC<RoomManagerProps> = ({ onRoomSelect }) => {
  const [roomId, setRoomId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      // Use a consistent format for the room ID
      const formattedRoomId = roomId.trim().toLowerCase().replace(/\s+/g, '-');
      onRoomSelect(formattedRoomId);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black/50 text-white p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-[#212121] rounded-2xl shadow-2xl ring-1 ring-white/10">
        
        <div>
          <h2 className="text-2xl font-bold text-center">Enter Your Chat Room</h2>
          <p className="text-center text-gray-400 mt-2">
            Create a new room with a unique name, or enter an existing one to rejoin a chat.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="roomId" className="sr-only">Room Name</label>
              <input
                id="roomId"
                name="roomId"
                type="text"
                autoComplete="off"
                required
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-4 py-3 bg-[#121212] border border-gray-600 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-mono tracking-wider"
                placeholder="e.g., best-friends-chat"
              />
               <p className="text-center text-xs text-gray-500 mt-2">Room names are public. Choose something unique!</p>
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-3 text-base font-semibold text-black bg-[#3ea6ff] rounded-full hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors disabled:opacity-50"
                disabled={!roomId.trim()}
              >
                Enter Chat Room
              </button>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default RoomManager;