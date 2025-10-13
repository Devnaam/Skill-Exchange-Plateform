import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900">
            Exchange Skills,
            <span className="text-indigo-600"> Build Community</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with people in your area to teach and learn new skills. 
            Share knowledge, grow together, and build meaningful connections.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-lg"
            >
              Get Started
            </Link>
            <Link
              href="/feed"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg border-2 border-indigo-600"
            >
              Explore Feed
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Share Your Skills</h3>
              <p className="text-gray-600">
                Showcase what you know and help others learn
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-2">Find Perfect Matches</h3>
              <p className="text-gray-600">
                Connect with people who want to learn what you teach
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-2">Build Community</h3>
              <p className="text-gray-600">
                Join a vibrant community of learners and teachers
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
