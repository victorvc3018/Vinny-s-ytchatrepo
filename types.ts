
export interface User {
  id: string;
  username: string;
  avatar: string;
}

export interface Message {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  replyTo?: Message;
  reactions?: { [emoji: string]: string[] }; // e.g., { '👍': ['user-id-1', 'user-id-2'] }
}

export interface VideoInfo {
  title: string;
  author_name: string;
}
