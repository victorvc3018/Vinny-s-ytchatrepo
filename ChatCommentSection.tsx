
import React, { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';
import { Message, User } from '../types';
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
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<mqtt.MqttClient | null>(null);
  const topic = `${MQTT_TOPIC_PREFIX}/${roomId}`;

  useEffect(() => {
    // A flag to prevent state updates after the component has unmounted.
    let isMounted = true;
    const client = mqtt.connect(MQTT_BROKER_URL);
    clientRef.current = client;

    client.on('connect', () => {
      if (!isMounted) return;
      setConnectionStatus(`Connected to Room: ${roomId}`);
      // Subscribe to the topic. New subscribers will receive the last retained message.
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
            // The payload is the full history, an array of Message objects.
            const history: Message[] = JSON.parse(payloadString);
            if (Array.isArray(history)) {
              setMessages(history);
            }
          } else {
            // If the retained message is empty, it means it's a new room.
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
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !clientRef.current || !clientRef.current.connected) return;

    const newMessage: Message = {
      id: `${Date.now()}-${currentUser.id}`,
      user: currentUser,
      text: userInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    // Append the new message to the current history.
    const updatedHistory = [...messages, newMessage];

    // Publish the entire updated history to the topic with the 'retain' flag.
    // This makes the broker store this message and deliver it to any new subscribers.
    // QoS 1 ensures the message is delivered at least once.
    // NOTE: This implementation has a potential race condition if two users
    // send a message simultaneously. The last message to arrive at the broker
    // will overwrite the other. For a low-traffic chat, this is an acceptable risk.
    clientRef.current.publish(topic, JSON.stringify(updatedHistory), { qos: 1, retain: true });

    // The UI will update when the message is received back from the broker,
    // ensuring all clients stay in sync with the single source of truth.
    setUserInput('');
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
      />
      
      <div className="mt-8 space-y-6">
        {messages.map((msg) => (
          <Comment key={msg.id} message={msg} />
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
