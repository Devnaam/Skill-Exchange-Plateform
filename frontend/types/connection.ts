import { User } from './index';

export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'NONE';

export interface Connection {
  id: string;
  senderId: string;
  receiverId: string;
  status: ConnectionStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
  sender: User;
  receiver: User;
}

export interface ConnectionStatusResponse {
  status: ConnectionStatus;
  isSender: boolean;
  connection: Connection | null;
}
