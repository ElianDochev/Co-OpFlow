import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  UserGroupIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const Funding = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');

  const startups = [
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
    },
    // Add more startups as needed
  ];

  const investments = [
    {
      id: 1,
      startup: 'TechVision AI',
      amount: 50000,
      date: '2024-02-15',
      status: 'Active',
      return: '+15%',
      type: 'Equity',
    },
    {
      id: 2,
      startup: 'GreenEnergy Solutions',
      amount: 75000,
      date: '2024-01-20',
      status: 'Active',
      return: '+8%',
      type: 'Convertible Note',
    },
    // Add more investments as needed
  ];

  const pitchDecks = [
    {
      id: 1,
      title: 'TechVision AI Pitch Deck',
      startup: 'TechVision AI',
      views: 156,
      downloads: 45,
      lastUpdated: '2024-02-20',
      status: 'Public',
    },
    {
      id: 2,
      title: 'GreenEnergy Solutions Pitch Deck',
      startup: 'GreenEnergy Solutions',
      views: 98,
      downloads: 32,
      lastUpdated: '2024-02-15',
      status: 'Private',
    },
    // Add more pitch decks as needed
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Funding
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Discover investment opportunities, manage your portfolio, and access pitch decks.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('browse')}
            className={`${
              activeTab === 'browse'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <BuildingOfficeIcon className="h-5 w-5 mr-2" />
            Browse Startups
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`${
              activeTab === 'dashboard'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <BanknotesIcon className="h-5 w-5 mr-2" />
            Investment Dashboard
          </button>
          <button
            onClick={() => setActiveTab('pitch-decks')}
            className={`${
              activeTab === 'pitch-decks'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Pitch Decks
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
                placeholder={`Search ${activeTab === 'browse' ? 'startups' : activeTab === 'dashboard' ? 'investments' : 'pitch decks'}...`}
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
              <option>All Industries</option>
              <option>Artificial Intelligence</option>
              <option>Clean Energy</option>
              <option>Healthcare</option>
              <option>Fintech</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {startups.map((startup) => (
            <div
              key={startup.id}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {startup.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {startup.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Industry: {startup.industry}</span>
                    <span>Valuation: ${startup.valuation.toLocaleString()}</span>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {startup.industry}
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-300">Funding Progress</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      ${startup.raised.toLocaleString()} / ${startup.fundingGoal.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(startup.raised / startup.fundingGoal) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      {startup.investors} investors
                    </span>
                    <span className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {startup.daysLeft} days left
                    </span>
                  </div>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Invest Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Portfolio Summary */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Portfolio Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Invested</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">$125,000</div>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Value</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">$143,750</div>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Return</div>
                <div className="text-2xl font-bold text-green-600">+15%</div>
              </div>
            </div>
          </div>

          {/* Investment List */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Your Investments
            </h3>
            <div className="space-y-4">
              {investments.map((investment) => (
                <div
                  key={investment.id}
                  className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {investment.startup}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>Amount: ${investment.amount.toLocaleString()}</span>
                      <span>Date: {investment.date}</span>
                      <span>Type: {investment.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm font-medium ${
                      investment.return.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {investment.return}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      {investment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pitch-decks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pitchDecks.map((deck) => (
            <div
              key={deck.id}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {deck.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Startup: {deck.startup}</span>
                    <span>{deck.views} views</span>
                    <span>{deck.downloads} downloads</span>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {deck.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {deck.lastUpdated}
                </div>
                <Link
                  to={`/funding/${deck.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Deck
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post New Button */}
      <div className="fixed bottom-8 right-8">
        <button className="inline-flex items-center justify-center p-4 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg">
          <PlusIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Funding; 