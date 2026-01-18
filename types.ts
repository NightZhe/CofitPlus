
export interface Meal {
  id: string;
  timestamp: Date;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  name: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  image?: string;
  feedback?: string;
  isOrdered?: boolean;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  COACH = 'coach',
  LOG = 'log',
  DELIVERY = 'delivery',
  COMMUNITY = 'community',
  PROFILE = 'profile'
}
