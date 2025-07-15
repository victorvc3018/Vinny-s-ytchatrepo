
import React from 'react';
import { Message } from '../types';

interface CommentProps {
  message: Message;
}

const Comment: React.FC<CommentProps> = ({ message }) => {
  return (
    <div className="flex items-start space-x-3">
      <img src={message.user.avatar} alt="avatar" className="w-10 h-10 rounded-full flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-baseline space-x-2">
          <p className="font-semibold text-sm text-gray-300">{message.user.username}</p>
          <p className="text-xs text-gray-500">{message.timestamp}</p>
        </div>
        <p className="text-white text-sm mt-1 whitespace-pre-wrap">{message.text}</p>
        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
           <button className="hover:text-white transition-colors">👍</button>
           <button className="hover:text-white transition-colors">👎</button>
           <button className="font-semibold hover:text-white transition-colors">Reply</button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
