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
  sender: User;      // Make sure this is included
  receiver: User;    // Make sure this is included
}

export interface ConnectionStatusResponse {
  status: ConnectionStatus;
  isSender: boolean;
  connection: Connection | null;
}
