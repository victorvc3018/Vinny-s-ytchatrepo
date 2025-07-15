import React from 'react';

const Sidebar: React.FC = () => {
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
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex gap-3 cursor-pointer group">
            <img 
              src={`https://picsum.photos/168/94?random=${i}`} 
              alt="video thumbnail" 
              className="rounded-lg w-[168px] h-[94px] object-cover flex-shrink-0 group-hover:opacity-80 transition-opacity" 
            />
            <div className="overflow-hidden">
              <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-white text-gray-200 transition-colors">
                This is a suggested video title that is quite long to test text wrapping
              </h3>
              <p className="text-xs text-gray-400 mt-1">Another Channel</p>
              <p className="text-xs text-gray-400">1.2M views &bull; 1 day ago</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
