
import React from 'react';
import { Message, User } from './types';

interface CommentProps {
  message: Message;
  currentUser: User;
  onReply: (message: Message) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onDelete: (messageId: string) => void;
}

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '🎉', '👎'];

const Comment: React.FC<CommentProps> = ({ message, currentUser, onReply, onToggleReaction, onDelete }) => {
  const isAuthor = message.user.id === currentUser.id;

  return (
    <div className="flex items-start space-x-3 group">
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
        <div className="flex items-center flex-wrap gap-x-1 gap-y-2 mt-2 text-xs text-gray-400">
          {EMOJI_REACTIONS.map(emoji => {
            const reactions = message.reactions?.[emoji] || [];
            const count = reactions.length;
            const userHasReacted = reactions.includes(currentUser.id);
            return (
              <button
                key={emoji}
                onClick={() => onToggleReaction(message.id, emoji)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full hover:bg-gray-700 transition-colors ${userHasReacted ? 'bg-sky-500/20 text-sky-400' : 'bg-[#272727]'}`}
                aria-label={`React with ${emoji}`}
              >
                <span>{emoji}</span>
                {count > 0 && <span className="font-semibold">{count}</span>}
              </button>
            );
          })}
           <button onClick={() => onReply(message)} className="font-semibold hover:text-white transition-colors ml-2 px-2 py-1">Reply</button>
           {isAuthor && (
            <button 
              onClick={() => onDelete(message.id)} 
              className="font-semibold text-red-500 hover:text-red-400 transition-colors ml-2 px-2 py-1 opacity-0 group-hover:opacity-100"
              aria-label="Delete message"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
