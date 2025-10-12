import { User } from './index';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: User;
  receiver: User;
}

export interface Conversation {
  user: User;
  lastMessage: Message;
  unreadCount: number;
}
