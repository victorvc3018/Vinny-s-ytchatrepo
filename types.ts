
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
}

export interface VideoInfo {
  title: string;
  author_name: string;
}
