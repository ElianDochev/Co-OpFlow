import { 
  mockProjects, 
  mockTeams, 
  mockEvents, 
  mockStartups, 
  mockNotifications, 
  mockChats, 
  mockForumThreads,
  simulateApiDelay 
} from './mockData';

// Mock API service that simulates real API calls
const mockApi = {
  // Authentication endpoints
  auth: {
    login: async (email, password) => {
      await simulateApiDelay(800);
      
      if (email === 'a@a.com' && password === '12345678') {
        return {
          success: true,
          user: {
            id: 1,
            name: 'John Doe',
            email: 'a@a.com',
            role: 'Software Engineer',
            avatar: 'https://i.pravatar.cc/150?img=1',
            token: 'mock-jwt-token-12345',
          },
          token: 'mock-jwt-token-12345',
        };
      } else {
        throw new Error('Invalid email or password');
      }
    },

    register: async (userData) => {
      await simulateApiDelay(1000);
      return {
        success: true,
        user: {
          id: Date.now(),
          ...userData,
          avatar: 'https://i.pravatar.cc/150?img=1',
          token: 'mock-jwt-token-' + Date.now(),
        },
        token: 'mock-jwt-token-' + Date.now(),
      };
    },

    logout: async () => {
      await simulateApiDelay(300);
      return { success: true };
    },
  },

  // User management endpoints
  users: {
    getMe: async () => {
      await simulateApiDelay(500);
      return {
        id: 1,
        name: 'John Doe',
        email: 'a@a.com',
        role: 'Software Engineer',
        bio: 'Passionate about building innovative solutions and collaborating with like-minded individuals.',
        location: 'San Francisco, CA',
        skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker'],
        avatar: 'https://i.pravatar.cc/150?img=1',
      };
    },

    updateMe: async (userData) => {
      await simulateApiDelay(800);
      return {
        success: true,
        user: { id: 1, ...userData },
      };
    },

    uploadAvatar: async (file) => {
      await simulateApiDelay(1500);
      return {
        success: true,
        avatarUrl: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 10),
      };
    },

    getById: async (id) => {
      await simulateApiDelay(600);
      return {
        id: parseInt(id),
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        role: 'Full Stack Developer',
        bio: 'Passionate about building scalable web applications with modern technologies.',
        location: 'New York, NY',
        skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'Docker'],
        avatar: 'https://i.pravatar.cc/150?img=2',
        rating: 4.9,
        experience: '5 years',
      };
    },
  },

  // Projects endpoints
  projects: {
    getAll: async (params = {}) => {
      await simulateApiDelay(700);
      let filteredProjects = [...mockProjects];
      
      if (params.category && params.category !== 'all') {
        filteredProjects = filteredProjects.filter(p => 
          p.category.toLowerCase() === params.category.toLowerCase()
        );
      }
      
      if (params.search) {
        filteredProjects = filteredProjects.filter(p => 
          p.title.toLowerCase().includes(params.search.toLowerCase()) ||
          p.description.toLowerCase().includes(params.search.toLowerCase())
        );
      }
      
      return {
        projects: filteredProjects,
        total: filteredProjects.length,
        page: parseInt(params.page) || 1,
        limit: parseInt(params.limit) || 10,
      };
    },

    getById: async (id) => {
      await simulateApiDelay(500);
      const project = mockProjects.find(p => p.id === parseInt(id));
      if (!project) {
        throw new Error('Project not found');
      }
      return project;
    },

    create: async (projectData) => {
      await simulateApiDelay(1000);
      const newProject = {
        id: Date.now(),
        ...projectData,
        likes: 0,
        stars: 0,
        members: 1,
        status: 'Planning',
        progress: 0,
        team: [],
        comments: [],
        timeLeft: '30 days',
      };
      return newProject;
    },

    update: async (id, projectData) => {
      await simulateApiDelay(800);
      return {
        success: true,
        project: { id: parseInt(id), ...projectData },
      };
    },

    delete: async (id) => {
      await simulateApiDelay(600);
      return { success: true };
    },

    like: async (id) => {
      await simulateApiDelay(300);
      return { success: true, liked: true };
    },

    star: async (id) => {
      await simulateApiDelay(300);
      return { success: true, starred: true };
    },
  },

  // Teams endpoints
  teams: {
    getAll: async (params = {}) => {
      await simulateApiDelay(600);
      let filteredTeams = [...mockTeams];
      
      if (params.skills) {
        filteredTeams = filteredTeams.filter(t => 
          t.skills.some(skill => 
            skill.toLowerCase().includes(params.skills.toLowerCase())
          )
        );
      }
      
      if (params.search) {
        filteredTeams = filteredTeams.filter(t => 
          t.name.toLowerCase().includes(params.search.toLowerCase()) ||
          t.description.toLowerCase().includes(params.search.toLowerCase())
        );
      }
      
      return {
        teams: filteredTeams,
        total: filteredTeams.length,
        page: parseInt(params.page) || 1,
        limit: parseInt(params.limit) || 10,
      };
    },

    getById: async (id) => {
      await simulateApiDelay(500);
      const team = mockTeams.find(t => t.id === parseInt(id));
      if (!team) {
        throw new Error('Team not found');
      }
      return {
        ...team,
        projects: [
          {
            name: team.currentProject,
            status: 'In Progress',
            progress: 65,
            description: 'Building an intelligent task management system with ML capabilities',
          }
        ],
        likes: 189,
        stars: 142,
        comments: [
          {
            user: 'Alex Brown',
            avatar: 'https://i.pravatar.cc/150?img=5',
            text: 'Great team! Would love to collaborate on future projects.',
            timestamp: '3 hours ago'
          }
        ]
      };
    },

    create: async (teamData) => {
      await simulateApiDelay(1000);
      const newTeam = {
        id: Date.now(),
        ...teamData,
        members: 1,
        posted: 'just now',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(teamData.name)}&background=6366f1&color=fff`,
      };
      return newTeam;
    },

    update: async (id, teamData) => {
      await simulateApiDelay(800);
      return {
        success: true,
        team: { id: parseInt(id), ...teamData },
      };
    },

    delete: async (id) => {
      await simulateApiDelay(600);
      return { success: true };
    },

    apply: async (id, applicationData) => {
      await simulateApiDelay(1000);
      return {
        success: true,
        message: 'Application submitted successfully',
      };
    },

    invite: async (id, invitationData) => {
      await simulateApiDelay(800);
      return {
        success: true,
        message: 'Invitation sent successfully',
      };
    },

    leave: async (id) => {
      await simulateApiDelay(600);
      return {
        success: true,
        message: 'Left team successfully',
      };
    },

    getMyTeams: async () => {
      await simulateApiDelay(500);
      return [
        {
          id: 1,
          name: 'Innovation Squad',
          role: 'Team Lead',
          members: 5,
          project: 'AI-Powered Task Manager',
          status: 'Active',
          joinedDate: '2024-01-15',
          avatar: 'https://ui-avatars.com/api/?name=Innovation+Squad&background=6366f1&color=fff',
        },
        {
          id: 2,
          name: 'Web Wizards',
          role: 'Frontend Developer',
          members: 3,
          project: 'E-commerce Platform',
          status: 'Active',
          joinedDate: '2024-02-20',
          avatar: 'https://ui-avatars.com/api/?name=Web+Wizards&background=8b5cf6&color=fff',
        },
      ];
    },

    getInvitations: async () => {
      await simulateApiDelay(400);
      return [
        {
          id: 1,
          teamName: 'VR Educators',
          invitedBy: 'Sarah Wilson',
          role: 'Frontend Developer',
          message: 'We would love to have you join our VR education project.',
          receivedDate: '2024-03-10',
          status: 'pending',
        },
      ];
    },

    acceptInvitation: async (id) => {
      await simulateApiDelay(600);
      return { success: true };
    },

    declineInvitation: async (id) => {
      await simulateApiDelay(400);
      return { success: true };
    },

    getApplications: async () => {
      await simulateApiDelay(500);
      return [
        {
          id: 1,
          teamName: 'AI Research Lab',
          appliedFor: 'Machine Learning Engineer',
          appliedDate: '2024-03-05',
          status: 'under_review',
          coverLetter: 'I am excited to apply for the ML Engineer position...',
        },
      ];
    },
  },

  // Community endpoints
  community: {
    getThreads: async (params = {}) => {
      await simulateApiDelay(600);
      let filteredThreads = [...mockForumThreads];
      
      if (params.category && params.category !== 'All Categories') {
        filteredThreads = filteredThreads.filter(t => 
          t.category === params.category
        );
      }
      
      if (params.search) {
        filteredThreads = filteredThreads.filter(t => 
          t.title.toLowerCase().includes(params.search.toLowerCase())
        );
      }
      
      return {
        threads: filteredThreads,
        total: filteredThreads.length,
      };
    },

    getThread: async (id) => {
      await simulateApiDelay(500);
      const thread = mockForumThreads.find(t => t.id === parseInt(id));
      if (!thread) {
        throw new Error('Thread not found');
      }
      return {
        ...thread,
        content: 'This is the full content of the forum thread...',
        replies: [
          {
            id: 1,
            user: 'Jane Smith',
            avatar: 'https://i.pravatar.cc/150?img=2',
            content: 'Great question! Here are some best practices...',
            timestamp: '2 hours ago',
            likes: 5,
          }
        ]
      };
    },

    createThread: async (threadData) => {
      await simulateApiDelay(800);
      return {
        id: Date.now(),
        ...threadData,
        author: 'John Doe',
        replies: 0,
        views: 1,
        lastActivity: 'just now',
      };
    },

    replyToThread: async (id, replyData) => {
      await simulateApiDelay(600);
      return {
        id: Date.now(),
        ...replyData,
        user: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?img=1',
        timestamp: 'just now',
        likes: 0,
      };
    },

    getEvents: async (params = {}) => {
      await simulateApiDelay(600);
      let filteredEvents = [...mockEvents];
      
      if (params.category && params.category !== 'All Categories') {
        filteredEvents = filteredEvents.filter(e => 
          e.category === params.category
        );
      }
      
      if (params.search) {
        filteredEvents = filteredEvents.filter(e => 
          e.title.toLowerCase().includes(params.search.toLowerCase())
        );
      }
      
      return {
        events: filteredEvents,
        total: filteredEvents.length,
      };
    },

    getEvent: async (id) => {
      await simulateApiDelay(500);
      const event = mockEvents.find(e => e.id === parseInt(id));
      if (!event) {
        throw new Error('Event not found');
      }
      return event;
    },

    createEvent: async (eventData) => {
      await simulateApiDelay(1000);
      return {
        id: Date.now(),
        ...eventData,
        attendees: 0,
        organizer: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      };
    },

    registerForEvent: async (id, registrationData) => {
      await simulateApiDelay(800);
      return {
        success: true,
        message: 'Successfully registered for event',
      };
    },

    getRegisteredEvents: async () => {
      await simulateApiDelay(500);
      return mockEvents.slice(0, 1);
    },
  },

  // Funding endpoints
  funding: {
    getStartups: async (params = {}) => {
      await simulateApiDelay(700);
      let filteredStartups = [...mockStartups];
      
      if (params.industry && params.industry !== 'All Industries') {
        filteredStartups = filteredStartups.filter(s => 
          s.industry === params.industry
        );
      }
      
      if (params.search) {
        filteredStartups = filteredStartups.filter(s => 
          s.name.toLowerCase().includes(params.search.toLowerCase()) ||
          s.description.toLowerCase().includes(params.search.toLowerCase())
        );
      }
      
      return {
        startups: filteredStartups,
        total: filteredStartups.length,
      };
    },

    getStartup: async (id) => {
      await simulateApiDelay(500);
      const startup = mockStartups.find(s => s.id === parseInt(id));
      if (!startup) {
        throw new Error('Startup not found');
      }
      return {
        ...startup,
        fullDescription: 'This comprehensive startup brings together industry leaders...',
        pitchDeck: {
          title: startup.name + ' - Series A',
          slides: 15,
          lastUpdated: '2024-03-01',
          url: '#',
        },
        likes: 234,
        stars: 156,
        comments: [
          {
            user: 'Sarah Wilson',
            avatar: 'https://i.pravatar.cc/150?img=4',
            text: 'The technology looks promising, and the team has a strong track record.',
            timestamp: '2 hours ago'
          }
        ]
      };
    },

    createStartup: async (startupData) => {
      await simulateApiDelay(1200);
      return {
        id: Date.now(),
        ...startupData,
        raised: 0,
        investors: 0,
        daysLeft: 30,
      };
    },

    invest: async (id, investmentData) => {
      await simulateApiDelay(1000);
      return {
        success: true,
        message: 'Investment recorded successfully',
      };
    },

    getInvestments: async () => {
      await simulateApiDelay(600);
      return [
        {
          id: 1,
          startup: 'TechVision AI',
          amount: 50000,
          date: '2024-02-15',
          status: 'Active',
          return: '+15%',
          type: 'Equity',
        },
      ];
    },

    getPitchDecks: async () => {
      await simulateApiDelay(500);
      return [
        {
          id: 1,
          title: 'TechVision AI Pitch Deck',
          startup: 'TechVision AI',
          views: 156,
          downloads: 45,
          lastUpdated: '2024-02-20',
          status: 'Public',
        },
      ];
    },

    getPitchDeck: async (id) => {
      await simulateApiDelay(600);
      return {
        id: parseInt(id),
        title: 'TechVision AI Pitch Deck',
        startup: 'TechVision AI',
        url: '#',
        slides: 15,
      };
    },
  },

  // Messaging endpoints
  messages: {
    getChats: async () => {
      await simulateApiDelay(500);
      return mockChats;
    },

    getMessages: async (chatId) => {
      await simulateApiDelay(400);
      return [
        {
          id: 1,
          sender: 'Sarah Chen',
          content: 'Hey, I saw your project on the platform. Would love to discuss collaboration!',
          time: '10:25 AM',
          isOwn: false,
        },
        {
          id: 2,
          sender: 'You',
          content: 'Hi Sarah! Thanks for reaching out. I\'d love to hear more about your experience.',
          time: '10:27 AM',
          isOwn: true,
        },
      ];
    },

    sendMessage: async (chatId, messageData) => {
      await simulateApiDelay(300);
      return {
        id: Date.now(),
        ...messageData,
        sender: 'You',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
      };
    },

    createChat: async (participantIds) => {
      await simulateApiDelay(600);
      return {
        id: Date.now(),
        participants: participantIds,
        lastMessage: '',
        time: 'now',
        unread: 0,
      };
    },
  },

  // Notifications endpoints
  notifications: {
    getAll: async () => {
      await simulateApiDelay(400);
      return mockNotifications;
    },

    markAsRead: async (id) => {
      await simulateApiDelay(200);
      return { success: true };
    },

    markAllAsRead: async () => {
      await simulateApiDelay(300);
      return { success: true };
    },
  },
};

export default mockApi;