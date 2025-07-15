
import React, { useState } from 'react';
import { VideoInfo } from './types';

const ThumbsUpIcon: React.FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"></path></svg>
);
const ThumbsDownIcon: React.FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41-.17-.79-.44-1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path></svg>
);
const ShareIcon: React.FC = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"></path></svg>
);


interface VideoDetailsProps {
  videoInfo: VideoInfo | null;
  isLoading: boolean;
}

const SkeletonText: React.FC<{ className: string }> = ({ className }) => (
  <div className={`bg-gray-700 rounded animate-pulse ${className}`}></div>
);

const VideoDetails: React.FC<VideoDetailsProps> = ({ videoInfo, isLoading }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <div className="mt-4 text-white">
        {isLoading ? (
            <SkeletonText className="h-7 w-3/4 mb-2" />
        ) : (
            <h1 className="text-xl font-bold line-clamp-2">{videoInfo?.title || 'Video Title Not Found'}</h1>
        )}
        
        <div className="mt-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-y-4">
                <div className="flex items-center space-x-4">
                {isLoading ? (
                    <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse flex-shrink-0"></div>
                ) : (
                    <img className="w-10 h-10 rounded-full flex-shrink-0" src="https://picsum.photos/40/40?random=channel" alt="channel avatar" />
                )}
                
                <div>
                    {isLoading ? (
                    <>
                        <SkeletonText className="h-5 w-32 mb-1" />
                        <SkeletonText className="h-4 w-24" />
                    </>
                    ) : (
                    <>
                        <p className="font-semibold text-white">{videoInfo?.author_name || 'Channel Name'}</p>
                        <p className="text-sm text-gray-400">1.23M subscribers</p>
                    </>
                    )}
                </div>
                 <button 
                  onClick={() => setIsSubscribed(!isSubscribed)}
                  className={`font-semibold px-4 py-2 rounded-full text-sm ml-4 transition-colors ${
                    isSubscribed 
                    ? 'bg-[#272727] text-gray-300 hover:bg-gray-600' 
                    : 'bg-white text-black hover:bg-gray-200'
                  }`}
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
                </div>

                <div className="flex items-center space-x-2">
                <div className="flex items-center bg-[#272727] rounded-full">
                    <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-700 rounded-l-full border-r border-gray-500 transition-colors">
                    <ThumbsUpIcon />
                    <span>15K</span>
                    </button>
                    <button className="px-4 py-2 hover:bg-gray-700 rounded-r-full transition-colors">
                    <ThumbsDownIcon />
                    </button>
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 bg-[#272727] rounded-full hover:bg-gray-700 transition-colors">
                    <ShareIcon />
                    <span>Share</span>
                </button>
                </div>
            </div>
            <div className="bg-[#272727] p-3 rounded-lg mt-4 text-sm">
                <div className="flex items-center space-x-4 font-semibold text-gray-300">
                    <span>1.2M views</span>
                    <span>3 days ago</span>
                </div>
                <p className="mt-2 text-gray-400">
                {isLoading ? (
                    <SkeletonText className="h-4 w-full mt-1" />
                ) : videoInfo?.title ? (
                    `Watch more from ${videoInfo.author_name} and enjoy your secret chat!`
                ) : (
                    'This is where the video description would go. In our case, it\'s just a placeholder to make the UI look authentic. Enjoy your secret chat!'
                )}
                </p>
            </div>
        </div>
    </div>
  );
};

export default VideoDetails;
