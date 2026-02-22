// Mock data for development and testing
export const mockProjects = [
  {
    id: 1,
    title: 'AI-Powered Task Manager',
    description: 'An intelligent task management system that learns from your work patterns and optimizes productivity through machine learning algorithms.',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    likes: 245,
    stars: 189,
    members: 12,
    timeLeft: '5 days',
    techStack: ['React', 'Node.js', 'Python', 'TensorFlow'],
    teamName: 'AI Innovators',
    lookingFor: 'Frontend Developer, ML Engineer',
    status: 'In Progress',
    progress: 65,
    team: [
      { name: 'John Doe', role: 'Team Lead', avatar: 'https://i.pravatar.cc/150?img=1', skills: ['React', 'Node.js', 'Leadership'] },
      { name: 'Jane Smith', role: 'Senior Developer', avatar: 'https://i.pravatar.cc/150?img=2', skills: ['Python', 'AI', 'Machine Learning'] },
    ],
    comments: [
      {
        user: 'Alex Brown',
        avatar: 'https://i.pravatar.cc/150?img=5',
        text: 'Great team! Would love to collaborate on future projects.',
        timestamp: '3 hours ago'
      }
    ]
  },
  {
    id: 2,
    title: 'Sustainable Fashion Marketplace',
    description: 'A platform connecting eco-friendly fashion brands with conscious consumers, promoting sustainable fashion choices.',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    likes: 189,
    stars: 156,
    members: 8,
    timeLeft: '3 days',
    techStack: ['Vue.js', 'Laravel', 'MySQL', 'Stripe'],
    teamName: 'EcoTech Solutions',
    lookingFor: 'UI/UX Designer, Backend Developer',
    status: 'Planning',
    progress: 20,
    team: [
      { name: 'Mike Johnson', role: 'UI/UX Designer', avatar: 'https://i.pravatar.cc/150?img=3', skills: ['Figma', 'UI Design', 'User Research'] },
    ],
    comments: []
  },
];

export const mockTeams = [
  {
    id: 1,
    name: 'Innovation Squad',
    description: 'Looking for a UI/UX designer to join our team working on a revolutionary mobile app for productivity management.',
    skills: ['UI/UX Design', 'Figma', 'Mobile Design', 'User Research'],
    members: 4,
    location: 'Remote',
    posted: '2 days ago',
    currentProject: 'AI-Powered Task Manager',
    avatar: 'https://ui-avatars.com/api/?name=Innovation+Squad&background=6366f1&color=fff',
    team: [
      { name: 'John Doe', role: 'Team Lead', avatar: 'https://i.pravatar.cc/150?img=1' },
      { name: 'Jane Smith', role: 'Senior Developer', avatar: 'https://i.pravatar.cc/150?img=2' },
    ],
    lookingFor: ['Frontend Developer', 'ML Engineer', 'DevOps Engineer'],
  },
  {
    id: 2,
    name: 'Tech Pioneers',
    description: 'Seeking a backend developer with experience in Node.js and MongoDB for our e-commerce platform.',
    skills: ['Node.js', 'MongoDB', 'API Development', 'AWS'],
    members: 3,
    location: 'San Francisco',
    posted: '1 day ago',
    currentProject: 'Sustainable Fashion Marketplace',
    avatar: 'https://ui-avatars.com/api/?name=Tech+Pioneers&background=8b5cf6&color=fff',
    team: [
      { name: 'Mike Johnson', role: 'UI/UX Designer', avatar: 'https://i.pravatar.cc/150?img=3' },
    ],
    lookingFor: ['Backend Developer', 'DevOps Engineer'],
  },
];

export const mockEvents = [
  {
    id: 1,
    title: 'Web Development Workshop',
    description: 'Learn modern web development techniques with React, Node.js, and best practices for building scalable applications.',
    date: '2024-03-15',
    time: '10:00 AM - 2:00 PM',
    location: 'Virtual',
    locationType: 'remote',
    attendees: 45,
    maxAttendees: 100,
    category: 'Workshop',
    organizer: {
      name: 'Tech Academy',
      email: 'events@techacademy.org',
    },
    registrationDeadline: '2024-03-14',
    price: 'Free',
    requirements: 'Basic HTML/CSS knowledge',
  },
  {
    id: 2,
    title: 'Startup Networking Mixer',
    description: 'Connect with fellow entrepreneurs, investors, and startup enthusiasts in the Bay Area.',
    date: '2024-03-20',
    time: '6:00 PM - 9:00 PM',
    location: 'San Francisco',
    locationType: 'onsite',
    address: '123 Innovation Street, San Francisco, CA 94107',
    attendees: 78,
    maxAttendees: 150,
    category: 'Networking',
    organizer: {
      name: 'SF Startup Community',
      email: 'events@sfstartup.org',
    },
    registrationDeadline: '2024-03-19',
    price: '$25',
    requirements: 'Bring business cards',
  },
];

export const mockStartups = [
  {
    id: 1,
    name: 'TechVision AI',
    description: 'AI-powered computer vision solutions for industrial automation',
    industry: 'Artificial Intelligence',
    fundingGoal: 500000,
    raised: 250000,
    investors: 12,
    daysLeft: 15,
    valuation: 2000000,
    team: [
      { name: 'John Doe', role: 'CEO & Co-founder', avatar: 'https://i.pravatar.cc/150?img=1' },
      { name: 'Jane Smith', role: 'CTO', avatar: 'https://i.pravatar.cc/150?img=2' },
    ],
    metrics: {
      users: 50000,
      growth: 25,
      revenue: 1200000,
      burnRate: 150000,
    },
  },
  {
    id: 2,
    name: 'GreenEnergy Solutions',
    description: 'Renewable energy management platform for businesses',
    industry: 'Clean Energy',
    fundingGoal: 750000,
    raised: 375000,
    investors: 18,
    daysLeft: 22,
    valuation: 3000000,
    team: [
      { name: 'Mike Johnson', role: 'Founder', avatar: 'https://i.pravatar.cc/150?img=3' },
    ],
    metrics: {
      users: 25000,
      growth: 15,
      revenue: 800000,
      burnRate: 100000,
    },
  },
];

export const mockNotifications = [
  {
    id: 1,
    type: 'connection',
    title: 'New Connection Request',
    message: 'John Doe wants to connect with you',
    time: '5 minutes ago',
    read: false,
  },
  {
    id: 2,
    type: 'message',
    title: 'New Message',
    message: 'Jane Smith sent you a message about the project',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'like',
    title: 'Project Liked',
    message: 'Your project "AI Assistant" received a like',
    time: '2 hours ago',
    read: true,
  },
];

export const mockChats = [
  {
    id: 1,
    name: 'Sarah Chen',
    lastMessage: 'Hey, I saw your project on the platform. Would love to discuss collaboration!',
    time: '10:30 AM',
    unread: 2,
    avatar: 'https://i.pravatar.cc/150?img=1',
    online: true,
    title: 'Full Stack Developer',
    location: 'New York',
    skills: ['React', 'Node.js', 'Python', 'PostgreSQL'],
    bio: 'Passionate about building scalable web applications with modern technologies.',
  },
  {
    id: 2,
    name: 'Marcus Rodriguez',
    lastMessage: 'The design mockups are ready for review',
    time: 'Yesterday',
    unread: 0,
    avatar: 'https://i.pravatar.cc/150?img=3',
    online: false,
    title: 'UI/UX Designer',
    location: 'Los Angeles',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    bio: 'Creative designer specializing in user-centered design and modern interfaces.',
  },
];

export const mockForumThreads = [
  {
    id: 1,
    title: 'Getting Started with React',
    category: 'Development',
    author: 'John Doe',
    replies: 24,
    views: 156,
    lastActivity: '2 hours ago',
    description: 'A discussion about implementing AI features in web applications, focusing on practical approaches, common challenges, and success stories.',
    tags: ['React', 'JavaScript', 'Frontend'],
  },
  {
    id: 2,
    title: 'Best Practices for UI/UX Design',
    category: 'Design',
    author: 'Jane Smith',
    replies: 18,
    views: 98,
    lastActivity: '5 hours ago',
    description: 'Share your best practices and tips for creating user-friendly interfaces.',
    tags: ['UI/UX', 'Design', 'User Experience'],
  },
];

// Helper function to simulate API delay
export const simulateApiDelay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};