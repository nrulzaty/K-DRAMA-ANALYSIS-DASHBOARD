import { DramaShow, ActorTrend, DramaOpinion } from './types';

export const INITIAL_SHOWS: DramaShow[] = [
  {
    id: 'royal-nemesis',
    title: 'My Royal Nemesis',
    tag: 'Fantasy Rom-Com',
    score: '8.9/10',
    likes: 86,
    dislikes: 14,
    drivers: [
      { label: 'Chaotic Chemistry', percentage: 92, color: 'from-pink-500 to-rose-500' },
      { label: 'Lim Ji-yeon Performance', percentage: 88, color: 'from-pink-400 to-pink-600' },
      { label: 'Time-Travel Plot', percentage: 78, color: 'from-rose-400 to-rose-600' },
      { label: 'Comedy Timing', percentage: 65, color: 'from-pink-300 to-pink-500' }
    ],
    status: 'Trending #1 Worldwide',
    episodes: 16,
    averageViewership: '12.4%',
    network: 'tvN',
    airTime: 'Saturdays & Sundays 21:10 (KST)',
    summary: 'A modern-day cynical criminal prosecutor is swept back 500 years in time into the body of an exiled Joseon princess, only to cross paths with her nemesis, a hot-tempered royal guard commander who happens to look exactly like her annoying ex-boyfriend.',
    castList: ['Lim Ji-yeon', 'Kim Do-wan', 'Shin Ye-eun', 'Heo Sung-tae'],
    milestones: [
      { episode: 'Ep 1-4', event: 'Modern slang rants in the classic Joseon court go viral', rating: '8.2%' },
      { episode: 'Ep 5-8', event: 'Swordplay battle and tearful modern world throwback confession', rating: '11.5%' },
      { episode: 'Ep 9-12', event: 'Joseon Court trial duel with Lim Ji-yeon using modern laws', rating: '14.1% Peak' }
    ]
  },
  {
    id: 'kitchen-soldier',
    title: 'The Legend of Kitchen Soldier',
    tag: 'Military Comedy',
    score: '9.2/10',
    likes: 91,
    dislikes: 9,
    drivers: [
      { label: 'Park Ji-hoon Star Power', percentage: 94, color: 'from-violet-500 to-purple-500' },
      { label: 'Comforting Cooking Quests', percentage: 85, color: 'from-purple-400 to-violet-600' },
      { label: 'Slice of Life Tone', percentage: 72, color: 'from-violet-400 to-purple-600' },
      { label: 'Military Camaraderie', percentage: 68, color: 'from-purple-300 to-violet-500' }
    ],
    status: 'Critically Acclaimed Peak',
    episodes: 12,
    averageViewership: '15.8%',
    network: 'KBS2',
    airTime: 'Mondays & Tuesdays 22:00 (KST)',
    summary: 'A clumsy military recruit summons the ghost of a legendary Michelin-starred chef, helping him survive military campaigns, win cooking contests amongst rival platoons, and solve suspicious base conspiracies.',
    castList: ['Park Ji-hoon', 'Choi Hyun-wook', 'Kang Hoon', 'Lee Jun-hyuk'],
    milestones: [
      { episode: 'Ep 1-3', event: 'Summoning of ghost Michelin chef in campsite kitchen', rating: '9.8%' },
      { episode: 'Ep 4-7', event: 'Culinary Platoon dual cooking duel against special forces', rating: '13.4%' },
      { episode: 'Ep 8-11', event: 'Grand Platter Exam cookoff causes massive ingredient sellout', rating: '16.7%' }
    ]
  }
];

export const ACTOR_TRENDS: ActorTrend[] = [
  {
    name: 'Lim Ji-yeon',
    drama: 'My Royal Nemesis',
    role: 'Princess Hwa-young / Prosecutor Kang Ji-soo',
    color: '#EC4899', // Pink-500
    accentColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    avatarText: 'LJ',
    weeklyScores: [72, 85, 91, 96],
    currentGrowth: '+24%',
    bio: 'An award-winning actress celebrated for her wide range. In "My Royal Nemesis," she masters a double-layered character juggling fast-talking prosecutor wits and subtle royal court vulnerability.',
    socialReach: '4.8M Active Mentions',
    brandIndex: 98.4
  },
  {
    name: 'Park Ji-hoon',
    drama: 'The Legend of Kitchen Soldier',
    role: 'Recruit Kang Tae-sik',
    color: '#A855F7', // Purple-500
    accentColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    avatarText: 'PJ',
    weeklyScores: [80, 88, 89, 94],
    currentGrowth: '+18%',
    bio: 'Critically acclaimed performer who brings profound psychological complexity to comedic roles. His breakout performance in "Kitchen Soldier" has sparked a massive domestic cooking wave.',
    socialReach: '6.2M Active Mentions',
    brandIndex: 99.1
  }
];

export const INITIAL_OPINIONS: DramaOpinion[] = [
  {
    id: '1',
    showId: 'royal-nemesis',
    user: 'kdrama_lover_99',
    text: 'Lim Ji-yeon throwing 21st-century hand gestures in Joseon era made me wheeze. The romantic bickering with Kim Do-wan is stellar!',
    rating: 9,
    timestamp: '2 hours ago',
    sentiment: 'positive'
  },
  {
    id: '2',
    showId: 'royal-nemesis',
    user: 'han_seoul_mate',
    text: 'The pacing in episode 6 slowed down slightly, but the comedy remains sharp. The court politics could use more tension, but the chaotic lead chemistry carries the entire series.',
    rating: 8,
    timestamp: '5 hours ago',
    sentiment: 'neutral'
  },
  {
    id: '3',
    showId: 'kitchen-soldier',
    user: 'soldier_chef',
    text: 'Literally the best military comedy since Crash Landing on You! Park Ji-hoon represents perfect goofy rookie energy, and the ghost of the chef makes the food look incredibly hunger-inducing.',
    rating: 10,
    timestamp: '1 hour ago',
    sentiment: 'positive'
  },
  {
    id: '4',
    showId: 'kitchen-soldier',
    user: 'tv_critic_kim',
    text: 'Extremely cozy and pleasant, though the military recruitment subplot in Episode 4 was highly exaggerated. Despite that, this is the ultimate comforting winter comforting watch!',
    rating: 9,
    timestamp: '8 hours ago',
    sentiment: 'positive'
  }
];
