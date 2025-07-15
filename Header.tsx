
import React, { useState } from 'react';
import { User } from './types';

// Icons
const YouTubeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-auto text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.41 19.83,18.65C19.36,18.78 18.73,18.87 17.93,18.94C17.13,19.01 16.44,19.04 15.84,19.04L15,19.05C12.81,19.05 11.2,19.16 10.17,19.4C9.27,19.65 8.59,20.23 8.35,21.13C8.22,21.6 8.13,22.23 8.06,23.03C7.99,23.83 7.96,24.52 7.96,25.12L7.95,25.21C7.95,27.4 8.11,29 8.35,30C8.59,30.87 9.27,31.56 10.17,31.8C10.64,31.93 11.27,32.02 12.07,32.09C12.87,32.16 13.56,32.19 14.16,32.19L15,32.2C17.19,32.2 18.8,32.09 19.83,31.85C20.73,31.6 21.41,31.02 21.65,30.12C21.78,29.65 21.87,29.02 21.94,28.22C22.01,27.42 22.04,26.73 22.04,26.13L22.05,26.04C22.05,23.85 21.89,22.24 21.65,21.21C21.4,20.31 20.82,19.63 19.92,19.39C19.45,19.26 18.82,19.17 18.02,19.1C17.22,19.03 16.53,19 15.93,19L15.84,18.99C13.65,18.99 12.04,18.88 11.01,18.64C10.11,18.39 9.43,17.81 9.19,16.91C9.06,16.44 8.97,15.81 8.9,15.01C8.83,14.21 8.8,13.52 8.8,12.92L8.79,12.83C8.79,10.64 8.95,9.03 9.19,8C9.43,7.1 10.02,6.42 10.92,6.18C11.39,6.05 12.02,5.96 12.82,5.89C13.62,5.82 14.31,5.79 14.91,5.79L15,5.78C17.19,5.78 18.8,5.89 19.83,6.13C20.73,6.38 21.31,6.96 21.56,7.86L21.56,7.17Z" transform="translate(-7.95 -5.78)"/></svg>
);
const SearchIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const CopyIcon: React.FC<{className?: string}> = ({className}) => (
 <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
);
const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
);
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);


interface HeaderProps {
  onUrlSubmit: (url: string) => void;
  user: User;
  roomId: string;
  onDeleteRoom: () => void;
}

const DELETE_PASSCODE = '3021';

const Header: React.FC<HeaderProps> = ({ onUrlSubmit, user, roomId, onDeleteRoom }) => {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [passcode, setPasscode] = useState('');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onUrlSubmit(url);
      setUrl('');
      setIsMobileSearchVisible(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  const handleDeleteConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === DELETE_PASSCODE) {
      onDeleteRoom();
      setIsDeleteModalOpen(false);
      setPasscode('');
    } else {
      alert('Incorrect passcode.');
    }
  };

  return (
    <>
      <header className="bg-[#212121] px-4 py-3 sticky top-0 z-20 border-b border-gray-700 h-[60px] flex items-center">
        <div className="flex items-center justify-between gap-4 w-full relative">
          
          <div className={`absolute top-1/2 -translate-y-1/2 left-0 w-full h-full bg-[#212121] flex items-center px-2 gap-2 transition-transform duration-300 ease-in-out ${isMobileSearchVisible ? 'translate-x-0' : '-translate-x-full'} sm:hidden`}>
            <button onClick={() => setIsMobileSearchVisible(false)} aria-label="Back" className="p-2">
              <ArrowLeftIcon className="w-6 h-6 text-gray-300" />
            </button>
            <form onSubmit={handleSubmit} className="w-full flex">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube video link..."
                className="w-full bg-[#121212] border border-gray-700 text-gray-200 rounded-l-full px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                aria-label="Paste YouTube video link"
                autoFocus
              />
              <button type="submit" className="bg-[#383838] border border-gray-700 border-l-0 px-5 py-2 rounded-r-full hover:bg-gray-600 transition-colors" aria-label="Search">
                <SearchIcon className="w-5 h-5 text-gray-300" />
              </button>
            </form>
          </div>

          <div className={`flex items-center justify-between w-full transition-opacity duration-200 ${isMobileSearchVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex items-center space-x-3 flex-shrink-0">
              <YouTubeIcon />
              <span className="text-white text-xl font-bold tracking-tighter">YouTube</span>
            </div>

            <div className="hidden sm:flex flex-1 px-8 lg:max-w-3xl">
              <form onSubmit={handleSubmit} className="w-full max-w-xl flex mx-auto">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube video link..."
                  className="w-full bg-[#121212] border border-gray-700 text-gray-200 rounded-l-full px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors text-sm sm:text-base"
                  aria-label="Paste YouTube video link"
                />
                <button type="submit" className="bg-[#383838] border border-gray-700 border-l-0 px-5 py-2.5 rounded-r-full hover:bg-gray-600 transition-colors" aria-label="Search">
                  <SearchIcon className="w-5 h-5 text-gray-300" />
                </button>
              </form>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button onClick={() => setIsMobileSearchVisible(true)} className="p-2 sm:hidden" aria-label="Open search">
                <SearchIcon className="w-6 h-6 text-gray-300" />
              </button>
              <div className="hidden md:flex items-center space-x-2 bg-[#272727] pl-3 pr-2 py-1.5 rounded-full">
                  <span className="text-xs text-gray-400">ROOM ID:</span>
                  <span className="text-sm font-mono text-white">{roomId}</span>
                  <button onClick={handleCopy} className="p-1.5 rounded-full hover:bg-gray-600 transition-colors" aria-label="Copy Room ID">
                    {copied ? <span className="text-xs text-sky-400">Copied!</span> : <CopyIcon className="w-5 h-5 text-gray-300" />}
                  </button>
                  <button onClick={() => setIsDeleteModalOpen(true)} className="p-1.5 rounded-full hover:bg-red-900/50 transition-colors" aria-label="Delete Room">
                    <TrashIcon className="w-5 h-5 text-red-500" />
                  </button>
              </div>
              <img src={user.avatar} alt="user avatar" className="w-9 h-9 rounded-full" />
               <button onClick={() => setIsDeleteModalOpen(true)} className="p-2 md:hidden" aria-label="Delete Room">
                    <TrashIcon className="w-6 h-6 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#282828] rounded-2xl shadow-2xl p-6 ring-1 ring-white/10">
            <h2 className="text-xl font-bold text-white">Delete Room</h2>
            <p className="text-gray-300 mt-2">This will permanently delete the entire chat history for room <strong className="font-mono text-white">{roomId}</strong>. This action cannot be undone.</p>
            <p className="text-gray-400 text-sm mt-1">All participants will be disconnected.</p>
            
            <form onSubmit={handleDeleteConfirm} className="mt-6">
              <label htmlFor="passcode" className="text-sm font-medium text-gray-300">Enter passcode to confirm</label>
              <input
                id="passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full mt-1 px-4 py-3 bg-[#121212] border border-gray-600 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-center font-mono tracking-wider"
                placeholder="****"
                autoFocus
              />
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-transparent rounded-full hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passcode !== DELETE_PASSCODE}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-full hover:bg-red-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
