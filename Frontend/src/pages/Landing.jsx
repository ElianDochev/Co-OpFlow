import { Link, useNavigate } from 'react-router-dom';
import {
  RocketLaunchIcon,
  UserGroupIcon,
  SparklesIcon,
  ChartBarIcon,
  ArrowRightIcon,
  StarIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  MegaphoneIcon,
  CurrencyDollarIcon,
  CodeBracketIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import Footer from '../components/Footer';
import useAuthStore from '../store/authStore';

const Landing = () => {
  const features = [
    {
      icon: RocketLaunchIcon,
      title: 'Launch Projects',
      description: 'Turn your business ideas into reality with our collaborative platform.',
    },
    {
      icon: UserGroupIcon,
      title: 'Find Collaborators',
      description: 'Connect with talented professionals who share your vision.',
    },
    {
      icon: SparklesIcon,
      title: 'Innovate Together',
      description: 'Combine diverse skills and expertise to create something extraordinary.',
    },
    {
      icon: ChartBarIcon,
      title: 'Track Progress',
      description: 'Monitor your project\'s growth and success metrics.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Professionals' },
    { value: '5K+', label: 'Business Projects' },
    { value: '2K+', label: 'Successful Collaborations' },
    { value: '95%', label: 'User Satisfaction' },
  ];

  const professionTypes = [
    {
      icon: CodeBracketIcon,
      title: 'Developers',
      description: 'Frontend, Backend, Mobile, and Full-Stack developers',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: PaintBrushIcon,
      title: 'Designers',
      description: 'UI/UX, Graphic, Product, and Brand designers',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: MegaphoneIcon,
      title: 'Marketing & PR',
      description: 'Digital marketers, Content creators, and PR specialists',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: BriefcaseIcon,
      title: 'Business',
      description: 'Product managers, Business analysts, and Entrepreneurs',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Finance',
      description: 'Financial analysts, Accountants, and Investment advisors',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: GlobeAltIcon,
      title: 'And More',
      description: 'Sales, Operations, Legal, HR, and other professionals',
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  const navigate = useNavigate();
  const { isAuthenticated, hydrated } = useAuthStore();

  const handleCAButton = () => {
    if (!hydrated) return; // Wait for hydration
    if (isAuthenticated) {
      navigate('/discover');
    } else {
      navigate('/login');
    }
  };

  const handleBuyUsCoffee = () => {
    // Open the Stripe Checkout link in a new tab or same tab
    window.open('https://buy.stripe.com/3cIdRbgI11fTbEK5Zl8EM00', '_blank');
  };
  

  return (
    <div className="min-h-screen bg-transparent relative">
      <div className="relative overflow-hidden ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
  {/* Semi-transparent background layer */}
  <div className="absolute inset-0 bg-transparent  z-0" />

  {/* Content above the transparent background */}
  <div className="text-center relative z-10">
    <h1 className="font-space tracking-tighter text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 dark:text-white">
      <span className="block uppercase bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
        Find collaborators
      </span>
      <span className="block uppercase mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
        for your dream
      </span>
      <span className="block uppercase mt-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-indigo-600 dark:from-pink-400 dark:to-indigo-400">
        projects
      </span>
    </h1>
    <p className="mt-8 max-w-md mx-auto text-base text-gray-600 dark:text-gray-300 sm:text-lg md:mt-10 md:text-xl md:max-w-3xl font-space tracking-wide leading-relaxed">
      Connect developers, designers, marketers, business professionals, and more. Build the next big thing together.
    </p>
    <div className="mt-10 max-w-md mx-auto flex justify-center md:mt-12">
      <button
        onClick={handleCAButton}
        className="w-full sm:w-auto flex items-center justify-center px-10 py-4 border-2 border-transparent text-base font-space font-bold tracking-wider uppercase rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 hover:scale-105 md:py-5 md:text-lg md:px-16 shadow-lg hover:shadow-xl"
      >
        Get Started
      </button>
    </div>
  </div>

  {/* Background visual effects (already well structured) */}
  <div className="absolute inset-0 -z-10">
    <div className="absolute inset-0 bg-transparent" />
    <div className="absolute inset-0 bg-transparent" />
  </div>
</div>
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-transparent" />
          <div className="absolute inset-0 bg-transparent" />
        </div>
      </div>

      {/* Who Can Join Section */}
      <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              For every professional
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Whether you're a developer, designer, marketer, or business professional - there's a place for you here.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {professionTypes.map((profession) => (
              <div
                key={profession.title}
                className="relative group p-6 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-200/20 dark:border-gray-700/20 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${profession.color} mb-4`}>
                  <profession.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{profession.title}</h3>
                <p className="text-base text-gray-600 dark:text-gray-300">{profession.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Everything you need to succeed
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Powerful features to help you build, collaborate, and grow your business projects.
            </p>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative group p-6 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-200/20 dark:border-gray-700/20 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
                <feature.icon className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-base text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section
      <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{stat.value}</p>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Support Section */}
      <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Support our mission
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Help us keep the platform running and support the community of innovators.
            </p>
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleBuyUsCoffee}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <HeartIcon className="h-5 w-5 mr-2" />
                Buy us a coffee
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;