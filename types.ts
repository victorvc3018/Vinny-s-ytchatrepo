
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
}

export interface VideoInfo {
  title: string;
  author_name: string;
}
