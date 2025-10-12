import { User } from './index';

export interface Vouch {
  id: string;
  voucherId: string;
  vouchedId: string;
  skillId?: string;
  comment?: string;
  rating: number;
  createdAt: string;
  voucher: User;
  vouched?: User;
}

export interface VouchStats {
  vouches: Vouch[];
  count: number;
  averageRating: number;
}
