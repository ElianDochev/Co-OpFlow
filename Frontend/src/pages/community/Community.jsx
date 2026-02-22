import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChatBubbleOvalLeftIcon,
  CalendarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

const Community = () => {
  const [activeTab, setActiveTab] = useState('forums');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    locationType: 'remote', // 'remote' or 'onsite'
    address: '',
    category: '',
    maxAttendees: '',
  });

  const forums = [
    {
      id: 1,
      title: 'Getting Started with React',
      category: 'Development',
      author: 'John Doe',
      replies: 24,
      views: 156,
      lastActivity: '2 hours ago',
    },
    {
      id: 2,
      title: 'Best Practices for UI/UX Design',
      category: 'Design',
      author: 'Jane Smith',
      replies: 18,
      views: 98,
      lastActivity: '5 hours ago',
    },
    {
      id: 3,
      title: 'Building Scalable Backend APIs',
      category: 'Development',
      author: 'Mike Johnson',
      replies: 32,
      views: 245,
      lastActivity: '1 day ago',
    },
    {
      id: 4,
      title: 'Startup Funding Strategies',
      category: 'Business',
      author: 'Sarah Wilson',
      replies: 15,
      views: 89,
      lastActivity: '2 days ago',
    },
  ];

  const events = [
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
      organizer: 'Tech Academy',
      registrationDeadline: '2024-03-14',
      price: 'Free',
      requirements: 'Basic HTML/CSS knowledge',
    },
    {
      id: 2,
      title: 'Startup Networking Mixer',
      description: 'Connect with fellow entrepreneurs, investors, and startup enthusiasts in the Bay Area. Great opportunity for networking and collaboration.',
      date: '2024-03-20',
      time: '6:00 PM - 9:00 PM',
      location: 'San Francisco',
      locationType: 'onsite',
      address: '123 Innovation Street, San Francisco, CA 94107',
      attendees: 78,
      maxAttendees: 150,
      category: 'Networking',
      organizer: 'SF Startup Community',
      registrationDeadline: '2024-03-19',
      price: '$25',
      requirements: 'Bring business cards',
    },
    {
      id: 3,
      title: 'AI/ML Conference 2024',
      description: 'Join leading experts in artificial intelligence and machine learning for a full day of presentations, workshops, and networking.',
      date: '2024-03-25',
      time: '9:00 AM - 5:00 PM',
      location: 'New York',
      locationType: 'onsite',
      address: '456 Tech Center, New York, NY 10001',
      attendees: 156,
      maxAttendees: 300,
      category: 'Conference',
      organizer: 'AI Research Institute',
      registrationDeadline: '2024-03-22',
      price: '$150',
      requirements: 'Laptop recommended',
    },
    {
      id: 4,
      title: 'Design Thinking Masterclass',
      description: 'Master the principles of design thinking and learn how to apply them to solve complex problems in your projects.',
      date: '2024-03-30',
      time: '2:00 PM - 6:00 PM',
      location: 'Virtual',
      locationType: 'remote',
      attendees: 32,
      maxAttendees: 80,
      category: 'Workshop',
      organizer: 'Design Collective',
      registrationDeadline: '2024-03-29',
      price: '$50',
      requirements: 'Design software access helpful',
    },
  ];

  const categories = ['Development', 'Design', 'Business', 'AI/ML', 'Startup', 'General'];
  const eventCategories = ['Workshop', 'Conference', 'Networking', 'Meetup', 'Webinar', 'Hackathon'];

  const handleCreateThread = (e) => {
    e.preventDefault();
    // TODO: Implement thread creation logic
    console.log('New thread:', newThread);
    setShowCreateModal(false);
    setNewThread({
      title: '',
      content: '',
      category: '',
    });
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    // TODO: Implement event creation logic
    console.log('New event:', newEvent);
    setShowCreateModal(false);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      locationType: 'remote',
      address: '',
      category: '',
      maxAttendees: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (activeTab === 'forums') {
      setNewThread(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setNewEvent(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRegisterForEvent = (eventId) => {
    // TODO: Implement event registration logic
    console.log('Registering for event:', eventId);
    alert('Successfully registered for the event! You will receive a confirmation email shortly.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Community
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect with other members, join discussions, and participate in events.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          {activeTab === 'forums' ? 'Create Thread' : 'Create Event'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('forums')}
            className={`${
              activeTab === 'forums'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <ChatBubbleOvalLeftIcon className="h-5 w-5 mr-2" />
            Forums
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`${
              activeTab === 'events'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <CalendarIcon className="h-5 w-5 mr-2" />
            Events
          </button>
        </nav>
      </div>

      {/* Search Bar */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400" />
            <select className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>All Categories</option>
              {activeTab === 'forums' ? (
                categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              ) : (
                eventCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'forums' && (
        <div className="space-y-6">
          {forums.map((forum) => (
            <div
              key={forum.id}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Link
                      to={`/forums/${forum.id}`}
                      className="text-xl font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {forum.title}
                    </Link>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      {forum.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>By {forum.author}</span>
                    <span>{forum.replies} replies</span>
                    <span>{forum.views} views</span>
                    <span>Last activity: {forum.lastActivity}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      {event.category}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>{event.date} • {event.time}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  {event.locationType === 'remote' ? (
                    <GlobeAltIcon className="h-4 w-4 mr-2" />
                  ) : (
                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                  )}
                  <span>{event.location}</span>
                  {event.locationType === 'remote' && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs">
                      Remote
                    </span>
                  )}
                  {event.locationType === 'onsite' && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
                      On-site
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  <span>{event.attendees}/{event.maxAttendees} attendees</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Price: {event.price}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                  <span>Registration</span>
                  <span>{Math.round((event.attendees / event.maxAttendees) * 100)}% full</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  By {event.organizer}
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/events/${event.id}`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleRegisterForEvent(event.id)}
                    disabled={event.attendees >= event.maxAttendees}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {event.attendees >= event.maxAttendees ? 'Full' : 'Register'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Thread/Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {activeTab === 'forums' ? 'Create New Thread' : 'Create New Event'}
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {activeTab === 'forums' ? (
              <form onSubmit={handleCreateThread} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Thread Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={newThread.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter thread title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={newThread.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content
                  </label>
                  <textarea
                    name="content"
                    value={newThread.content}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Write your thread content..."
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Create Thread
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Event Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newEvent.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter event title..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={newEvent.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Category</option>
                      {eventCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Describe your event..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={newEvent.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time
                    </label>
                    <input
                      type="text"
                      name="time"
                      value={newEvent.time}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 10:00 AM - 2:00 PM"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="locationType"
                        value="remote"
                        checked={newEvent.locationType === 'remote'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-gray-700 dark:text-gray-300">Remote</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="locationType"
                        value="onsite"
                        checked={newEvent.locationType === 'onsite'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-gray-700 dark:text-gray-300">On-site</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {newEvent.locationType === 'remote' ? 'Platform/Link' : 'Location'}
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={newEvent.location}
                    onChange={handleInputChange}
                    required
                    placeholder={newEvent.locationType === 'remote' ? 'Zoom, Google Meet, etc.' : 'City or venue name'}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {newEvent.locationType === 'onsite' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={newEvent.address}
                      onChange={handleInputChange}
                      placeholder="Full address with street, city, state, zip"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Maximum Attendees
                  </label>
                  <input
                    type="number"
                    name="maxAttendees"
                    value={newEvent.maxAttendees}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="e.g., 100"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;