import React from 'react';
import { User } from '../types';

interface CommentInputProps {
  currentUser: User;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ currentUser, value, onChange, onSubmit }) => {

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
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full bg-transparent border-b-2 border-gray-700 focus:border-white outline-none pb-1 text-sm text-white transition-colors duration-300"
          value={value}
          onChange={onChange}
          aria-label="Add a comment"
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
               Comment
              </button>
            </>
           )}
        </div>
      </form>
    </div>
  );
};

export default CommentInput;