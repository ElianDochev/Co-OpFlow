import { Link } from 'react-router-dom';
import {
  RocketLaunchIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

const Home = () => {
  const features = [
    {
      title: 'Find Your Team',
      description: 'Connect with talented developers, designers, and entrepreneurs to build your dream project.',
      icon: UserGroupIcon,
    },
    {
      title: 'Real-time Collaboration',
      description: 'Work together seamlessly with our integrated chat and project management tools.',
      icon: ChatBubbleLeftRightIcon,
    },
    {
      title: 'Launch Your Startup',
      description: 'Get your project off the ground with our comprehensive startup resources and funding options.',
      icon: RocketLaunchIcon,
    },
    {
      title: 'Secure Funding',
      description: 'Access our network of investors and crowdfunding opportunities to grow your business.',
      icon: BanknotesIcon,
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Build Your Next Big Thing
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Connect with talented developers, designers, and entrepreneurs. Collaborate, innovate, and bring your ideas to life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Get Started
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Everything You Need to Succeed
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Our platform provides all the tools and resources you need to build and grow your project.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative p-6 bg-white/10 backdrop-blur-md rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 dark:bg-indigo-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-indigo-200">Join our community today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 