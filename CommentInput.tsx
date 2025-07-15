
import React from 'react';
import { User, Message } from './types';

interface CommentInputProps {
  currentUser: User;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  replyingTo: Message | null;
  onCancelReply: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ currentUser, value, onChange, onSubmit, replyingTo, onCancelReply }) => {

  const handleCancel = () => {
    const emptyEvent = {
      target: { value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(emptyEvent);
  };

  return (
    <div className="flex items-start space-x-3 mt-6">
      <img src={currentUser.avatar} alt="user avatar" className="w-10 h-10 rounded-full" />
      <form className="w-full" onSubmit={onSubmit}>
        {replyingTo && (
          <div className="bg-[#272727] text-xs text-gray-400 px-3 py-1.5 rounded-t-md flex justify-between items-center">
            <span>Replying to <span className="font-semibold text-gray-300">@{replyingTo.user.username}</span></span>
            <button
              type="button"
              onClick={onCancelReply}
              className="font-bold text-lg leading-none hover:text-white"
              aria-label="Cancel reply"
            >
              &times;
            </button>
          </div>
        )}
        <input
          type="text"
          placeholder={replyingTo ? "Add a reply..." : "Add a comment..."}
          className={`w-full bg-transparent border-b-2 border-gray-700 focus:border-white outline-none pb-1 text-sm text-white transition-colors duration-300 ${replyingTo ? 'pl-3' : ''}`}
          value={value}
          onChange={onChange}
          aria-label={replyingTo ? "Add a reply" : "Add a comment"}
        />
        <div className="flex justify-end space-x-4 mt-2 h-9">
          {value && (
            <>
              <button
                type="button"
                className="text-sm text-gray-400 hover:text-white font-semibold px-4 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-sm bg-[#3ea6ff] text-black font-semibold px-4 py-2.5 rounded-full disabled:bg-[#272727] disabled:text-gray-400 enabled:hover:bg-sky-400 transition-colors"
                disabled={!value.trim()}
              >
               {replyingTo ? 'Reply' : 'Comment'}
              </button>
            </>
           )}
        </div>
      </form>
    </div>
  );
};

export default CommentInput;
