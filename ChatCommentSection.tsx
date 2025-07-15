
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

const ChatCommentSection: React.FC<ChatCommentSectionProps> = ({ currentUser, messages, connectionStatus, topic, onPublish }) => {
  const [userInput, setUserInput] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    const input = document.querySelector('input[aria-label="Add a reply"], input[aria-label="Add a comment"]') as HTMLInputElement;
    input?.focus();
  };

  return (
    <div>
      <div className="flex justify-between items-baseline">
        <h2 className="text-lg font-bold mb-4">{messages.length} Comments</h2>
        <p className="text-xs text-gray-500" title={connectionStatus}>
          {currentUser.username}
        </p>
      </div>

      <CommentInput
        currentUser={currentUser}
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onSubmit={handleSendMessage}
        replyingTo={replyingTo}
        onCancelReply={() => setReplyingTo(null)}
      />
      
      <div className="mt-8 space-y-6" ref={scrollContainerRef}>
        {messages.map((msg) => (
          <Comment 
            key={msg.id} 
            message={msg} 
            onReply={handleSetReplyingTo}
            currentUser={currentUser}
            onToggleReaction={handleToggleReaction}
            onDelete={handleDeleteMessage}
          />
        ))}
        {messages.length === 0 && (
            <div className="text-center text-gray-500 pt-8">
                <p>The comment section is empty.</p>
                <p>Be the first to say something!</p>
            </div>
        )}
        <div ref={commentsEndRef} />
      </div>
    </div>
  );
};

export default ChatCommentSection;
