export type ProfileCategory = 'demon_slayer' | 'one_piece' | 'mha' | 'dr_stone' | 'marvel' | 'harry_potter';

export interface RankInfo {
  level: number;
  rank: string;
  character: string;
  modelPath: string;
  requiredXp: number;
}

export interface Question {
  id: string;
  week: 1 | 2;
  topicId: string;
  source: "textbook";
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  conceptId: string;
  knowledgePointId: string;
}

export interface Topic {
  id: string;
  title: string;
  model3D: 'cell' | 'tissue' | 'water' | 'element' | 'organic' | 'fertilizer' | 'dna' | 'plant' | 'animal';
  description: string;
}

export type SectionType = 'modules' | 'character' | 'mistakes' | 'monthly';