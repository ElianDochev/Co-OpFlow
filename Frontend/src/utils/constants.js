// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  
  // Users
  USER_PROFILE: '/users/me',
  USER_BY_ID: '/users/:id',
  UPLOAD_AVATAR: '/users/me/avatar',
  
  // Projects
  PROJECTS: '/projects',
  PROJECT_BY_ID: '/projects/:id',
  LIKE_PROJECT: '/projects/:id/like',
  STAR_PROJECT: '/projects/:id/star',
  
  // Teams
  TEAMS: '/teams',
  TEAM_BY_ID: '/teams/:id',
  APPLY_TO_TEAM: '/teams/:id/apply',
  INVITE_TO_TEAM: '/teams/:id/invite',
  LEAVE_TEAM: '/teams/:id/leave',
  MY_TEAMS: '/users/me/teams',
  TEAM_INVITATIONS: '/users/me/team-invitations',
  TEAM_APPLICATIONS: '/users/me/team-applications',
  
  // Community
  FORUM_THREADS: '/forums/threads',
  FORUM_THREAD_BY_ID: '/forums/threads/:id',
  THREAD_REPLIES: '/forums/threads/:id/replies',
  EVENTS: '/events',
  EVENT_BY_ID: '/events/:id',
  REGISTER_FOR_EVENT: '/events/:id/register',
  REGISTERED_EVENTS: '/users/me/registered-events',
  
  // Funding
  STARTUPS: '/funding/startups',
  STARTUP_BY_ID: '/funding/startups/:id',
  INVEST_IN_STARTUP: '/funding/startups/:id/invest',
  MY_INVESTMENTS: '/users/me/investments',
  PITCH_DECKS: '/funding/pitch-decks',
  PITCH_DECK_BY_ID: '/funding/pitch-decks/:id',
  
  // Messaging
  CHATS: '/messages/chats',
  CHAT_MESSAGES: '/messages/chats/:id/messages',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  MARK_NOTIFICATION_READ: '/notifications/:id/read',
  MARK_ALL_NOTIFICATIONS_READ: '/notifications/mark-all-read',
};

// Application constants
export const APP_CONFIG = {
  APP_NAME: 'Co-OpFlow',
  APP_DESCRIPTION: 'Find collaborators for your dream projects',
  DEFAULT_PAGE_SIZE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};

// UI Constants
export const UI_CONSTANTS = {
  NAVBAR_HEIGHT: 64,
  SIDEBAR_WIDTH: 256,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
};

// Status constants
export const PROJECT_STATUS = {
  PLANNING: 'Planning',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
  CANCELLED: 'Cancelled',
};

export const TEAM_STATUS = {
  ACTIVE: 'Active',
  RECRUITING: 'Recruiting',
  FULL: 'Full',
  INACTIVE: 'Inactive',
};

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
};

export const NOTIFICATION_TYPES = {
  CONNECTION: 'connection',
  MESSAGE: 'message',
  LIKE: 'like',
  STAR: 'star',
  COMMENT: 'comment',
  INVITATION: 'invitation',
  APPLICATION: 'application',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};

// Categories
export const PROJECT_CATEGORIES = [
  'Technology',
  'Design',
  'Business',
  'Education',
  'Health',
  'Entertainment',
  'Finance',
  'Marketing',
  'Other',
];

export const EVENT_CATEGORIES = [
  'Workshop',
  'Conference',
  'Networking',
  'Meetup',
  'Webinar',
  'Hackathon',
  'Panel',
  'Other',
];

export const STARTUP_INDUSTRIES = [
  'Artificial Intelligence',
  'Clean Energy',
  'Healthcare',
  'Fintech',
  'E-commerce',
  'Education',
  'Gaming',
  'Social Media',
  'Enterprise Software',
  'Consumer Apps',
  'Other',
];

// Skills and technologies
export const POPULAR_SKILLS = [
  'React',
  'Node.js',
  'Python',
  'JavaScript',
  'TypeScript',
  'Vue.js',
  'Angular',
  'PHP',
  'Java',
  'C#',
  'Go',
  'Rust',
  'Swift',
  'Kotlin',
  'Flutter',
  'React Native',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'GCP',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'Redis',
  'GraphQL',
  'REST API',
  'Microservices',
  'DevOps',
  'CI/CD',
  'Machine Learning',
  'Data Science',
  'UI/UX Design',
  'Figma',
  'Adobe XD',
  'Photoshop',
  'Illustrator',
  'Product Management',
  'Digital Marketing',
  'SEO',
  'Content Writing',
  'Social Media Marketing',
  'Business Development',
  'Sales',
  'Finance',
  'Legal',
  'HR',
];

export default {
  API_ENDPOINTS,
  APP_CONFIG,
  UI_CONSTANTS,
  PROJECT_STATUS,
  TEAM_STATUS,
  APPLICATION_STATUS,
  NOTIFICATION_TYPES,
  PROJECT_CATEGORIES,
  EVENT_CATEGORIES,
  STARTUP_INDUSTRIES,
  POPULAR_SKILLS,
};