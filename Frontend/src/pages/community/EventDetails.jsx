import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  ArrowLeftIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const EventDetails = () => {
  const { id } = useParams();
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    company: '',
    dietaryRestrictions: '',
    questions: '',
  });

  // Mock event data - in a real app, this would come from an API
  const event = {
    id: id,
    title: "AI/ML Conference 2024",
    description: "Join leading experts in artificial intelligence and machine learning for a full day of presentations, workshops, and networking. This comprehensive conference brings together industry leaders, researchers, and practitioners to explore the cutting-edge developments in artificial intelligence and machine learning. Learn about the latest AI/ML research and breakthroughs, practical implementation strategies, industry case studies and success stories, networking opportunities with experts, and hands-on workshops and demonstrations.",
    date: '2024-03-25',
    time: '9:00 AM - 5:00 PM',
    location: 'New York',
    locationType: 'onsite',
    address: '456 Tech Center, New York, NY 10001',
    attendees: 156,
    maxAttendees: 300,
    organizer: {
      name: 'AI Research Institute',
      email: 'events@airesearch.org',
    },
    registrationDeadline: '2024-03-22',
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    // TODO: Implement registration logic
    console.log('Event registration:', {
      eventId: id,
      ...registrationData,
      timestamp: new Date().toISOString(),
    });
    setIsRegistered(true);
    setShowRegistrationModal(false);
    setRegistrationData({
      name: '',
      email: '',
      company: '',
      dietaryRestrictions: '',
      questions: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isEventFull = event.attendees >= event.maxAttendees;
  const registrationProgress = (event.attendees / event.maxAttendees) * 100;

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-soft-light pointer-events-none">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/40 via-purple-100/40 to-pink-100/40 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-200/30 via-transparent to-transparent dark:from-indigo-800/20" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Events
        </button>

        {/* Event Header */}
        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 mb-8 border border-gray-200/20 dark:border-gray-700/20">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{event.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <CalendarIcon className="h-5 w-5 mr-3" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <ClockIcon className="h-5 w-5 mr-3" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                {event.locationType === 'remote' ? (
                  <GlobeAltIcon className="h-5 w-5 mr-3" />
                ) : (
                  <BuildingOfficeIcon className="h-5 w-5 mr-3" />
                )}
                <div>
                  <span>{event.location}</span>
                  {event.locationType === 'onsite' && event.address && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {event.address}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <UserGroupIcon className="h-5 w-5 mr-3" />
                <span>{event.attendees}/{event.maxAttendees} attendees</span>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Organized by: <span className="font-medium text-gray-900 dark:text-white">{event.organizer.name}</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Contact: {event.organizer.email}
                </div>
              </div>
            </div>
          </div>

          {/* Registration Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
              <span>Registration Progress</span>
              <span>{Math.round(registrationProgress)}% full</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full"
                style={{ width: `${registrationProgress}%` }}
              />
            </div>
          </div>

          {/* Registration Status */}
          {isRegistered ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-green-800 dark:text-green-200 font-medium">
                  You're registered!
                </span>
              </div>
              <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                Check your email for confirmation details.
              </p>
            </div>
          ) : isEventFull ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                <span className="text-red-800 dark:text-red-200 font-medium">
                  Event is full
                </span>
              </div>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                Join the waitlist to be notified if spots open up.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-blue-800 dark:text-blue-200 font-medium">
                  Registration deadline: {event.registrationDeadline}
                </span>
              </div>
            </div>
          )}

          {/* Registration Button */}
          <button
            onClick={() => setShowRegistrationModal(true)}
            disabled={isRegistered}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRegistered ? 'Registered' : isEventFull ? 'Join Waitlist' : 'Register Now'}
          </button>
        </div>

        {/* Event Description */}
        <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-200/20 dark:border-gray-700/20">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">About This Event</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {event.description}
          </p>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Register for {event.title}
              </h2>
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleRegistration} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={registrationData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={registrationData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company/Organization
                </label>
                <input
                  type="text"
                  name="company"
                  value={registrationData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Dietary Restrictions
                </label>
                <input
                  type="text"
                  name="dietaryRestrictions"
                  value={registrationData.dietaryRestrictions}
                  onChange={handleInputChange}
                  placeholder="Any allergies or dietary needs"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Questions or Comments
                </label>
                <textarea
                  name="questions"
                  value={registrationData.questions}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any questions for the organizers?"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRegistrationModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;