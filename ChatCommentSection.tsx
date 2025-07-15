
import React, { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';
import { Message, User } from './types';
import Comment from './Comment';
import CommentInput from './CommentInput';

const MQTT_BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt';
const MQTT_TOPIC_PREFIX = 'dittotube/chat';

interface ChatCommentSectionProps {
  currentUser: User;
  roomId: string;
}

const ChatCommentSection: React.FC<ChatCommentSectionProps> = ({ currentUser, roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<mqtt.MqttClient | null>(null);
  const topic = `${MQTT_TOPIC_PREFIX}/${roomId}`;

  useEffect(() => {
    let isMounted = true;
    const client = mqtt.connect(MQTT_BROKER_URL);
    clientRef.current = client;

    client.on('connect', () => {
      if (!isMounted) return;
      setConnectionStatus(`Connected to Room: ${roomId}`);
      client.subscribe(topic, { qos: 1 }, (err) => {
        if (err && isMounted) {
          console.error('Subscription error:', err);
          setConnectionStatus('Subscription failed');
        }
      });
    });

    client.on('message', (receivedTopic, payload) => {
      if (receivedTopic === topic && isMounted) {
        try {
          const payloadString = payload.toString();
          if (payloadString) {
            const history: Message[] = JSON.parse(payloadString);
            if (Array.isArray(history)) {
              setMessages(history);
            }
          } else {
            setMessages([]);
          }
        } catch (e) {
          console.error('Failed to parse incoming message history:', e);
        }
      }
    });
    
    client.on('reconnect', () => { if (isMounted) setConnectionStatus('Reconnecting...'); });
    client.on('error', (err) => {
      if (isMounted) {
        console.error('MQTT Error:', err);
        setConnectionStatus('Connection Error');
      }
      client.end();
    });

    return () => {
      isMounted = false;
      if (client) {
        client.end();
      }
    };
  }, [roomId, topic]);

  useEffect(() => {
    const node = scrollContainerRef.current;
    if (node) {
      // Only scroll if user is near the bottom (within 150px)
      const isScrolledToBottom = node.scrollHeight - node.scrollTop <= node.clientHeight + 150;
      if (isScrolledToBottom) {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !clientRef.current || !clientRef.current.connected) return;

    const newMessage: Message = {
      id: `${Date.now()}-${currentUser.id}`,
      user: currentUser,
      text: userInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...(replyingTo && { replyTo: replyingTo }),
    };
    
    const updatedHistory = [...messages, newMessage];

    clientRef.current.publish(topic, JSON.stringify(updatedHistory), { qos: 1, retain: true });

    setUserInput('');
    setReplyingTo(null);
  };

  const handleSetReplyingTo = (message: Message) => {
    setReplyingTo(message);
    // Optional: focus the input field
    const input = document.querySelector('input[aria-label="Add a reply"]') as HTMLInputElement;
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
          <Comment key={msg.id} message={msg} onReply={handleSetReplyingTo} />
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
