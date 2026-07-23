// Sample dataset for testing all screens of Mansoo app

export const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Aarav Sharma',
    handle: '@aarav_writes',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    bio: 'Poet & Dreamer 🌙 | Author of "Echoes of Silence" | Writing the language of the soul',
    website: 'mansoo.in/aarav',
    isVerified: true,
    isPro: true,
    followersCount: 14200,
    followingCount: 312,
    postsCount: 480,
  },
  {
    id: 'u2',
    name: 'Priya Verma',
    handle: '@priya_verses',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    bio: 'Weaving emotions into poetry ✨',
    isVerified: true,
    isPro: false,
    followersCount: 8900,
    followingCount: 210,
    postsCount: 194,
  },
  {
    id: 'u3',
    name: 'Rohan Mehta',
    handle: '@rohan_thoughts',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400',
    bio: 'Philosopher at heart 🌿',
    isVerified: false,
    isPro: true,
    followersCount: 3400,
    followingCount: 180,
    postsCount: 88,
  },
  {
    id: 'u4',
    name: 'Ananya Roy',
    handle: '@ananya_ink',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    bio: 'Stories from the heart ❤️',
    isVerified: true,
    isPro: true,
    followersCount: 19500,
    followingCount: 450,
    postsCount: 512,
  },
  {
    id: 'u5',
    name: 'Kabir Das',
    handle: '@kabir_couplets',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bio: 'Modern Shayari & Classical Poetry 📖',
    isVerified: true,
    isPro: false,
    followersCount: 27800,
    followingCount: 120,
    postsCount: 620,
  },
];

export const DUMMY_STORIES = [
  { id: 's1', userId: 'u2', name: 'Priya', avatarUrl: DUMMY_USERS[1].avatarUrl, isVerified: true },
  { id: 's2', userId: 'u3', name: 'Rohan', avatarUrl: DUMMY_USERS[2].avatarUrl, isVerified: false },
  { id: 's3', userId: 'u4', name: 'Ananya', avatarUrl: DUMMY_USERS[3].avatarUrl, isVerified: true },
  { id: 's4', userId: 'u5', name: 'Kabir', avatarUrl: DUMMY_USERS[4].avatarUrl, isVerified: true },
];

export const DUMMY_POSTS = [
  {
    id: 'p1',
    authorId: 'u1',
    authorName: 'Aarav Sharma',
    authorHandle: '@aarav_writes',
    authorAvatarUrl: DUMMY_USERS[0].avatarUrl,
    isVerified: true,
    quoteText: 'Some silences speak louder than a thousand words, if only you listen with your heart.',
    category: 'Quotes',
    backgroundImageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
    fontStyle: 'Serif',
    textColor: 0xFFFFFFFF,
    likesCount: 1420,
    commentsCount: 84,
    sharesCount: 310,
    isLiked: true,
    isSaved: true,
    isFeatured: true,
    timeAgo: '2h ago',
    commentPreview: 'Beautiful lines! Loved every word of it ✨',
  },
  {
    id: 'p2',
    authorId: 'u2',
    authorName: 'Priya Verma',
    authorHandle: '@priya_verses',
    authorAvatarUrl: DUMMY_USERS[1].avatarUrl,
    isVerified: true,
    quoteText: 'The trees whisper secrets of ancient winds to those who stop to listen.',
    category: 'Nature',
    backgroundImageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
    fontStyle: 'Serif',
    textColor: 0xFFFFFFFF,
    likesCount: 980,
    commentsCount: 42,
    sharesCount: 180,
    isLiked: false,
    isSaved: false,
    isFeatured: true,
    timeAgo: '5h ago',
    commentPreview: 'Nature is indeed the greatest poet 🌿',
  },
  {
    id: 'p3',
    authorId: 'u4',
    authorName: 'Ananya Roy',
    authorHandle: '@ananya_ink',
    authorAvatarUrl: DUMMY_USERS[3].avatarUrl,
    isVerified: true,
    quoteText: 'Love is not finding someone to live with; it is finding someone you cannot live without.',
    category: 'Love',
    backgroundImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    fontStyle: 'Cursive',
    textColor: 0xFFFFFFFF,
    likesCount: 2350,
    commentsCount: 156,
    sharesCount: 490,
    isLiked: true,
    isSaved: false,
    isFeatured: true,
    timeAgo: '8h ago',
    commentPreview: 'So deeply heartwarming ❤️',
  },
  {
    id: 'p4',
    authorId: 'u5',
    authorName: 'Kabir Das',
    authorHandle: '@kabir_couplets',
    authorAvatarUrl: DUMMY_USERS[4].avatarUrl,
    isVerified: true,
    quoteText: 'The mind is a garden, your thoughts are the seeds. You can grow flowers or weeds.',
    category: 'Motivation',
    backgroundImageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    fontStyle: 'Serif',
    textColor: 0xFFFFFFFF,
    likesCount: 3100,
    commentsCount: 210,
    sharesCount: 820,
    isLiked: false,
    isSaved: true,
    isFeatured: false,
    timeAgo: '12h ago',
    commentPreview: 'A great daily reminder 🔥',
  },
];

export const HASHTAGS = [
  '#Story', '#Poem', '#Quotes', '#Trending', '#Novel', '#Life', '#Culture', '#Unique', '#Feelings', '#Meme'
];

export const CATEGORIES_DATA = [
  {
    id: 'c1',
    name: 'Nature',
    emoji: '🌿',
    coverImageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
    quotes: [
      'The Earth has music for those who listen.',
      'In every walk with nature, one receives far more than he seeks.',
      'Look deep into nature, and you will understand everything better.',
      'Colors are the smiles of nature.'
    ]
  },
  {
    id: 'c2',
    name: 'Love',
    emoji: '❤️',
    coverImageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800',
    quotes: [
      'We are most alive when we are in love.',
      'Love is composed of a single soul inhabiting two bodies.',
      'To love and be loved is to feel the sun from both sides.',
      'Where there is love there is life.'
    ]
  },
  {
    id: 'c3',
    name: 'Politics',
    emoji: '🏛️',
    coverImageUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800',
    quotes: [
      'The ballot is stronger than the bullet.',
      'In a democracy, the individual enjoys not only the right to vote but the right to think.',
      'Leadership is about making others better as a result of your presence.',
      'Change will not come if we wait for some other person or some other time.'
    ]
  },
  {
    id: 'c4',
    name: 'Humor',
    emoji: '😂',
    coverImageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
    quotes: [
      'Laughter is timeless, imagination has no age, and dreams are forever.',
      'A day without laughter is a day wasted.',
      'I am so clever that sometimes I don’t understand a single word of what I am saying.',
      'Life is short. Smile while you still have teeth!'
    ]
  },
  {
    id: 'c5',
    name: 'Jokes',
    emoji: '🎭',
    coverImageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
    quotes: [
      'Why don’t scientists trust atoms? Because they make up everything!',
      'Parallel lines have so much in common. It’s a shame they’ll never meet.',
      'My wife told me to stop impersonating a flamingo. I had to put my foot down.',
      'I told my doctor that I broke my arm in two places. He told me to stop going to those places.'
    ]
  },
  {
    id: 'c6',
    name: 'Sadness',
    emoji: '🌧️',
    coverImageUrl: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800',
    quotes: [
      'Tears come from the heart and not from the brain.',
      'Behind every sweet smile, there is a bitter sadness that no one can see.',
      'Heavy hearts, like heavy clouds in the sky, are best relieved by the letting of a little water.',
      'The pain you feel today is the strength you feel tomorrow.'
    ]
  }
];

export const NOTIFICATIONS_DATA = [
  {
    id: 'n1',
    user: 'Priya Verma',
    avatarUrl: DUMMY_USERS[1].avatarUrl,
    action: 'liked your post: "Some silences speak louder..."',
    time: '10m ago',
    type: 'like',
    unread: true,
  },
  {
    id: 'n2',
    user: 'Ananya Roy',
    avatarUrl: DUMMY_USERS[3].avatarUrl,
    action: 'started following you.',
    time: '1h ago',
    type: 'follow',
    unread: true,
  },
  {
    id: 'n3',
    user: 'Kabir Das',
    avatarUrl: DUMMY_USERS[4].avatarUrl,
    action: 'commented: "Deeply inspiring thoughts brother!"',
    time: '3h ago',
    type: 'comment',
    unread: false,
  },
  {
    id: 'n4',
    user: 'Rohan Mehta',
    avatarUrl: DUMMY_USERS[2].avatarUrl,
    action: 'saved your quote post to their collection.',
    time: '5h ago',
    type: 'save',
    unread: false,
  },
];
