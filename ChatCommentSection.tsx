
import React, { useState, useRef } from 'react';
import { Message, User } from './types';
import Comment from './Comment';
import CommentInput from './CommentInput';

interface ChatCommentSectionProps {
  currentUser: User;
  messages: Message[];
  connectionStatus: string;
  topic: string;
  onPublish: (updatedMessages: Message[], topic: string) => void;
}

const UserProfileModal: React.FC<{ user: User; onClose: () => void; onMention: (user: User) => void; }> = ({ user, onClose, onMention }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center" onClick={onClose}>
      <div className="bg-[#282828] rounded-2xl shadow-2xl p-6 ring-1 ring-white/10 w-80 text-center" onClick={e => e.stopPropagation()}>
        <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-full mx-auto ring-4 ring-gray-600" />
        <h3 className="mt-4 text-xl font-bold">{user.username}</h3>
        <p className="text-sm text-gray-400">{user.id}</p>
        <button
          onClick={() => onMention(user)}
          className="mt-6 w-full px-4 py-3 text-base font-semibold text-black bg-[#3ea6ff] rounded-full hover:bg-sky-400 transition-colors"
        >
          Mention @{user.username}
        </button>
      </div>
    </div>
  );
};

const ChatCommentSection: React.FC<ChatCommentSectionProps> = ({ currentUser, messages, connectionStatus, topic, onPublish }) => {
  const [userInput, setUserInput] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessage: Message = {
      id: `${Date.now()}-${currentUser.id}`,
      user: currentUser,
      text: userInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...(replyingTo && { replyTo: replyingTo }),
    };
    
    const updatedHistory = [...messages, newMessage];
    onPublish(updatedHistory, topic);

    setUserInput('');
    setReplyingTo(null);
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    const updatedMessages = messages.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...(msg.reactions || {}) };
        const reactedUsers = reactions[emoji] || [];
        const userIndex = reactedUsers.indexOf(currentUser.id);

        if (userIndex > -1) {
          reactedUsers.splice(userIndex, 1);
        } else {
          reactedUsers.push(currentUser.id);
        }
        
        if (reactedUsers.length === 0) {
          delete reactions[emoji];
        } else {
          reactions[emoji] = reactedUsers;
        }

        return { ...msg, reactions };
      }
      return msg;
    });
    onPublish(updatedMessages, topic);
  };
  
  const handleDeleteMessage = (messageId: string) => {
    const updatedMessages = messages.filter(msg => msg.id !== messageId);
    onPublish(updatedMessages, topic);
  };

  const handleSetReplyingTo = (message: Message) => {
    setReplyingTo(message);
    inputRef.current?.focus();
  };

  const handleShowProfile = (user: User) => {
    setViewingProfile(user);
  };

  const handleMentionUser = (user: User) => {
    setUserInput(prev => `${prev} @${user.username} `.trimStart());
    setViewingProfile(null);
    inputRef.current?.focus();
  };

  return (
    <div>
       {viewingProfile && (
        <UserProfileModal 
          user={viewingProfile} 
          onClose={() => setViewingProfile(null)}
          onMention={handleMentionUser}
        />
      )}
      <div className="flex justify-between items-baseline">
        <h2 className="text-lg font-bold mb-4">{messages.length} Comments</h2>
        <p className="text-xs text-gray-500" title={connectionStatus}>
          {currentUser.username}
        </p>
      </div>

      <CommentInput
        ref={inputRef}
        currentUser={currentUser}
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onSubmit={handleSendMessage}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
      />
      
      <div className="mt-8 space-y-6">
        {messages.slice().reverse().map((msg) => (
          <Comment 
            key={msg.id} 
            message={msg} 
            onReply={handleSetReplyingTo}
            currentUser={currentUser}
            onToggleReaction={handleToggleReaction}
            onDelete={handleDeleteMessage}
            onShowProfile={handleShowProfile}
          />
        ))}
        {messages.length === 0 && (
            <div className="text-center text-gray-500 pt-8">
                <p>The comment section is empty.</p>
                <p>Be the first to say something!</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ChatCommentSection;
