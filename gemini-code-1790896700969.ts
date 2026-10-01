import { ProfileCategory, RankInfo } from '../types';

export const PROFILES_CONFIG: Record<ProfileCategory, { name: string; icon: string; ranks: RankInfo[] }> = {
  demon_slayer: {
    name: "Demon Slayer",
    icon: "⚔️",
    ranks: [
      { level: 1, rank: "Beginner", character: "Tanjiro", modelPath: "tanjiro", requiredXp: 0 },
      { level: 2, rank: "Rookie", character: "Zenitsu", modelPath: "zenitsu", requiredXp: 200 },
      { level: 3, rank: "Fighter", character: "Inosuke", modelPath: "inosuke", requiredXp: 500 },
      { level: 4, rank: "Elite", character: "Rengoku", modelPath: "rengoku", requiredXp: 1000 },
      { level: 5, rank: "Hashira", character: "Giyu", modelPath: "giyu", requiredXp: 1800 },
      { level: 6, rank: "Legend", character: "Yoriichi", modelPath: "yoriichi", requiredXp: 3000 },
    ]
  },
  one_piece: {
    name: "One Piece",
    icon: "🏴‍☠️",
    ranks: [
      { level: 1, rank: "Beginner", character: "Usopp", modelPath: "usopp", requiredXp: 0 },
      { level: 2, rank: "Rookie", character: "Nami", modelPath: "nami", requiredXp: 200 },
      { level: 3, rank: "Fighter", character: "Sanji", modelPath: "sanji", requiredXp: 500 },
      { level: 4, rank: "Elite", character: "Zoro", modelPath: "zoro", requiredXp: 1000 },
      { level: 5, rank: "Captain", character: "Luffy", modelPath: "luffy", requiredXp: 1800 },
      { level: 6, rank: "Legend", character: "Gear 5 Luffy", modelPath: "gear5_luffy", requiredXp: 3000 },
    ]
  },
  mha: {
    name: "My Hero Academia",
    icon: "💥",
    ranks: [
      { level: 1, rank: "Beginner", character: "Deku", modelPath: "deku", requiredXp: 0 },
      { level: 2, rank: "Rookie", character: "Bakugo", modelPath: "bakugo", requiredXp: 200 },
      { level: 3, rank: "Hero", character: "Todoroki", modelPath: "todoroki", requiredXp: 500 },
      { level: 4, rank: "Elite", character: "Endeavor", modelPath: "endeavor", requiredXp: 1000 },
      { level: 5, rank: "Pro Hero", character: "All Might", modelPath: "allmight", requiredXp: 1800 },
      { level: 6, rank: "Legend", character: "Deku 100%", modelPath: "deku100", requiredXp: 3000 },
    ]
  },
  dr_stone: {
    name: "Dr. Stone",
    icon: "🧪",
    ranks: [
      { level: 1, rank: "Beginner", character: "Chrome", modelPath: "chrome", requiredXp: 0 },
      { level: 2, rank: "Learner", character: "Suika", modelPath: "suika", requiredXp: 200 },
      { level: 3, rank: "Scientist", character: "Senku", modelPath: "senku", requiredXp: 500 },
      { level: 4, rank: "Inventor", character: "Kaseki", modelPath: "kaseki", requiredXp: 1000 },
      { level: 5, rank: "Genius", character: "Senku (Genius)", modelPath: "senku_genius", requiredXp: 1800 },
      { level: 6, rank: "Science Master", character: "Senku + Kingdom of Science", modelPath: "science_kingdom", requiredXp: 3000 },
    ]
  },
  marvel: {
    name: "Marvel",
    icon: "🛡️",
    ranks: [
      { level: 1, rank: "Beginner", character: "Spider-Man", modelPath: "spiderman", requiredXp: 0 },
      { level: 2, rank: "Rookie", character: "Captain America", modelPath: "captain_america", requiredXp: 200 },
      { level: 3, rank: "Hero", character: "Iron Man", modelPath: "ironman", requiredXp: 500 },
      { level: 4, rank: "Elite", character: "Thor", modelPath: "thor", requiredXp: 1000 },
      { level: 5, rank: "Master", character: "Doctor Strange", modelPath: "doctor_strange", requiredXp: 1800 },
      { level: 6, rank: "Legend", character: "Thanos", modelPath: "thanos", requiredXp: 3000 },
    ]
  },
  harry_potter: {
    name: "Harry Potter",
    icon: "⚡",
    ranks: [
      { level: 1, rank: "Level 1", character: "Hogwarts Student", modelPath: "hogwarts_student", requiredXp: 0 },
      { level: 2, rank: "Level 2", character: "Gryffindor Student", modelPath: "gryffindor", requiredXp: 200 },
      { level: 3, rank: "Level 3", character: "Young Wizard", modelPath: "young_wizard", requiredXp: 500 },
      { level: 4, rank: "Level 4", character: "Advanced Wizard", modelPath: "advanced_wizard", requiredXp: 1000 },
      { level: 5, rank: "Level 5", character: "Auror", modelPath: "auror", requiredXp: 1500 },
      { level: 6, rank: "Level 6", character: "Dumbledore-level Wizard", modelPath: "dumbledore", requiredXp: 2200 },
      { level: 7, rank: "Level 7", character: "Wizard Legend", modelPath: "wizard_legend", requiredXp: 3000 },
    ]
  }
};