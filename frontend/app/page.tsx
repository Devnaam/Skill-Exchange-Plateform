import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">
                SkillExchange
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Learn, Teach, Connect
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join your hyperlocal community where skills are the currency and
            neighbors become mentors. Share what you know, learn what you need.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="bg-white text-indigo-600 hover:bg-gray-50 border-2 border-indigo-600 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <div className="text-indigo-600 text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Discover Local Talent</h3>
            <p className="text-gray-600">
              Find skilled neighbors ready to teach cooking, coding, gardening, and more.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <div className="text-indigo-600 text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-2">Exchange Skills</h3>
            <p className="text-gray-600">
              Trade skills without money. Teach guitar, learn photography.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
            <div className="text-indigo-600 text-4xl mb-4">🌟</div>
            <h3 className="text-xl font-bold mb-2">Build Community</h3>
            <p className="text-gray-600">
              Create meaningful connections with people in your neighborhood.
            </p>
          </div>
        </div>

        <div className="mt-20 bg-white rounded-lg shadow-lg p-12">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold mb-2">Create Profile</h4>
              <p className="text-sm text-gray-600">Sign up and list your skills</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold mb-2">Find Matches</h4>
              <p className="text-sm text-gray-600">Discover perfect skill exchanges</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold mb-2">Connect</h4>
              <p className="text-sm text-gray-600">Send requests and start chatting</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="font-semibold mb-2">Learn & Teach</h4>
              <p className="text-sm text-gray-600">Exchange knowledge locally</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            © 2025 SkillExchange. Building stronger communities through skill sharing.
          </p>
        </div>
      </footer>
    </div>
  );
}
