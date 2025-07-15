
import React from 'react';

interface SidebarProps {
  onVideoSelect: (videoId: string) => void;
}

const suggestedVideos = [
  { id: '5qap5aO4i9A', title: 'lofi hip hop radio - beats to relax/study to', channel: 'Lofi Girl' },
  { id: 'DWcJFNfaw9c', title: 'lofi hip hop radio - beats to sleep/chill to', channel: 'Lofi Girl' },
  { id: 'rUxyKA_-grg', title: 'Space Ambient Music • Interstellar Travel', channel: 'Cosmic Relaxation' },
  { id: 'WJuef_A_b_0', title: 'Japanese night cafe vibes ~ a lofi hiphop mix', channel: 'The Jazz Hop Cafe' },
  { id: '4xDzrJKXOOY', title: 'coffee shop radio // 24/7 lofi hip-hop beats', channel: 'STEEZYASFUCK' },
  { id: 'lTRiuFIWV54', title: 'synthwave radio 🌌 - beats to chill/game to', channel: 'Lofi Girl' },
  { id: 'aGSYq5J5-3k', title: '1-Hour of Relaxing Celtic Music', channel: 'Soothing Relaxation' },
  { id: 'h3h035EwG4E', title: 'Rainy Day Coffee Shop Ambience', channel: 'Calmed By Nature' },
];

const Sidebar: React.FC<SidebarProps> = ({ onVideoSelect }) => {
  return (
    <>
      <div className="bg-[#272727] p-4 rounded-xl">
        <h2 className="text-lg font-bold mb-2">Real-Time Chat Active</h2>
        <p className="text-sm text-gray-300">
          Share the <span className="font-bold text-sky-400">Room ID</span> from the header with a friend so they can join this private chat from any device.
        </p>
      </div>
      <h2 className="text-xl font-bold my-4">Up next</h2>
      <div className="space-y-3">
        {suggestedVideos.map((video, i) => (
          <div key={video.id} className="flex gap-3 cursor-pointer group" onClick={() => onVideoSelect(video.id)}>
            <img 
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt="video thumbnail" 
              className="rounded-lg w-[168px] h-[94px] object-cover flex-shrink-0 group-hover:opacity-80 transition-opacity" 
            />
            <div className="overflow-hidden">
              <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-white text-gray-200 transition-colors">
                {video.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1">{video.channel}</p>
              <p className="text-xs text-gray-400">{(Math.random() * 5).toFixed(1)}M views &bull; {i + 1} day ago</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
