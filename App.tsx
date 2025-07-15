
import React, { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';
import Header from './Header';
import VideoPlayer from './VideoPlayer';
import VideoDetails from './VideoDetails';
import ChatCommentSection from './ChatCommentSection';
import UserSetup from './UserSetup';
import RoomManager from './RoomManager';
import Sidebar from './Sidebar';
import { VideoInfo, User, Message } from './types';

const MQTT_BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt';
const MQTT_TOPIC_PREFIX = 'dittotube/chat';

// Utility function to extract YouTube video ID from URL
const getYouTubeId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return videoId;
      }
    }
  } catch (e) {
    // Fallback for non-URL strings or different formats
  }
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  
  return null;
};


const App: React.FC = () => {
  const [videoId, setVideoId] = useState('jfKfPfyJRdk'); // Default to Lofi Girl
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<'chat' | 'upNext'>('chat');
  
  // MQTT related state lifted up to App
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const clientRef = useRef<mqtt.MqttClient | null>(null);

  useEffect(() => {
    try {
      const savedUser = sessionStorage.getItem('yt-chat-user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Could not retrieve user from session storage:", error);
      sessionStorage.removeItem('yt-chat-user');
    }
  }, []);

  useEffect(() => {
    if (!roomId || !currentUser) return;
    
    const topic = `${MQTT_TOPIC_PREFIX}/${roomId}`;
    const client = mqtt.connect(MQTT_BROKER_URL);
    clientRef.current = client;

    client.on('connect', () => {
      setConnectionStatus(`Connected to Room: ${roomId}`);
      client.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          console.error('Subscription error:', err);
          setConnectionStatus('Subscription failed');
        }
      });
    });

    client.on('message', (receivedTopic, payload) => {
      if (receivedTopic === topic) {
        try {
          const payloadString = payload.toString();
          if (payloadString) {
            const history: Message[] = JSON.parse(payloadString);
            setMessages(Array.isArray(history) ? history : []);
          } else {
            setMessages([]);
          }
        } catch (e) {
          console.error('Failed to parse incoming message history:', e);
          setMessages([]);
        }
      }
    });
    
    client.on('reconnect', () => setConnectionStatus('Reconnecting...'));
    client.on('error', (err) => {
      console.error('MQTT Error:', err);
      setConnectionStatus('Connection Error');
      client.end();
    });

    return () => {
      if (client) {
        client.end();
        clientRef.current = null;
        setMessages([]);
        setConnectionStatus('Disconnected');
      }
    };
  }, [roomId, currentUser]);

  const fetchVideoInfo = async (id: string) => {
    setIsLoadingInfo(true);
    setVideoInfo(null);
    try {
      const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch video data');
      }
      const data = await response.json();
      if (data.error) {
        console.error('Error from oEmbed:', data.error);
        setVideoInfo({ title: 'Video not found or unavailable', author_name: 'Unknown Channel' });
      } else {
        setVideoInfo({
          title: data.title,
          author_name: data.author_name,
        });
      }
    } catch (error) {
      console.error("Could not fetch video details:", error);
    } finally {
      setIsLoadingInfo(false);
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchVideoInfo(videoId);
    }
  }, [videoId]);

  const handleUrlSubmit = (url: string) => {
    const id = getYouTubeId(url);
    if (id) {
      setVideoId(id);
    } else {
      alert('Could not find a valid YouTube video ID in the provided link.');
    }
  };
  
  const handleUserSetup = (username: string) => {
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      username,
      avatar: `https://i.pravatar.cc/40?u=${username}`
    };
    sessionStorage.setItem('yt-chat-user', JSON.stringify(newUser));
    setCurrentUser(newUser);
  };

  const handleRoomSelect = (selectedRoomId: string) => {
    if (selectedRoomId.trim()) {
      setRoomId(selectedRoomId.trim());
    }
  };

  const publishMessages = (updatedMessages: Message[], topic: string) => {
    if (clientRef.current && clientRef.current.connected) {
      const payload = JSON.stringify(updatedMessages);
      clientRef.current.publish(topic, payload, { qos: 1, retain: true });
    }
  };
  
  const handleDeleteRoom = () => {
    if (clientRef.current && clientRef.current.connected && roomId) {
      const topic = `${MQTT_TOPIC_PREFIX}/${roomId}`;
      // Publish an empty payload with retain flag to clear history
      clientRef.current.publish(topic, '', { qos: 1, retain: true }, (err) => {
        if (err) {
          console.error("Failed to delete room:", err);
          alert("Could not delete room. Please try again.");
        } else {
          // Disconnect and reset state
          clientRef.current?.end();
          setRoomId(null);
        }
      });
    }
  };

  if (!currentUser) {
    return <UserSetup onUserSetup={handleUserSetup} />;
  }

  if (!roomId) {
    return <RoomManager onRoomSelect={handleRoomSelect} />;
  }
  
  const topic = `${MQTT_TOPIC_PREFIX}/${roomId}`;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans flex flex-col">
      <Header onUrlSubmit={handleUrlSubmit} user={currentUser} roomId={roomId} onDeleteRoom={handleDeleteRoom} />
      <main className="flex-grow p-4 lg:p-6">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          <div className="lg:col-span-2 xl:col-span-3">
            <VideoPlayer videoId={videoId} />
            <VideoDetails videoInfo={videoInfo} isLoading={isLoadingInfo} />
            
            <div className="mt-6 hidden lg:block">
              <ChatCommentSection 
                currentUser={currentUser} 
                messages={messages}
                connectionStatus={connectionStatus}
                onPublish={publishMessages}
                topic={topic}
              />
            </div>
          </div>
          
          <div className="lg:col-span-1 xl:col-span-1">
            <div className="lg:hidden mt-4">
              <div className="flex border-b border-gray-700 mb-4">
                <button
                  onClick={() => setActiveMobileTab('chat')}
                  className={`flex-1 text-center py-2 text-sm font-semibold transition-colors ${
                    activeMobileTab === 'chat' ? 'text-white border-b-2 border-white' : 'text-gray-400'
                  }`}
                  aria-pressed={activeMobileTab === 'chat'}
                >
                  Live Chat
                </button>
                <button
                  onClick={() => setActiveMobileTab('upNext')}
                  className={`flex-1 text-center py-2 text-sm font-semibold transition-colors ${
                    activeMobileTab === 'upNext' ? 'text-white border-b-2 border-white' : 'text-gray-400'
                  }`}
                  aria-pressed={activeMobileTab === 'upNext'}
                >
                  Up Next
                </button>
              </div>
              {activeMobileTab === 'chat' && (
                <ChatCommentSection 
                  currentUser={currentUser} 
                  messages={messages}
                  connectionStatus={connectionStatus}
                  onPublish={publishMessages}
                  topic={topic}
                />
              )}
              {activeMobileTab === 'upNext' && <Sidebar />}
            </div>

            <div className="hidden lg:block">
              <Sidebar />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
