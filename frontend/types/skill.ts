export type SkillType = 'OFFERED' | 'WANTED';

export type ProficiencyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  createdAt?: string;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  type: SkillType;
  proficiencyLevel?: ProficiencyLevel;
  description?: string;
  skill: Skill;
  createdAt?: string;
}

export interface AddSkillData {
  skillId?: string;
  skillName?: string;
  category?: string;
  type: SkillType;
  proficiencyLevel?: ProficiencyLevel;
  description?: string;
}
