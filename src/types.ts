export interface ViewerDriver {
  label: string;
  percentage: number;
  color: string;
}

export interface BroadcastMilestone {
  episode: string;
  event: string;
  rating: string;
}

export interface DramaShow {
  id: string;
  title: string;
  tag: string;
  score: string;
  likes: number;
  dislikes: number;
  drivers: ViewerDriver[];
  status: string;
  episodes: number;
  averageViewership: string;
  summary: string;
  network: string;
  airTime: string;
  castList: string[];
  milestones?: BroadcastMilestone[];
}

export interface ActorTrend {
  name: string;
  drama: string;
  role: string;
  color: string;
  accentColor: string;
  avatarText: string;
  weeklyScores: number[]; // [Week 1, Week 2, Week 3, Week 4]
  currentGrowth: string;
  bio: string;
  socialReach: string;
  brandIndex: number;
}

export interface DramaOpinion {
  id: string;
  showId: string;
  user: string;
  text: string;
  rating: number;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}
