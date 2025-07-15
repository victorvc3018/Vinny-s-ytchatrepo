
import React from 'react';
import { Message } from './types';

interface CommentProps {
  message: Message;
  onReply: (message: Message) => void;
}

const Comment: React.FC<CommentProps> = ({ message, onReply }) => {
  return (
    <div className="flex items-start space-x-3">
      <img src={message.user.avatar} alt="avatar" className="w-10 h-10 rounded-full flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-baseline space-x-2">
          <p className="font-semibold text-sm text-gray-300">{message.user.username}</p>
          <p className="text-xs text-gray-500">{message.timestamp}</p>
        </div>
        {message.replyTo && (
          <div className="mt-1 p-2 bg-[#272727] border-l-2 border-sky-500 rounded-r-md text-xs">
            <p className="font-semibold text-gray-400">@{message.replyTo.user.username}</p>
            <p className="text-gray-500 line-clamp-1 mt-0.5">{message.replyTo.text}</p>
          </div>
        )}
        <p className="text-white text-sm mt-2 whitespace-pre-wrap">{message.text}</p>
        <div className="flex items-center space-x-2 mt-2 text-xs text-gray-400">
           <button className="px-2 py-1 rounded-full hover:bg-gray-700 transition-colors" aria-label="Like">👍</button>
           <button className="px-2 py-1 rounded-full hover:bg-gray-700 transition-colors" aria-label="Love">❤️</button>
           <button className="px-2 py-1 rounded-full hover:bg-gray-700 transition-colors" aria-label="Laugh">😂</button>
           <button className="px-2 py-1 rounded-full hover:bg-gray-700 transition-colors" aria-label="Celebrate">🎉</button>
           <button className="px-2 py-1 rounded-full hover:bg-gray-700 transition-colors" aria-label="Dislike">👎</button>
           <button onClick={() => onReply(message)} className="font-semibold hover:text-white transition-colors ml-2">Reply</button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
