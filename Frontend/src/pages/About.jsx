import {
  UserGroupIcon,
  RocketLaunchIcon,
  ChatBubbleLeftRightIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

const About = () => {
  const stats = [
    { label: 'Active Users', value: '10,000+' },
    { label: 'Projects Launched', value: '2,500+' },
    { label: 'Successful Fundings', value: '$5M+' },
    { label: 'Countries', value: '50+' },
  ];

  const values = [
    {
      title: 'Community First',
      description: 'We believe in the power of community and collaboration to drive innovation.',
      icon: UserGroupIcon,
    },
    {
      title: 'Innovation',
      description: 'We encourage and support groundbreaking ideas that can change the world.',
      icon: RocketLaunchIcon,
    },
    {
      title: 'Transparency',
      description: 'We maintain open and honest communication with our community.',
      icon: ChatBubbleLeftRightIcon,
    },
    {
      title: 'Security',
      description: 'We prioritize the security and privacy of our users and their data.',
      icon: ShieldCheckIcon,
    },
    {
      title: 'Accessibility',
      description: 'We make our platform accessible to everyone, regardless of location or background.',
      icon: GlobeAltIcon,
    },
    {
      title: 'Growth',
      description: 'We provide the resources and support needed for sustainable growth.',
      icon: BanknotesIcon,
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          About Co-OpFlow
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          We're building the future of collaboration and innovation. Our platform connects talented individuals,
          facilitates meaningful partnerships, and helps bring groundbreaking ideas to life.
        </p>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                  {stat.value}
                </p>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              To empower innovators and entrepreneurs by providing them with the tools, resources, and connections
              they need to turn their ideas into successful ventures.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-6 bg-white/10 backdrop-blur-md rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 bg-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Join Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're always looking for talented individuals who share our passion for innovation and community.
              Check out our open positions and join us in building the future.
            </p>
          </div>

          <div className="text-center">
            <a
              href="#careers"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Open Positions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 