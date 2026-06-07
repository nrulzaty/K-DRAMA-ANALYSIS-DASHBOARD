import { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  BarChart3, 
  TrendingUp, 
  Award, 
  Calendar, 
  Tv, 
  Flame, 
  Heart, 
  ChevronRight, 
  User, 
  RefreshCw, 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  Check, 
  Info, 
  Activity, 
  Users, 
  Plus, 
  Smile, 
  TrendingDown, 
  ThumbsDown,
  Search
} from 'lucide-react';
import { INITIAL_SHOWS, ACTOR_TRENDS, INITIAL_OPINIONS } from './data';
import { DramaShow, ActorTrend, DramaOpinion } from './types';

export default function App() {
  // State variables
  const [shows, setShows] = useState<DramaShow[]>(INITIAL_SHOWS);
  const [opinions, setOpinions] = useState<DramaOpinion[]>(INITIAL_OPINIONS);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(3); // Default to Week 4 (latest)
  const [activeActorHighlight, setActiveActorHighlight] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Just now');
  
  // Tabs for Card A & Card B: 'overview' | 'forum' | 'insights'
  const [activeTabs, setActiveTabs] = useState<Record<string, 'overview' | 'forum' | 'insights'>>({
    'royal-nemesis': 'overview',
    'kitchen-soldier': 'overview'
  });

  // Dynamic show voters simulator state
  const [showVotes, setShowVotes] = useState<Record<string, Record<string, number>>>({
    'royal-nemesis': {
      'Chaotic Chemistry': 4280,
      'Lim Ji-yeon Performance': 3950,
      'Time-Travel Plot': 3120,
      'Comedy Timing': 2540
    },
    'kitchen-soldier': {
      'Park Ji-hoon Star Power': 5120,
      'Comforting Cooking Quests': 4480,
      'Slice of Life Tone': 3650,
      'Military Camaraderie': 3240
    }
  });

  // New opinion form state
  const [newOpinionUser, setNewOpinionUser] = useState<Record<string, string>>({
    'royal-nemesis': '',
    'kitchen-soldier': ''
  });
  const [newOpinionText, setNewOpinionText] = useState<Record<string, string>>({
    'royal-nemesis': '',
    'kitchen-soldier': ''
  });
  const [newOpinionRating, setNewOpinionRating] = useState<Record<string, number>>({
    'royal-nemesis': 9,
    'kitchen-soldier': 10
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({
    'royal-nemesis': '',
    'kitchen-soldier': ''
  });
  const [formSuccess, setFormSuccess] = useState<Record<string, boolean>>({
    'royal-nemesis': false,
    'kitchen-soldier': false
  });

  // VS Comparison Matchup Arena states
  const [showVsArena, setShowVsArena] = useState<boolean>(false);
  const [vsShowIdA, setVsShowIdA] = useState<string>('royal-nemesis');
  const [vsShowIdB, setVsShowIdB] = useState<string>('kitchen-soldier');

  // Executive Dossier compilation states
  const [compiledReportShowId, setCompiledReportShowId] = useState<string | null>(null);
  const [showReportCopied, setShowReportCopied] = useState<boolean>(false);

  // Actor simulation states
  const [isSimulatingActorRep, setIsSimulatingActorRep] = useState<boolean>(false);
  const [actorHypeMultiplier, setActorHypeMultiplier] = useState<number>(1.2);
  const [actorCriticalScore, setActorCriticalScore] = useState<number>(88);
  const [actorAdCampaigns, setActorAdCampaigns] = useState<number>(3);

  // AI K-Drama Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchStatus, setSearchStatus] = useState<string>('');

  const handleSearchDrama = async (queryToSearch?: string) => {
    const q = (queryToSearch || searchQuery).trim();
    if (!q) return;

    setIsSearching(true);
    setSearchError(null);
    setSearchStatus('Connecting to broadcasting index...');

    // Rotate realistic loading messages
    const messages = [
      'Scanning media databases...',
      'Retrieving audience rating files...',
      'Analyzing viewer social media sentiment streams...',
      'Formatting high-density analytics profiles...'
    ];
    let msgIdx = 0;
    const interval = setInterval(() => {
      if (msgIdx < messages.length) {
        setSearchStatus(messages[msgIdx]);
        msgIdx++;
      }
    }, 1100);

    try {
      const response = await fetch('/api/drama/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });

      const result = await response.json();
      clearInterval(interval);

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to search for drama.');
      }

      const newShow: DramaShow = result.data;

      // Check if it already exists
      if (shows.some(s => s.id === newShow.id)) {
        setSearchError(`"${newShow.title}" is already loaded in your active dashboard!`);
        // Smooth scroll to card
        setTimeout(() => {
          document.getElementById(`card-${newShow.id}`)?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
        setIsSearching(false);
        return;
      }

      // Add to shows
      setShows(prev => [newShow, ...prev]);

      // Initialize tabs & states for this show
      setActiveTabs(prev => ({ ...prev, [newShow.id]: 'overview' }));
      
      const parsedVotes: Record<string, number> = {};
      newShow.drivers.forEach((d: any) => {
        parsedVotes[d.label] = Math.max(100, Math.floor(d.percentage * 45 + Math.random() * 200));
      });
      setShowVotes(prev => ({ ...prev, [newShow.id]: parsedVotes }));

      // Initialize form variables
      setNewOpinionUser(prev => ({ ...prev, [newShow.id]: '' }));
      setNewOpinionText(prev => ({ ...prev, [newShow.id]: '' }));
      setNewOpinionRating(prev => ({ ...prev, [newShow.id]: 10 }));
      setFormErrors(prev => ({ ...prev, [newShow.id]: '' }));
      setFormSuccess(prev => ({ ...prev, [newShow.id]: false }));

      // Success feedback
      setSearchQuery('');
      setSearchStatus('Drama analytics compiled successfully!');
      setTimeout(() => {
        setSearchStatus('');
        document.getElementById(`card-${newShow.id}`)?.scrollIntoView({ behavior: 'smooth' });
      }, 1000);

    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      setSearchError(err.message || 'Error occurred during K-Drama indexing. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Format current timestamp helper
  const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Live reload refresh logic
  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdatedTime(`Refreshed at ${getFormattedTime()}`);
      
      // Simulate slight dynamic growth in driver stats on refresh
      setShowVotes(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(showId => {
          Object.keys(updated[showId]).forEach(driverLabel => {
            updated[showId][driverLabel] += Math.floor(Math.random() * 45) + 5;
          });
        });
        return updated;
      });
    }, 850);
  };

  // Compile Executive Performance Dossier
  const getCompiledDossierText = (show: any) => {
    const showOpinions = opinions.filter(o => o.showId === show.id);
    const topOpinions = showOpinions.slice(0, 2).map(o => `* @${o.user} (${o.rating}/10): "${o.text}"`).join('\n') || '* No recent critic fan posts';
    const milestonesList = (show.milestones || []).map((m: any) => `* ${m.episode} [Rating: ${m.rating}] - ${m.event}`).join('\n') || '* No milestones defined';
    const driversList = show.liveDrivers.map((d: any) => `* ${d.label}: ${d.votesCount.toLocaleString()} votes (${d.percentage}%)`).join('\n');

    return `==========================================
K-DRAMA PERFORMANCE EXECUTIVE REPORT
==========================================
OFFICIAL TITLE  : ${show.title.toUpperCase()}
BROADCAST TAG   : ${show.tag.toUpperCase()}
NETWORK INDEX   : ${show.network} | ${show.episodes} EPISODES
LIVE SCHEDULE   : ${show.airTime}
CURRENT STATUS  : ${show.status}

------------------------------------------
CRITICAL SCORE INDEX: ${show.liveScore}
SENTIMENT VALUE     : ${show.liveLikes}% Fans Approved | ${show.liveDislikes}% Fans Disgusted
PEAK VIEWERSHIP     : ${show.averageViewership}
------------------------------------------

AUDIENCE CORE SPECTATOR DRIVERS:
${driversList}

BROADCAST PROGRESS MILESTONES:
${milestonesList}

REPRESENTATIVE FAN REACTION STREAM:
${topOpinions}

==========================================
COMPILED SECURELY BY K-DRAMA METRICS HUB (JUNE 2026)
==========================================`;
  };

  const handleCopyDossier = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
      setShowReportCopied(true);
      setTimeout(() => setShowReportCopied(false), 2500);
    } else {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setShowReportCopied(true);
      setTimeout(() => setShowReportCopied(false), 2500);
    }
  };

  const handleCompileReport = (showId: string) => {
    setCompiledReportShowId(showId);
  };

  // Tab switching handler
  const handleTabChange = (showId: string, tab: 'overview' | 'forum' | 'insights') => {
    setActiveTabs(prev => ({ ...prev, [showId]: tab }));
  };

  // Upvote/Like a core metric driver dynamically
  const handleDriverVote = (showId: string, driverLabel: string) => {
    setShowVotes(prev => {
      const showData = { ...prev[showId] };
      showData[driverLabel] += 12; // Add 12 audience votes
      return {
        ...prev,
        [showId]: showData
      };
    });
  };

  // Submit dynamic review opinion
  const handleAddOpinion = (showId: string) => {
    const user = newOpinionUser[showId].trim() || 'anonymous_fan';
    const text = newOpinionText[showId].trim();
    const rating = newOpinionRating[showId];

    if (!text) {
      setFormErrors(prev => ({ ...prev, [showId]: 'Please write your review thoughts before submitting!' }));
      return;
    }

    if (text.length < 10) {
      setFormErrors(prev => ({ ...prev, [showId]: 'Please provide some detail (at least 10 characters).' }));
      return;
    }

    const sentiment = rating >= 8 ? 'positive' : rating >= 6 ? 'neutral' : 'negative';

    const submittedOpinion: DramaOpinion = {
      id: `user-${Date.now()}`,
      showId,
      user,
      text,
      rating,
      timestamp: 'Just now',
      sentiment
    };

    // Prepend user review to states
    setOpinions(prev => [submittedOpinion, ...prev]);

    // Reset form states
    setNewOpinionUser(prev => ({ ...prev, [showId]: '' }));
    setNewOpinionText(prev => ({ ...prev, [showId]: '' }));
    setNewOpinionRating(prev => ({ ...prev, [showId]: 10 }));
    setFormErrors(prev => ({ ...prev, [showId]: '' }));
    
    setFormSuccess(prev => ({ ...prev, [showId]: true }));
    setTimeout(() => {
      setFormSuccess(prev => ({ ...prev, [showId]: false }));
    }, 3000);
  };

  // Compute live sentiment metrics (combining default stats with opinions)
  const computedMetrics = useMemo(() => {
    return shows.map(show => {
      // Filter opinions for this specific show
      const showOpinions = opinions.filter(o => o.showId === show.id);
      
      // Calculate dynamic average rating based on original score & new reviews
      const baseScore = parseFloat(show.score.split('/')[0]); // e.g. 8.9
      const totalOriginalRatingsWeight = 100; // Mock volume weight
      const totalNewRatingSum = showOpinions.reduce((acc, curr) => acc + curr.rating, 0);
      const computedAverage = (
        (baseScore * totalOriginalRatingsWeight + totalNewRatingSum) / 
        (totalOriginalRatingsWeight + showOpinions.length)
      ).toFixed(2);

      // Sentiment adjustment (likes & dislikes)
      const positiveOpinionsCount = showOpinions.filter(o => o.sentiment === 'positive').length;
      const negativeOpinionsCount = showOpinions.filter(o => o.sentiment === 'negative').length;
      
      const totalLikes = show.likes + positiveOpinionsCount * 5; // Weighted boost
      const totalDislikes = show.dislikes + negativeOpinionsCount * 5;
      const totalLikesSum = totalLikes + totalDislikes;

      const computedLikesPercentage = Math.round((totalLikes / totalLikesSum) * 100);
      const computedDislikesPercentage = 100 - computedLikesPercentage;

      // Extract driver percentages dynamically based on votes ratio
      const votes = showVotes[show.id];
      const maxVote = Math.max(...(Object.values(votes) as number[]));
      
      const dynamicDrivers = show.drivers.map(driver => {
        const itemVotes = votes[driver.label] || 0;
        // Map relative to max votes to retain robust ratios
        const relativePercentage = Math.round((itemVotes / maxVote) * 100);
        return {
          ...driver,
          votesCount: itemVotes,
          percentage: Math.max(20, relativePercentage) // Keep it visually readable
        };
      });

      return {
        ...show,
        liveScore: `${computedAverage}/10`,
        liveLikes: computedLikesPercentage,
        liveDislikes: computedDislikesPercentage,
        liveDrivers: dynamicDrivers,
        liveReviewsCount: showOpinions.length + 1540 // base starting reviews + added reviews
      };
    });
  }, [shows, opinions, showVotes]);

  // Actor Weekly Events details to display interactively on spline graph selection
  const actorWeeklyDetails = [
    {
      week: 'Week 1',
      'Lim Ji-yeon': { score: 72, highlight: 'Dual role debut receives explosive praise for intense comedic contrast and court charm.' },
      'Park Ji-hoon': { score: 80, highlight: 'Debut introduce clumsy rookie recruit Tae-sik, quickly becoming a domestic favorite.' }
    },
    {
      week: 'Week 2',
      'Lim Ji-yeon': { score: 85, highlight: 'Modern-era slang rant in Joseon royal court goes mega-viral on TikTok with 15M+ views.' },
      'Park Ji-hoon': { score: 88, highlight: 'Michelin-starred ghost chef culinary duel sparks massive recipe search queries nationwide.' }
    },
    {
      week: 'Week 3',
      'Lim Ji-yeon': { score: 91, highlight: 'Emotional time-travel paradox confession and tear-filled dispute trends #1 on social media.' },
      'Park Ji-hoon': { score: 89, highlight: 'Comforting speech to struggling rookie recruits pulls massive weekend ratings peak.' }
    },
    {
      week: 'Week 4',
      'Lim Ji-yeon': { score: 96, highlight: 'Sizzling courtroom dynamic speech sweeps global video streaming records.' },
      'Park Ji-hoon': { score: 94, highlight: 'Epic platter final exam banquet scene triggers widespread culinary merchandise sell-out.' }
    }
  ];

  return (
    <div id="analytics-hub-container" className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-pink-500 selection:text-white overflow-x-hidden relative">
      {/* Decorative background glow spheres */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Outer grid backdrop patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 relative z-10">
        
        {/* HEADER SECTION */}
        <header id="dashboard-header" className="border-b border-slate-800 pb-4 mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-pink-500/10 text-pink-400 text-xs font-semibold font-mono tracking-wider px-2.5 py-1 rounded-full uppercase border border-pink-500/20 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-pink-400" />
                Live Broadcast Season
              </span>
              <span className="bg-purple-500/10 text-purple-400 text-xs font-semibold font-mono tracking-wider px-2.5 py-1 rounded-full uppercase border border-purple-500/20">
                June 2026 Index
              </span>
            </div>
            
            {/* Title with pink-to-purple gradient to match High Density theme carefully */}
            <h1 id="header-main-title" className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent uppercase font-display">
              K-Drama Analytics Hub
            </h1>
            
            <p id="header-subtitle" className="text-slate-400 text-xs sm:text-sm mt-1 uppercase tracking-widest font-sans">
              Real-time performance metrics, audience sentiment, and trending actor tracking
            </p>
          </div>

          <div id="header-meta-actions" className="flex items-center gap-3 self-start md:self-auto bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
            <div className="text-right">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">Global Index</p>
              <p className="text-xs font-medium text-slate-300 mt-1 flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Live Feed</span>
              </p>
            </div>
            
            <div className="h-8 w-px bg-slate-800"></div>

            <button
              id="btn-sync-refresh"
              onClick={handleRefreshData}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white transition-all flex items-center gap-2 border border-slate-700/50 cursor-pointer disabled:opacity-50"
              title="Click to refresh live indexes"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-pink-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="font-mono min-w-[70px] text-left">
                {isRefreshing ? 'Syncing...' : 'Sync Index'}
              </span>
            </button>

            <div className="h-8 w-px bg-slate-800"></div>

            {/* Profile Avatar / User Badge */}
            <div className="flex items-center gap-2.5 pl-1 pr-2">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-pink-500/10">
                  KD
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-200">K-Analyst Panel</p>
                <p className="text-[10px] text-slate-500 font-mono">Premium Account</p>
              </div>
            </div>
          </div>
        </header>

        {/* TOP LEVEL STATUS TICKER CARDS */}
        <section id="top-stats-grid" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-sm hover:border-slate-700/60 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium tracking-wide">Worldwide Mentions</span>
              <Flame className="w-4 h-4 text-pink-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">11.0M</p>
            <p className="text-[11px] text-pink-400 mt-1 flex items-center gap-1.5 font-mono">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+32.4% weekly spike</span>
            </p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-sm hover:border-slate-700/60 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium tracking-wide">Average Viewership</span>
              <Tv className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">14.1%</p>
            <p className="text-[11px] text-purple-400 mt-1 flex items-center gap-1.5 font-mono">
              <Award className="w-3.5 h-3.5" />
              <span>Broadcast leaders</span>
            </p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-sm hover:border-slate-700/60 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium tracking-wide">Sentiment Index</span>
              <Smile className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">88.5%</p>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1.5 font-mono">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Strong Positive Vibe</span>
            </p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-sm hover:border-slate-700/60 transition-all">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium tracking-wide">Last Index Update</span>
              <Activity className="w-4 h-4 text-pink-400" />
            </div>
            <p className="text-lg sm:text-xl font-bold font-mono tracking-tight text-slate-200 pt-1">
              {lastUpdatedTime}
            </p>
            <p className="text-[11px] text-slate-500 mt-2 font-mono flex items-center gap-1 hover:text-slate-400 cursor-pointer" onClick={handleRefreshData}>
              <RefreshCw className="w-2.5 h-2.5 text-pink-400" />
              Click to pull fresh reviews
            </p>
          </div>
        </section>

        {/* K-DRAMA SHOW CARDS PANEL (GRID LAYOUT: 2 Columns on desktop, 1 on mobile) */}
        <section id="shows-comparison-section" className="mb-12">

          {/* AI SEARCH & ANALYSIS BOARD */}
          <div id="ai-search-board" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <span className="px-2 py-0.5 bg-pink-500/15 text-pink-400 text-[9px] font-bold uppercase tracking-widest rounded border border-pink-500/20 mb-2 inline-block">
                  AI Real-Time Search & Indexer
                </span>
                <h3 className="text-xl font-bold font-display text-white tracking-tight uppercase">Search & Analyze Any K-Dramas</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Enter any South Korean drama (historical, ongoing, or classic) to retrieve real-time viewer sentiment data, rating indices, core spectator drivers, and cast analytics compiled dynamically.
                </p>
                
                {/* Suggestions row for quick interactive testing */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <span className="text-[10px] text-slate-500 uppercase font-mono mr-1">Trending Suggestions:</span>
                  {['Lovely Runner', 'Queen of Tears', 'Vincenzo', 'Squid Game'].map(sug => (
                    <button
                      key={sug}
                      onClick={() => handleSearchDrama(sug)}
                      disabled={isSearching}
                      className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-slate-700 transition-all font-mono cursor-pointer disabled:opacity-50"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full md:max-w-md shrink-0">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSearchDrama(); }}
                  className="relative flex items-center"
                >
                  <input
                    type="text"
                    required
                    disabled={isSearching}
                    placeholder="Search e.g. Descendants of the Sun, Goblin, Healer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500/50 rounded-xl pl-4 pr-12 py-3 text-xs text-slate-100 placeholder-slate-600 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="absolute right-2 px-3 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 font-bold text-slate-950 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                    title="Click to search drama"
                  >
                    {isSearching ? (
                      <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <Search className="w-3.5 h-3.5" />
                    )}
                  </button>
                </form>

                {isSearching && (
                  <div className="mt-3 flex items-center gap-2 animate-pulse bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
                    <span className="text-[11px] font-mono text-slate-400">{searchStatus}</span>
                  </div>
                )}

                {searchError && (
                  <div className="mt-3 text-xs bg-rose-500/15 border border-rose-500/20 text-rose-400 p-3 rounded-xl">
                    {searchError}
                  </div>
                )}
                
                {searchStatus && !isSearching && !searchError && (
                  <div className="mt-3 text-xs bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 p-2.5 rounded-xl flex items-center gap-1.5 font-mono">
                    <Check className="w-3.5 h-3.5" />
                    <span>{searchStatus}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* COMPARATIVE VS ARENA SECTION */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl border border-pink-500/10 shrink-0">
                  <BarChart3 className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-300 font-mono tracking-wider uppercase">Comparative Metric Battle Arena</h4>
                  <p className="text-[11px] text-slate-400 font-sans leading-snug">Launch a detailed head-to-head performance matchup analysis of any currently indexed K-Dramas.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVsArena(!showVsArena)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all border duration-300 cursor-pointer ${
                  showVsArena 
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/15'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-slate-950 font-black'
                }`}
              >
                {showVsArena ? 'Collapse Vs Arena' : 'Launch Vs Arena'}
              </button>
            </div>

            {showVsArena && (
              <div className="mt-4 p-6 bg-slate-950/80 border border-slate-800 rounded-2xl relative overflow-hidden backdrop-blur-sm">
                {/* Glowing BG accents */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-5 blur-3xl pointer-events-none"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start relative z-10">
                  {/* Selector Left */}
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                    <label className="block text-[10px] uppercase font-mono text-slate-500 mb-2">Contender A (Pink Deck)</label>
                    <select
                      value={vsShowIdA}
                      onChange={(e) => setVsShowIdA(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500/50 text-xs text-slate-200 p-2.5 rounded-xl font-mono outline-none"
                    >
                      {shows.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Selector Right */}
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                    <label className="block text-[10px] uppercase font-mono text-slate-500 mb-2">Contender B (Purple Deck)</label>
                    <select
                      value={vsShowIdB}
                      onChange={(e) => setVsShowIdB(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500/50 text-xs text-slate-200 p-2.5 rounded-xl font-mono outline-none"
                    >
                      {shows.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Matchup metrics visualization */}
                {(() => {
                  const showDataA = computedMetrics.find(s => s.id === vsShowIdA) || computedMetrics[0];
                  const showDataB = computedMetrics.find(s => s.id === vsShowIdB) || computedMetrics[1] || computedMetrics[0];

                  if (!showDataA || !showDataB) {
                    return <p className="text-xs text-slate-500 mt-4 text-center font-mono">Select distinct shows to compare...</p>;
                  }

                  const numScoreA = parseFloat(showDataA.liveScore || showDataA.score) || 0;
                  const numScoreB = parseFloat(showDataB.liveScore || showDataB.score) || 0;

                  const viewershipA = parseFloat(showDataA.averageViewership) || 0;
                  const viewershipB = parseFloat(showDataB.averageViewership) || 0;

                  const winnerScore = numScoreA > numScoreB ? 'A' : numScoreA < numScoreB ? 'B' : 'Draw';
                  const winnerLikes = showDataA.liveLikes > showDataB.liveLikes ? 'A' : showDataA.liveLikes < showDataB.liveLikes ? 'B' : 'Draw';
                  const winnerViewership = viewershipA > viewershipB ? 'A' : viewershipA < viewershipB ? 'B' : 'Draw';

                  return (
                    <div className="mt-8 relative z-10 border-t border-slate-800 pt-6">
                      
                      {/* Vs visual barrier */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-[10px] font-extrabold font-mono text-slate-400">VS MODE</div>

                      {/* Header side split */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-left">
                          <span className="px-2 py-0.5 bg-pink-500/10 text-pink-400 text-[10px] font-bold rounded uppercase tracking-wider font-mono border border-pink-500/15">A Deck</span>
                          <h4 className="text-sm font-black text-pink-200 mt-2 truncate">{showDataA.title}</h4>
                          <p className="text-[10px] text-slate-500 italic mt-0.5 font-mono">{showDataA.tag}</p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded uppercase tracking-wider font-mono border border-purple-500/15">B Deck</span>
                          <h4 className="text-sm font-black text-purple-200 mt-2 truncate">{showDataB.title}</h4>
                          <p className="text-[10px] text-slate-500 italic mt-0.5 font-mono">{showDataB.tag}</p>
                        </div>
                      </div>

                      {/* Metric lines */}
                      <div className="space-y-4 max-w-2xl mx-auto">
                        
                        {/* 1. Global Performance Score */}
                        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                          <div className="flex justify-between items-center text-[11px] font-mono mb-2 text-slate-400">
                            <span className={winnerScore === 'A' ? 'text-pink-400 font-extrabold' : ''}>A: {showDataA.liveScore || showDataA.score}</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Liveliness Score Rating</span>
                            <span className={winnerScore === 'B' ? 'text-purple-400 font-extrabold' : ''}>B: {showDataB.liveScore || showDataB.score}</span>
                          </div>
                          <div className="flex gap-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                            <div className={`transition-all duration-500 ${winnerScore === 'A' ? 'bg-pink-500' : 'bg-pink-500/45'}`} style={{ width: `${(numScoreA / (numScoreA + numScoreB || 1)) * 100}%` }}></div>
                            <div className="w-1 bg-slate-800"></div>
                            <div className={`transition-all duration-500 ml-auto ${winnerScore === 'B' ? 'bg-purple-500' : 'bg-purple-500/45'}`} style={{ width: `${(numScoreB / (numScoreA + numScoreB || 1)) * 100}%` }}></div>
                          </div>
                        </div>

                        {/* 2. Positive Fan Sentiment */}
                        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                          <div className="flex justify-between items-center text-[11px] font-mono mb-2 text-slate-400">
                            <span className={winnerLikes === 'A' ? 'text-pink-400 font-extrabold' : ''}>A: {showDataA.liveLikes}% Likes</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Spectator Sentiment</span>
                            <span className={winnerLikes === 'B' ? 'text-purple-400 font-extrabold' : ''}>B: {showDataB.liveLikes}% Likes</span>
                          </div>
                          <div className="flex gap-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                            <div className={`transition-all duration-500 ${winnerLikes === 'A' ? 'bg-gradient-to-r from-pink-500 to-rose-400' : 'bg-pink-500/40'}`} style={{ width: `${(showDataA.liveLikes / (showDataA.liveLikes + showDataB.liveLikes || 1)) * 100}%` }}></div>
                            <div className="w-1 bg-slate-800"></div>
                            <div className={`transition-all duration-500 ml-auto ${winnerLikes === 'B' ? 'bg-gradient-to-l from-purple-500 to-indigo-400' : 'bg-purple-500/40'}`} style={{ width: `${(showDataB.liveLikes / (showDataA.liveLikes + showDataB.liveLikes || 1)) * 100}%` }}></div>
                          </div>
                        </div>

                        {/* 3. Average Broadcast Viewership */}
                        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                          <div className="flex justify-between items-center text-[11px] font-mono mb-2 text-slate-400">
                            <span className={winnerViewership === 'A' ? 'text-pink-400 font-extrabold' : ''}>A: {showDataA.averageViewership}</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Average Broadcast Rating</span>
                            <span className={winnerViewership === 'B' ? 'text-purple-400 font-extrabold' : ''}>B: {showDataB.averageViewership}</span>
                          </div>
                          <div className="flex gap-1 h-2 bg-slate-950 rounded-full overflow-hidden">
                            <div className={`transition-all duration-500 ${winnerViewership === 'A' ? 'bg-pink-500' : 'bg-pink-500/40'}`} style={{ width: `${(viewershipA / (viewershipA + viewershipB || 1)) * 105}%` }}></div>
                            <div className="w-1 bg-slate-850"></div>
                            <div className={`transition-all duration-500 ml-auto ${winnerViewership === 'B' ? 'bg-purple-500' : 'bg-purple-500/40'}`} style={{ width: `${(viewershipB / (viewershipA + viewershipB || 1)) * 105}%` }}></div>
                          </div>
                        </div>

                        {/* 4. Broadcaster network & details */}
                        <div className="grid grid-cols-2 gap-4 text-center mt-2.5">
                          <div className="p-3 bg-slate-900/40 rounded-xl border border-pink-500/10">
                            <span className="text-[10px] text-slate-500 font-mono block">Broadcaster A</span>
                            <span className="text-xs text-white font-mono mt-1 block font-bold">{showDataA.network} | {showDataA.episodes} Episodes</span>
                          </div>
                          <div className="p-3 bg-slate-900/40 rounded-xl border border-purple-500/10">
                            <span className="text-[10px] text-slate-500 font-mono block">Broadcaster B</span>
                            <span className="text-xs text-white font-mono mt-1 block font-bold">{showDataB.network} | {showDataB.episodes} Episodes</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })()}

              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-display flex items-center gap-2">
                <Tv className="w-5 h-5 text-pink-500" />
                Featured K-Drama Performances
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Detailed viewer engagement, sentiment scores, and dynamic viewers drivers tracking.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 hidden sm:block">
              Click metrics or tabs below of any card to interact
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {computedMetrics.map((show) => {
              const activeTab = activeTabs[show.id];
              const isRoyalTheme = show.id === 'royal-nemesis';
              
              return (
                <div 
                  key={show.id} 
                  id={`card-${show.id}`}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-pink-500/5 hover:border-slate-700"
                >
                  
                  {/* Glowing card visual design accents */}
                  <div className={`absolute top-0 right-0 w-32 h-32 ${isRoyalTheme ? 'bg-pink-500/10' : 'bg-purple-500/10'} rounded-full blur-2xl pointer-events-none`}></div>

                  {/* Card Header Info */}
                  <div className="flex justify-between items-start mb-4 gap-4 z-10">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {/* Styled tag badges as requested in High Density specs */}
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded border ${
                          isRoyalTheme 
                            ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' 
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        }`}>
                          {show.tag}
                        </span>

                        <span className="bg-slate-800/80 text-slate-300 text-[10px] font-semibold font-mono tracking-wide px-2 py-0.5 rounded-md border border-slate-700/50">
                          {show.network}
                        </span>

                        <span className="bg-slate-950/80 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-800">
                          {show.episodes} Episodes
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold font-display text-white tracking-tight hover:text-pink-400 transition-colors">
                        {show.title}
                      </h3>
                      
                      <p className="text-xs text-slate-400 mt-1 italic line-clamp-1">
                        &ldquo;{show.status}&rdquo;
                      </p>
                    </div>

                    {/* Global Score Indicator (Aligned to High Density specs) */}
                    <div className="text-right flex flex-col items-end shrink-0">
                      <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest uppercase">Global Score</p>
                      <p className={`text-3xl font-black ${isRoyalTheme ? 'text-pink-500' : 'text-purple-500'} font-display mt-0.5`}>
                        {show.liveScore.split('/')[0]}
                        <span className="text-sm text-slate-600 font-normal">/10</span>
                      </p>
                    </div>
                  </div>

                  {/* Brief synopsis banner */}
                  <div className="bg-slate-950/45 p-3 rounded-xl border border-slate-800/80 mb-5">
                    <p className="text-xs text-slate-300 leading-relaxed text-justify line-clamp-2 sm:line-clamp-none">
                      {show.summary}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300">Stars:</span>
                      {show.castList.map((actor, idx) => (
                        <span 
                          key={actor}
                          className="hover:text-pink-400 cursor-pointer transition-colors hover:underline"
                          onClick={() => {
                            const foundActor = ACTOR_TRENDS.find(a => a.name === actor);
                            if (foundActor) {
                              setActiveActorHighlight(actor);
                              const lowerId = actor.toLowerCase().replace(/\s/g, '-');
                              document.getElementById('actor-metrics-spline')?.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                        >
                          {actor}{idx < show.castList.length - 1 ? ',' : ''}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* INTERACTIVE NAVIGATION CONTROL TABS FOR CARDS */}
                  <div className="grid grid-cols-3 bg-slate-950 p-1.5 rounded-xl border border-slate-800/80 mb-5 gap-1">
                    <button
                      onClick={() => handleTabChange(show.id, 'overview')}
                      className={`py-2 px-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase text-center cursor-pointer ${
                        activeTab === 'overview'
                          ? isRoyalTheme ? 'bg-pink-500 text-slate-950 shadow-md shadow-pink-500/20' : 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      Metrics Chart
                    </button>
                    
                    <button
                      onClick={() => handleTabChange(show.id, 'forum')}
                      className={`py-2 px-1 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase text-center cursor-pointer relative flex items-center justify-center gap-1 ${
                        activeTab === 'forum'
                          ? isRoyalTheme ? 'bg-pink-500 text-slate-950 shadow-md shadow-pink-500/20' : 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      Opinions Feed
                      {opinions.filter(o => o.showId === show.id).length > 0 && (
                        <span className={`w-2 h-2 rounded-full absolute top-1 right-1 ${activeTab === 'forum' ? 'bg-slate-950' : isRoyalTheme ? 'bg-pink-500' : 'bg-purple-500'}`}></span>
                      )}
                    </button>

                    <button
                      onClick={() => handleTabChange(show.id, 'insights')}
                      className={`py-2 px-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase text-center cursor-pointer ${
                        activeTab === 'insights'
                          ? isRoyalTheme ? 'bg-pink-500 text-slate-950 shadow-md shadow-pink-500/20' : 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      Insights
                    </button>
                  </div>

                  {/* TAB 1: METRICS CHART (POLISHED DOUGHNUT & WHY WATCH DRIVERS BARS) */}
                  {activeTab === 'overview' && (
                    <div className="flex-1 flex flex-col justify-between">
                      {/* Doughnut ring and driver metrics row */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        
                        {/* Progressive Sentiment Doughnut Column (Styled with High Density metrics card layout) */}
                        <div className="col-span-1 md:col-span-4 bg-slate-950 p-4 rounded-xl flex flex-col justify-between items-center text-center border border-slate-800/40">
                          <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Sentiment Metric</p>
                          <div className="relative w-32 h-32 flex items-center justify-center my-2">
                            {/* Pure SVG progress ring doughnut */}
                            <svg className="w-full h-full transform -rotate-90">
                              {/* Background Circle */}
                              <circle
                                cx="64"
                                cy="64"
                                r="48"
                                className="stroke-slate-800"
                                strokeWidth="12"
                                fill="transparent"
                              />
                              {/* Active Like Progress Arc */}
                              <circle
                                cx="64"
                                cy="64"
                                r="48"
                                className={`${isRoyalTheme ? 'stroke-pink-500' : 'stroke-purple-500'} transition-all duration-700 ease-out`}
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 48}
                                strokeDashoffset={2 * Math.PI * 48 * (1 - show.liveLikes / 100)}
                                strokeLinecap="round"
                              />
                            </svg>
                            {/* Inner score label */}
                            <div className="absolute text-center">
                              <span className="text-2xl font-black font-mono tracking-tight text-white block">
                                {show.liveLikes}%
                              </span>
                              <span id={`lbl-sentiment-${show.id}`} className="text-[8px] uppercase font-bold text-slate-500 tracking-widest">
                                Likes
                              </span>
                            </div>
                          </div>
                          
                          {/* Live counters details */}
                          <div className="text-xs text-slate-400 mt-2">
                            <span className="inline-block w-2.5 h-2.5 bg-pink-500 rounded-full mr-1 align-middle"></span> {show.liveLikes}% Likes
                            <span className="inline-block w-2.5 h-2.5 bg-slate-800 rounded-full ml-3 mr-1 align-middle"></span> {show.liveDislikes}% Dislikes
                          </div>
                        </div>

                        {/* Why Users Watch Drivers Segment (Aligned with High Density Viewer Drivers layout style) */}
                        <div id={`drivers-container-${show.id}`} className="col-span-1 md:col-span-8 bg-slate-950 p-4 rounded-xl flex flex-col justify-between border border-slate-800/40">
                          <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Viewer Drivers</p>
                          <div className="my-2 space-y-3">
                            {show.liveDrivers.map((driver) => {
                              return (
                                <div 
                                  key={driver.label}
                                  onClick={() => handleDriverVote(show.id, driver.label)}
                                  className="group cursor-pointer relative"
                                  title={`Click to add interactive vote to "${driver.label}"`}
                                >
                                  <div className="flex justify-between text-xs mb-1 group-hover:text-white transition-all">
                                    <span className="font-medium text-slate-300 group-hover:text-pink-400 flex items-center gap-1.5 transition-colors">
                                      {driver.label}
                                      <span className="bg-slate-800 text-[9px] font-mono transform scale-90 px-1 py-0.2 rounded text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                                        <Plus className="w-2 h-2" /> 12 votes
                                      </span>
                                    </span>
                                    <span className="font-bold font-mono text-slate-400 group-hover:text-white">
                                      {driver.votesCount.toLocaleString()} ({driver.percentage}%)
                                    </span>
                                  </div>
                                  
                                  {/* Styled percentage horizontal bar */}
                                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div 
                                      className={`${isRoyalTheme ? 'bg-pink-500' : 'bg-purple-500'} h-full rounded-full transition-all duration-500`}
                                      style={{ width: `${driver.percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                      
                      {/* Active vote simulation alert footer */}
                      <p className="text-[10px] text-slate-500 font-mono text-center mt-6 pt-3 border-t border-slate-800/60 leading-relaxed">
                        Total polled opinions: <strong className="text-slate-300">{(show.liveReviewsCount + (Object.values(showVotes[show.id]) as number[]).reduce((a, b) => a + b, 0)).toLocaleString()}</strong> reactions. Interactive components recalculate percentages dynamically instantaneously.
                      </p>
                    </div>
                  )}

                  {/* TAB 2: AUDIENCE OPINIONS FEED (REAL-TIME ADDS FORUM) */}
                  {activeTab === 'forum' && (
                    <div className="flex-1 flex flex-col justify-between">
                      
                      {/* List of Opinions container */}
                      <div className="space-y-3.5 max-h-[195px] overflow-y-auto pr-1 select-none">
                        {opinions.filter(o => o.showId === show.id).length === 0 ? (
                          <div className="text-center py-6 text-slate-500 text-xs">
                            No custom expert opinions posted yet. Use the form below to be the first!
                          </div>
                        ) : (
                          opinions
                            .filter(o => o.showId === show.id)
                            .map((opinion) => {
                              const isPositiveRating = opinion.rating >= 8;
                              const isNeutralRating = opinion.rating >= 6 && opinion.rating <= 7;
                              return (
                                <div key={opinion.id} className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl hover:border-slate-800 transition-all">
                                  <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <div className="flex items-center gap-1.5">
                                      <div className={`w-5 h-5 rounded-md ${isRoyalTheme ? 'bg-pink-500/20 text-pink-400' : 'bg-purple-500/20 text-purple-400'} flex items-center justify-center text-[10px] font-mono uppercase font-bold`}>
                                        {opinion.user.substring(0, 2)}
                                      </div>
                                      <span className="text-xs font-semibold text-slate-300">@{opinion.user}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] text-slate-500 font-mono">{opinion.timestamp}</span>
                                      
                                      {/* Sentiment tag */}
                                      <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded ${
                                        isPositiveRating 
                                          ? 'bg-emerald-500/15 text-emerald-400' 
                                          : isNeutralRating 
                                            ? 'bg-amber-500/15 text-amber-400' 
                                            : 'bg-rose-500/15 text-rose-400'
                                      }`}>
                                        ★ {opinion.rating}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <p className="text-xs text-slate-300 leading-relaxed">
                                    {opinion.text}
                                  </p>
                                </div>
                              );
                            })
                        )}
                      </div>

                      {/* Add Custom Sentiment Review Form */}
                      <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Post Audience Sentiment Review
                          </h4>
                          <span className="text-[10px] text-slate-500">
                            Updates sentiment chart instantly
                          </span>
                        </div>

                        {formSuccess[show.id] && (
                          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 p-2.5 rounded-xl text-xs mb-3 flex items-center gap-1.5 animate-fadeIn">
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Your opinion posted! Live score and progress ring recalculated successfully.</span>
                          </div>
                        )}

                        {formErrors[show.id] && (
                          <div className="bg-rose-500/15 border border-rose-500/30 text-rose-400 p-2.5 rounded-xl text-xs mb-3">
                            {formErrors[show.id]}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                          <div>
                            <label className="block text-[10px] text-slate-500 uppercase mb-1 font-mono">User Handle</label>
                            <input
                              type="text"
                              maxLength={18}
                              placeholder="e.g. kdrama_stan"
                              value={newOpinionUser[show.id]}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\s+/g, '_');
                                setNewOpinionUser(prev => ({ ...prev, [show.id]: val }));
                              }}
                              className="w-full bg-slate-900 border border-slate-800 focus:border-pink-500 rounded-lg py-1 px-2 text-xs text-slate-200 outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-500 uppercase mb-1 font-mono">Rating Metric</label>
                            <div className="flex items-center gap-1">
                              <select 
                                value={newOpinionRating[show.id]}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  setNewOpinionRating(prev => ({ ...prev, [show.id]: val }));
                                }}
                                className="w-full bg-slate-900 border border-slate-800 focus:border-pink-500 rounded-lg py-1 px-1.5 text-xs text-slate-200 uppercase"
                              >
                                <option value="10">10/10 Masters Class</option>
                                <option value="9">9/10 Incredible Watch</option>
                                <option value="8">8/10 Great Show</option>
                                <option value="7">7/10 Decent Pacing</option>
                                <option value="6">6/10 Mixed Reviews</option>
                                <option value="5">5/10 Drags Heavily</option>
                                <option value="4">4/10 Disliked Story</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="relative">
                          <textarea
                            maxLength={160}
                            rows={2}
                            placeholder="Write your review insights. (e.g., 'Loved the pacing and acting dynamics!')"
                            value={newOpinionText[show.id]}
                            onChange={(e) => {
                              const textVal = e.target.value;
                              setNewOpinionText(prev => ({ ...prev, [show.id]: textVal }));
                              if (textVal.length >= 10 && formErrors[show.id]) {
                                setFormErrors(prev => ({ ...prev, [show.id]: '' }));
                              }
                            }}
                            className="w-full bg-slate-900 border border-slate-800 focus:border-pink-500 focus:ring-0 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-600 outline-none pr-10 resize-none"
                          />
                          <button
                            onClick={() => handleAddOpinion(show.id)}
                            className="absolute right-2 bottom-3 p-1.5 rounded-lg bg-pink-500 hover:bg-pink-600 active:scale-90 text-slate-950 transition-all cursor-pointer"
                            title="Submit review to calculation engine"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-600 font-mono mt-1">
                          <span>Must be 10-160 characters</span>
                          <span>{160 - (newOpinionText[show.id]?.length || 0)} chars remaining</span>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 3: INSIGHTS & STATISTICAL METRICS SPLIT */}
                  {activeTab === 'insights' && (
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                            <Info className="w-4 h-4 text-pink-400" />
                            Audience Hot Take Triggers
                          </h4>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/10">
                              <p className="text-[10px] text-emerald-400 uppercase font-mono mb-1 font-semibold">Positive Catalysts</p>
                              <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
                                <li>• High production value</li>
                                <li>• Memorable OST theme</li>
                                <li>• Sizzling casting</li>
                              </ul>
                            </div>
                            <div className="bg-rose-500/5 p-2 rounded-xl border border-rose-500/10">
                              <p className="text-[10px] text-rose-400 uppercase font-mono mb-1 font-semibold">Negative Triggers</p>
                              <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
                                <li>• Pacing lag in middle eps</li>
                                <li>• Side-characters fatigue</li>
                                <li>• Overdone flashbacks</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Broadcast Information Index
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                              <span className="text-[10px] text-slate-500 block">Air Time Status</span>
                              <span className="text-slate-200 mt-1 block font-mono">{show.airTime}</span>
                            </div>
                            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                              <span className="text-[10px] text-slate-500 block">Peak Viewership (Live)</span>
                              <span className="text-slate-200 mt-1 block font-mono font-bold text-pink-400">
                                {show.averageViewership}
                              </span>
                            </div>
                          </div>
                        </div>

                        {show.milestones && show.milestones.length > 0 && (
                          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                              Broadcast Milestone Path
                            </h4>
                            <div className="space-y-3 text-left">
                              {show.milestones.map((milestone: any, mIdx: number) => (
                                <div key={mIdx} className="flex gap-3 relative">
                                  {mIdx < show.milestones!.length - 1 && (
                                    <div className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-slate-800"></div>
                                  )}
                                  <div className="w-5 h-5 rounded-md bg-slate-900 border border-slate-800/80 font-mono text-[9px] text-slate-400 flex items-center justify-center shrink-0">
                                    {mIdx + 1}
                                  </div>
                                  <div className="text-left">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold text-slate-300 font-mono">{milestone.episode}</span>
                                      <span className="text-[9px] bg-pink-500/10 text-pink-400 border border-pink-500/20 px-1 py-0.2 rounded font-mono font-bold">{milestone.rating}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">{milestone.event}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                              Executive Report
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">Live dynamic analyzer</span>
                          </div>
                          
                          {compiledReportShowId === show.id ? (
                            <div className="mt-1 flex flex-col gap-2">
                              <pre className="text-[10px] font-mono bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-300 max-h-[160px] overflow-y-auto text-left whitespace-pre-wrap">
                                {getCompiledDossierText(show)}
                              </pre>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleCopyDossier(getCompiledDossierText(show))}
                                  className="flex-1 py-1.5 px-3 text-[11px] font-mono text-slate-950 bg-pink-400 hover:bg-pink-500 rounded-lg font-bold transition-all cursor-pointer"
                                >
                                  {showReportCopied ? '✓ Copied Successful!' : 'Copy Dossier to Clipboard'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCompiledReportShowId(null)}
                                  className="py-1.5 px-2 text-[11px] font-mono text-slate-400 hover:text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all border border-slate-800 cursor-pointer"
                                >
                                  Hide
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleCompileReport(show.id)}
                              className="w-full text-center py-2 bg-slate-900 hover:bg-slate-800 text-xs border border-slate-800 hover:border-slate-700 text-slate-300 font-mono rounded-xl uppercase transition-all cursor-pointer"
                            >
                              Compile Live Executive Dossier
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-slate-800/60 pt-4 mt-6">
                        <button 
                          onClick={() => handleTabChange(show.id, 'overview')}
                          className={`w-full text-center py-2 rounded-xl text-xs font-bold font-mono border uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 hover:bg-slate-800 ${
                            isRoyalTheme 
                              ? 'border-pink-500/25 text-pink-400' 
                              : 'border-purple-500/25 text-purple-400'
                          }`}
                        >
                          <span>Return to Interactive Charts</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}

          </div>
        </section>

        {/* ACTOR METRICS SECTION */}
        <section id="actor-metrics-section" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          
          {/* Subtle decoration overlay */}
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-gradient-to-tr from-pink-500/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div id="actor-metrics-spline" className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            
            {/* Actor Left Metadata segment */}
            <div className="max-w-md w-full">
              <span className="px-2 py-0.5 bg-pink-500/10 text-pink-400 text-[10px] font-bold uppercase tracking-widest rounded border border-pink-500/20 mb-3 inline-block">
                Reputation Index
              </span>
              
              <h2 className="text-3xl font-black uppercase tracking-tight font-display text-white">
                Trending Actor Metrics
              </h2>
              
              <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest leading-relaxed">
                Weekly performance metrics, brand power index, and social mention velocity.
              </p>

              {/* Show Comparison Toggle Pills */}
              <div className="mt-5 space-y-3">
                <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest">Toggle focus target</p>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setActiveActorHighlight(null)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      activeActorHighlight === null 
                        ? 'bg-slate-800 text-white border-slate-700 font-bold' 
                        : 'bg-slate-950 text-slate-400 border-slate-900/60 hover:text-slate-300'
                    } border`}
                  >
                    Compare Both
                  </button>
                  {ACTOR_TRENDS.map(actor => (
                    <button 
                      key={actor.name}
                      onClick={() => setActiveActorHighlight(actor.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
                        activeActorHighlight === actor.name 
                          ? actor.name === 'Lim Ji-yeon' ? 'bg-pink-500 text-slate-950 font-bold border-pink-400' : 'bg-purple-500 text-slate-950 font-bold border-purple-400'
                          : 'bg-slate-950 text-slate-400 border-slate-900/60 hover:text-slate-300'
                      }`}
                    >
                      {actor.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weekly highlight cards details panel */}
              <div className="mt-6 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 relative">
                <div className="flex items-center justify-between mb-3 text-[10px] font-mono tracking-wider uppercase text-slate-500">
                  <span>Selected Timeline</span>
                  <span className="font-bold text-pink-400 bg-pink-500/10 px-1.5 py-0.2 rounded border border-pink-500/20">
                    Week {selectedWeekIndex + 1}
                  </span>
                </div>

                <div className="space-y-4">
                  {ACTOR_TRENDS.filter(a => activeActorHighlight === null || a.name === a.name).map(actor => {
                    const isMuted = activeActorHighlight !== null && activeActorHighlight !== actor.name;
                    const weekData = actorWeeklyDetails[selectedWeekIndex];
                    const actorDetails = weekData[actor.name as keyof typeof weekData] as { score: number, highlight: string };
                    
                    return (
                      <div 
                        key={actor.name} 
                        className={`transition-opacity duration-300 ${isMuted ? 'opacity-30' : 'opacity-100'}`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`w-2.5 h-2.5 rounded-full`} style={{ backgroundColor: actor.color }}></div>
                          <span className="text-xs font-extrabold text-slate-200">{actor.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({actor.role})</span>
                        </div>
                        
                        <div className="grid grid-cols-12 gap-3 items-start bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80">
                          <div className="col-span-3 text-center border-r border-slate-800 pr-2">
                            <span className="text-xs text-slate-400 block font-mono">Index</span>
                            <span className="text-lg font-black font-mono text-white block mt-0.5">
                              {actorDetails.score}
                            </span>
                          </div>
                          
                          <p className="col-span-9 text-[11px] text-slate-300 leading-normal pl-1 select-none">
                            {actorDetails.highlight}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Timeline interactive togglers */}
                <div className="grid grid-cols-4 gap-1.5 mt-5">
                  {[0, 1, 2, 3].map((weekIdx) => (
                    <button
                      key={weekIdx}
                      onClick={() => setSelectedWeekIndex(weekIdx)}
                      className={`py-1 rounded-lg text-[10px] font-mono tracking-wider transition-all uppercase text-center border cursor-pointer ${
                        selectedWeekIndex === weekIdx
                          ? 'bg-slate-200 text-slate-950 font-bold border-white'
                          : 'bg-slate-900 text-slate-400 border-slate-800/80 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      Wk {weekIdx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* INTERACTIVE ACTOR BRAND REPUTATION SIMULATOR CONSOLE */}
              <div className="mt-5 p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300 uppercase font-mono flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-pink-400" />
                    Reputation Power Simulator
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSimulatingActorRep(!isSimulatingActorRep)}
                    className="text-[10px] text-pink-400 font-mono tracking-wider hover:text-pink-300 font-bold transition-colors cursor-pointer"
                  >
                    {isSimulatingActorRep ? '[ Close Simulator ]' : '[ Open Simulator ]'}
                  </button>
                </div>

                {isSimulatingActorRep ? (
                  <div className="space-y-3.5 mt-2 animate-fade-in text-left">
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Adjust factors dynamically to simulate how the model projects Lim Ji-yeon's brand value index.
                    </p>

                    {/* Slider 1: Social Hype velocity */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-450 mb-1">
                        <span>Social Hype velocity</span>
                        <span className="text-pink-400 font-bold">{actorHypeMultiplier.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.1"
                        value={actorHypeMultiplier}
                        onChange={(e) => setActorHypeMultiplier(parseFloat(e.target.value))}
                        className="w-full accent-pink-500 bg-slate-900 h-1 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Slider 2: Fan Critical Score */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-450 mb-1">
                        <span>Fan/Acting Performance baseline</span>
                        <span className="text-purple-400 font-bold">{actorCriticalScore} pts</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        step="1"
                        value={actorCriticalScore}
                        onChange={(e) => setActorCriticalScore(parseInt(e.target.value))}
                        className="w-full accent-purple-500 bg-slate-900 h-1 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Counter 3: Ad Campaigns count */}
                    <div className="flex items-center justify-between py-1 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-[10px] font-mono text-slate-450 block">Commercial Ad Contracts</span>
                        <span className="text-[9px] text-slate-500">Adds multiplier momentum</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActorAdCampaigns(prev => Math.max(0, prev - 1))}
                          className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded flex items-center justify-center cursor-pointer transition-all active:scale-90"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold font-mono text-slate-200 min-w-4 text-center">{actorAdCampaigns}</span>
                        <button
                          type="button"
                          onClick={() => setActorAdCampaigns(prev => Math.min(10, prev + 1))}
                          className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded flex items-center justify-center cursor-pointer transition-all active:scale-90"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Computation Result output */}
                    {(() => {
                      const simulatedBrandResult = Math.min(100, Math.max(10, Math.round( (actorCriticalScore * actorHypeMultiplier) + (actorAdCampaigns * 2.2) )));
                      const getsTier = simulatedBrandResult >= 96;
                      const getaTier = simulatedBrandResult >= 88 && simulatedBrandResult < 96;
                      const tierLabel = getsTier ? 'S-Tier Brand Power' : getaTier ? 'A-Tier Premium Power' : 'B-Tier Stable Brand';
                      const tierColor = getsTier ? 'text-pink-400 bg-pink-500/10 border-pink-500/20' : getaTier ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-slate-400 bg-slate-900 border-slate-800';

                      return (
                        <div className="pt-2 border-t border-slate-850 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-slate-500 block font-mono uppercase">Simulation Index Projection</span>
                            <span className="text-xl font-black font-mono text-emerald-400">{simulatedBrandResult}%</span>
                          </div>
                          
                          <div className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded border ${tierColor}`}>
                            {tierLabel}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 text-left mt-1 italic font-mono selection:bg-pink-500 selection:text-slate-950">
                    Simulator deactivated. Click '[ Open Simulator ]' to load brand calculations.
                  </p>
                )}
              </div>

            </div>

            {/* Actor Spline Plot Card on the Right */}
            <div className="flex-1 w-full bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between min-h-[380px] shadow-xl">
              
              {/* Spline Top Stats Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 select-none">
                <div className="flex items-center gap-5">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Active Metrics scale</span>
                    <span className="text-xs font-semibold text-slate-300 mt-1 block">Branded Search Index (50-100 pts)</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 border-l border-slate-800 pl-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block"></span>
                    <span className="text-xs text-slate-400 font-mono">Lim Ji-yeon</span>
                    
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block ml-2"></span>
                    <span className="text-xs text-slate-400 font-mono">Park Ji-hoon</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 text-xs px-2.5 py-1 rounded-xl text-slate-400 font-mono flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-pink-400" />
                  <span>Click coordinates below to switch week highlights</span>
                </div>
              </div>

              {/* Bespoke SVG Line Graph Plot container */}
              <div className="relative flex-1 w-full flex items-center justify-center p-2 min-h-[220px]">
                
                {/* Visual grid reference lines background */}
                <div className="absolute inset-0 flex flex-col justify-between py-1.5 pointer-events-none select-none opacity-20">
                  <div className="border-b border-dashed border-slate-700/60 w-full text-[9px] font-mono text-slate-500 text-right pr-1 pt-0.5">Peak (100pt)</div>
                  <div className="border-b border-dashed border-slate-700/60 w-full text-[9px] font-mono text-slate-500 text-right pr-1 pt-0.5">Avg Active (80pt)</div>
                  <div className="border-b border-dashed border-slate-700/60 w-full text-[9px] font-mono text-slate-500 text-right pr-1 pt-0.5">Starting (60pt)</div>
                </div>

                {/* Spline Path Drawing */}
                <svg viewBox="0 0 500 200" className="w-full h-full min-h-[190px] select-none" preserveAspectRatio="none">
                  <defs>
                    {/* Pink Gradient for Area Fill */}
                    <linearGradient id="gradient-pink" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EC4899" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#EC4899" stopOpacity="0.0" />
                    </linearGradient>
                    {/* Purple Gradient for Area Fill */}
                    <linearGradient id="gradient-purple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A855F7" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#A855F7" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal baseline guides */}
                  <line x1="0" y1="20" x2="500" y2="20" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3" />
                  <line x1="0" y1="180" x2="500" y2="180" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="3" />

                  {/* Vertical week timelines indicator reference bar */}
                  <rect 
                    x={20 + selectedWeekIndex * 153} 
                    y="5" 
                    width="14" 
                    height="190" 
                    className="fill-slate-800/40 stroke-slate-700/20 stroke-1" 
                    rx="3"
                  />

                  {/* Plot A: Lim Ji-yeon (pink) - Weekly Scores: [72, 85, 91, 96]
                      Mapped inside Y: [0, 200] where Y_axis coordinate = 200 - ((score - 50) * 4) 
                      Scores map to: 
                      Week 1 (72) -> Y = 200 - (22 * 4) = 112
                      Week 2 (85) -> Y = 200 - (35 * 4) = 60
                      Week 3 (91) -> Y = 200 - (41 * 4) = 36
                      Week 4 (96) -> Y = 200 - (46 * 4) = 16
                  */}
                  {(activeActorHighlight === null || activeActorHighlight === 'Lim Ji-yeon') && (
                    <>
                      {/* Spline area backdrop */}
                      <path
                        d="M 27 112 C 103.5 86, 180 60, 256.5 60 C 333 60, 409.5 36, 486 16 L 486 200 L 27 200 Z"
                        fill="url(#gradient-pink)"
                        className="transition-all duration-300"
                      />
                      
                      {/* Spline outline spline line */}
                      <path
                        d="M 27 112 C 103.5 86, 180 60, 256.5 60 C 333 60, 409.5 36, 486 16"
                        fill="none"
                        stroke="#EC4899"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="transition-all duration-300"
                        strokeDasharray="4"
                      />
                    </>
                  )}

                  {/* Plot B: Park Ji-hoon (purple) - Weekly Scores: [80, 88, 89, 94]
                      Mapped inside Y: [0, 200] where Y_axis coordinate = 200 - ((score - 50) * 4)
                      Scores map to:
                      Week 1 (80) -> Y = 200 - (30 * 4) = 80
                      Week 2 (88) -> Y = 200 - (38 * 4) = 48
                      Week 3 (89) -> Y = 200 - (39 * 4) = 44
                      Week 4 (94) -> Y = 200 - (44 * 4) = 24
                  */}
                  {(activeActorHighlight === null || activeActorHighlight === 'Park Ji-hoon') && (
                    <>
                      {/* Spline area backdrop */}
                      <path
                        d="M 27 80 C 103.5 64, 180 48, 256.5 48 C 333 48, 409.5 44, 486 24 L 486 200 L 27 200 Z"
                        fill="url(#gradient-purple)"
                        className="transition-all duration-300"
                      />

                      {/* Spline outline spline line */}
                      <path
                        d="M 27 80 C 103.5 64, 180 48, 256.5 48 C 333 48, 409.5 44, 486 24"
                        fill="none"
                        stroke="#A855F7"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="transition-all duration-300"
                      />
                    </>
                  )}

                  {/* Dynamic Pointer Circles on Weeks */}
                  {/* Week 1 points */}
                  {(activeActorHighlight === null || activeActorHighlight === 'Lim Ji-yeon') && (
                    <circle
                      cx="27"
                      cy="112"
                      r={selectedWeekIndex === 0 ? "7" : "5.5"}
                      className={`fill-slate-950 stroke-pink-500 cursor-pointer transition-all ${selectedWeekIndex === 0 ? 'stroke-4' : 'stroke-2 hover:r-7'}`}
                      onClick={() => setSelectedWeekIndex(0)}
                    />
                  )}
                  {(activeActorHighlight === null || activeActorHighlight === 'Park Ji-hoon') && (
                    <circle
                      cx="27"
                      cy="80"
                      r={selectedWeekIndex === 0 ? "7" : "5.5"}
                      className={`fill-slate-950 stroke-purple-500 cursor-pointer transition-all ${selectedWeekIndex === 0 ? 'stroke-4' : 'stroke-2 hover:r-7'}`}
                      onClick={() => setSelectedWeekIndex(0)}
                    />
                  )}

                  {/* Week 2 points */}
                  {(activeActorHighlight === null || activeActorHighlight === 'Lim Ji-yeon') && (
                    <circle
                      cx="180"
                      cy="60"
                      r={selectedWeekIndex === 1 ? "7" : "5.5"}
                      className={`fill-slate-950 stroke-pink-500 cursor-pointer transition-all ${selectedWeekIndex === 1 ? 'stroke-4' : 'stroke-2 hover:r-7'}`}
                      onClick={() => setSelectedWeekIndex(1)}
                    />
                  )}
                  {(activeActorHighlight === null || activeActorHighlight === 'Park Ji-hoon') && (
                    <circle
                      cx="180"
                      cy="48"
                      r={selectedWeekIndex === 1 ? "7" : "5.5"}
                      className={`fill-slate-950 stroke-purple-500 cursor-pointer transition-all ${selectedWeekIndex === 1 ? 'stroke-4' : 'stroke-2 hover:r-7'}`}
                      onClick={() => setSelectedWeekIndex(1)}
                    />
                  )}

                  {/* Week 3 points */}
                  {(activeActorHighlight === null || activeActorHighlight === 'Lim Ji-yeon') && (
                    <circle
                      cx="333"
                      cy="36"
                      r={selectedWeekIndex === 2 ? "7" : "5.5"}
                      className={`fill-slate-950 stroke-pink-500 cursor-pointer transition-all ${selectedWeekIndex === 2 ? 'stroke-4' : 'stroke-2 hover:r-7'}`}
                      onClick={() => setSelectedWeekIndex(2)}
                    />
                  )}
                  {(activeActorHighlight === null || activeActorHighlight === 'Park Ji-hoon') && (
                    <circle
                      cx="333"
                      cy="44"
                      r={selectedWeekIndex === 2 ? "7" : "5.5"}
                      className={`fill-slate-950 stroke-purple-500 cursor-pointer transition-all ${selectedWeekIndex === 2 ? 'stroke-4' : 'stroke-2 hover:r-7'}`}
                      onClick={() => setSelectedWeekIndex(2)}
                    />
                  )}

                  {/* Week 4 points */}
                  {(activeActorHighlight === null || activeActorHighlight === 'Lim Ji-yeon') && (
                    <circle
                      cx="486"
                      cy="16"
                      r={selectedWeekIndex === 3 ? "7" : "5.5"}
                      className={`fill-slate-950 stroke-pink-500 cursor-pointer transition-all ${selectedWeekIndex === 3 ? 'stroke-4' : 'stroke-2 hover:r-7'}`}
                      onClick={() => setSelectedWeekIndex(3)}
                    />
                  )}
                  {(activeActorHighlight === null || activeActorHighlight === 'Park Ji-hoon') && (
                    <circle
                      cx="486"
                      cy="24"
                      r={selectedWeekIndex === 3 ? "7" : "5.5"}
                      className={`fill-slate-950 stroke-purple-500 cursor-pointer transition-all ${selectedWeekIndex === 3 ? 'stroke-4' : 'stroke-2 hover:r-7'}`}
                      onClick={() => setSelectedWeekIndex(3)}
                    />
                  )}
                </svg>
              </div>

              {/* Chart Bottom Label Legend */}
              <div className="grid grid-cols-4 text-center text-slate-500 font-mono text-[10px] mt-2 border-t border-slate-800 pt-3 select-none">
                <button onClick={() => setSelectedWeekIndex(0)} className={`hover:text-slate-200 transition-colors ${selectedWeekIndex === 0 ? 'text-pink-400 font-bold' : ''}`}>Week 1</button>
                <button onClick={() => setSelectedWeekIndex(1)} className={`hover:text-slate-200 transition-colors ${selectedWeekIndex === 1 ? 'text-pink-400 font-bold' : ''}`}>Week 2</button>
                <button onClick={() => setSelectedWeekIndex(2)} className={`hover:text-slate-200 transition-colors ${selectedWeekIndex === 2 ? 'text-pink-400 font-bold' : ''}`}>Week 3</button>
                <button onClick={() => setSelectedWeekIndex(3)} className={`hover:text-slate-200 transition-colors ${selectedWeekIndex === 3 ? 'text-pink-400 font-bold' : ''}`}>Week 4</button>
              </div>

              {/* Display individual Actor metrics summaries */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-800">
                {ACTOR_TRENDS.map((actor) => {
                  const isMuted = activeActorHighlight !== null && activeActorHighlight !== actor.name;
                  const isPink = actor.name === 'Lim Ji-yeon';
                  
                  return (
                    <div 
                      key={actor.name} 
                      onClick={() => setActiveActorHighlight(actor.name)}
                      className={`p-3 rounded-2xl border ${isPink ? 'bg-pink-500/5' : 'bg-purple-500/5'} border-slate-800 transition-all duration-300 hover:border-slate-700/80 cursor-pointer ${
                        isMuted ? 'opacity-30' : 'opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg ${isPink ? 'bg-pink-500 text-slate-950' : 'bg-purple-500 text-slate-950'} flex items-center justify-center font-black text-xs font-display`}>
                            {actor.avatarText}
                          </div>
                          <div>
                            <h4 className="text-xs font-extrabold text-white">{actor.name}</h4>
                            <p className="text-[10px] text-slate-400 font-mono italic truncate max-w-[120px]">{actor.drama}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`text-xs font-bold font-mono ${isPink ? 'text-pink-400' : 'text-purple-400'}`}>
                            {actor.currentGrowth}
                          </span>
                          <span className="text-[9px] text-slate-500 block font-mono">Growth index</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {actor.bio}
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
                        <span>Social: <strong className="text-slate-350">{actor.socialReach}</strong></span>
                        <span>Rep: <strong className="text-slate-350">{actor.brandIndex}%</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </section>

      </div>

      {/* FOOTER SECTION */}
      <footer id="dashboard-footer" className="border-t border-slate-900 bg-slate-950 py-10 relative z-10 selection:bg-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 inline-block"></span>
            <span className="text-xs font-black font-display text-slate-300 uppercase tracking-widest">K-Drama Analytics Hub</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block"></span>
          </div>
          <p className="text-[11px] text-slate-500">
            Real-time data feeds are simulated client-side. Interactive sentiment metrics fully update matching lists instantly.
          </p>
          <p className="text-[10px] text-slate-600 font-mono mt-2">
            © 2026 K-Drama Analytics. Strictly optimized for instant iframe previews.
          </p>
        </div>
      </footer>
    </div>
  );
}
