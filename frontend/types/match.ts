import { User, UserSkill } from './index';

export type MatchType = 'PERFECT_SWAP' | 'TEACHER' | 'LEARNER' | 'NO_MATCH';

export interface Match extends User {
  matchType: MatchType;
  matchScore: number;
  userSkills?: UserSkill[];
}

export interface MatchDetails {
  user: User & { userSkills: UserSkill[] };
  matchType: MatchType;
  theyCanTeachMe: UserSkill[];
  iCanTeachThem: UserSkill[];
}
