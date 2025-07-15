
import React from 'react';
import { Message, User } from './types';

// A simple component to find and convert URLs in text to clickable links.
const Linkify: React.FC<{ text: string }> = ({ text }) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return (
    <>
      {parts.map((part, i) =>
        urlRegex.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:underline break-all"
            onClick={(e) => e.stopPropagation()} // Prevent triggering parent onClick events
          >
            {part}
          </a>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
};

interface CommentProps {
  message: Message;
  currentUser: User;
  onReply: (message: Message) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onDelete: (messageId: string) => void;
  onShowProfile: (user: User) => void;
}

const EMOJI_REACTIONS = ['👍', '❤️', '😂', '🎉', '👎'];

const Comment: React.FC<CommentProps> = ({ message, currentUser, onReply, onToggleReaction, onDelete, onShowProfile }) => {
  const isAuthor = message.user.id === currentUser.id;

  const handleShowProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowProfile(message.user);
  };

  return (
    <div className="flex items-start space-x-3 group">
      <button onClick={handleShowProfile} className="flex-shrink-0" aria-label={`View profile of ${message.user.username}`}>
        <img src={message.user.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
      </button>
      <div className="flex-1">
        <div className="flex items-baseline space-x-2">
          <button onClick={handleShowProfile} className="font-semibold text-sm text-gray-300 hover:underline" aria-label={`View profile of ${message.user.username}`}>{message.user.username}</button>
          <p className="text-xs text-gray-500">{message.timestamp}</p>
        </div>
        {message.replyTo && (
          <div className="mt-1 p-2 bg-[#272727] border-l-2 border-sky-500 rounded-r-md text-xs">
            <p className="font-semibold text-gray-400">@{message.replyTo.user.username}</p>
            <p className="text-gray-500 line-clamp-1 mt-0.5">{message.replyTo.text}</p>
          </div>
        )}
        <p className="text-white text-sm mt-2 whitespace-pre-wrap"><Linkify text={message.text} /></p>
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
