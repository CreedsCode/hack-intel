import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-white mb-8">
            HackVision
            <span className="text-indigo-500">Analytics</span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Unlock real-time insights into your hackathon's blockchain activity. 
            Powered by Blockscout's battle-tested indexer infrastructure.
          </p>
          <div className="flex justify-center gap-6">
            <Link to="/demo" className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Try Demo
            </Link>
            <a href="#get-started" className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
              Get Started
            </a>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="text-indigo-500 text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Real-time Analytics</h3>
            <p className="text-gray-400">Track contract deployments, transactions, and developer activity as they happen.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="text-indigo-500 text-4xl mb-4">🔌</div>
            <h3 className="text-xl font-bold text-white mb-2">Easy Integration</h3>
            <p className="text-gray-400">Connect to any Blockscout instance - hosted or self-deployed - with just an API key.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="text-indigo-500 text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">DevRel Insights</h3>
            <p className="text-gray-400">Make data-driven decisions about your hackathon's success and developer engagement.</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="get-started" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Get Started in Minutes</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="text-2xl mb-4">1️⃣</div>
            <h3 className="text-lg font-semibold text-white mb-2">Clone & Docker</h3>
            <p className="text-gray-400">Clone the repo and run with docker-compose up</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="text-2xl mb-4">2️⃣</div>
            <h3 className="text-lg font-semibold text-white mb-2">Configure</h3>
            <p className="text-gray-400">Connect to your Blockscout instance</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="text-2xl mb-4">3️⃣</div>
            <h3 className="text-lg font-semibold text-white mb-2">Auto Import</h3>
            <p className="text-gray-400">Your data is automatically imported</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl">
            <div className="text-2xl mb-4">4️⃣</div>
            <h3 className="text-lg font-semibold text-white mb-2">Explore</h3>
            <p className="text-gray-400">Access your analytics dashboard</p>
          </div>
        </div>

        {/* Quick Start Code */}
        <div className="mt-12 bg-gray-900 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Start with Docker</h3>
          <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm">
            <p className="text-gray-300"># Clone the repository</p>
            <p className="text-indigo-400">git clone https://github.com/CreedsCode/hack-intel</p>
            <p className="text-gray-300 mt-2"># Copy environment file</p>
            <p className="text-indigo-400">cp .env.example .env</p>
            <p className="text-gray-300 mt-2"># Start all services</p>
            <p className="text-indigo-400">docker compose up -d</p>
            <p className="text-gray-300 mt-2"># Access the dashboard at http://localhost</p>
          </div>
        </div>
      </div>

      {/* Architecture Overview */}
      <div className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Modern Stack for Modern Analytics</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Analytics Engine</h3>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h4 className="text-lg font-medium text-indigo-400 mb-3">Cube.js Powers Our Analytics</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✦</span>
                  <span>Pre-aggregated queries for lightning-fast results</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✦</span>
                  <span>Real-time updates via WebSocket</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✦</span>
                  <span>Write analytics in JavaScript, execute as SQL</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✦</span>
                  <span>Multi-level caching for optimal performance</span>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Modern Frontend</h3>
            <div className="bg-gray-800 p-6 rounded-xl">
              <h4 className="text-lg font-medium text-indigo-400 mb-3">React + Vite + TypeScript</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✦</span>
                  <span>Real-time data visualization with Chart.js</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✦</span>
                  <span>Type-safe development with TypeScript</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✦</span>
                  <span>Lightning-fast HMR with Vite</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">✦</span>
                  <span>Responsive design with Tailwind CSS</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Guide */}
      <div className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Developer Guide</h2>
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Prerequisites</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Docker Engine 24.0.0+</li>
                <li>• Docker Compose v2.20.0+</li>
                <li>• Git</li>
                <li>• Node.js 18+ (for local development)</li>
              </ul>
              <h3 className="text-xl font-semibold text-white mt-8 mb-4">Local Development</h3>
              <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm">
                <p className="text-gray-300"># Install dependencies</p>
                <p className="text-indigo-400">cd frontend && pnpm install</p>
                <p className="text-gray-300 mt-2"># Start development server</p>
                <p className="text-indigo-400">pnpm dev</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Configuration</h3>
              <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm">
                <p className="text-gray-300"># Frontend Configuration</p>
                <p className="text-indigo-400">VITE_APP_TITLE=HackVision Analytics</p>
                <p className="text-indigo-400">VITE_CUBE_API_URL=http://localhost:4000</p>
                <p className="text-gray-300 mt-2"># Blockscout Configuration</p>
                <p className="text-indigo-400">BLOCKSCOUT_API_KEY=your-key</p>
                <p className="text-indigo-400">BLOCKSCOUT_API_URL=https://rootstock-testnet.blockscout.com/api/v2/transactions</p>
              </div>
              <div className="mt-4 bg-indigo-900/50 p-4 rounded-lg border border-indigo-500/30">
                <div className="flex items-start">
                  <span className="text-indigo-400 text-xl mr-2">💡</span>
                  <div>
                    <h4 className="text-indigo-400 font-medium">Pro Tip: Configure Admin API Key</h4>
                    <p className="text-gray-300 text-sm mt-1">
                      Running your own Blockscout instance? Configure an admin API key in your instance's 
                      settings for unlimited access without rate limits. Perfect for hackathon analytics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Flow Diagram */}
      <div className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">How It Works</h2>
        <div className="bg-gray-800 p-8 rounded-xl">
          <div className="flex justify-center items-center space-x-4 text-gray-300">
            <div className="bg-gray-700 p-4 rounded-lg">Blockscout API</div>
            <div className="text-2xl">→</div>
            <div className="bg-gray-700 p-4 rounded-lg">Import Service</div>
            <div className="text-2xl">→</div>
            <div className="bg-gray-700 p-4 rounded-lg">PostgreSQL</div>
            <div className="text-2xl">→</div>
            <div className="bg-gray-700 p-4 rounded-lg">Cube.js</div>
            <div className="text-2xl">→</div>
            <div className="bg-gray-700 p-4 rounded-lg">Frontend</div>
          </div>
        </div>
      </div>

      {/* Value Props */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">For Hackathon Organizers</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">✓</span>
                <span className="text-gray-300">Track real-time developer engagement</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">✓</span>
                <span className="text-gray-300">Identify most active projects and developers</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">✓</span>
                <span className="text-gray-300">Measure hackathon impact with data</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">For DevRel Teams</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">✓</span>
                <span className="text-gray-300">Understand developer behavior patterns</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">✓</span>
                <span className="text-gray-300">Optimize developer onboarding</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">✓</span>
                <span className="text-gray-300">Generate comprehensive activity reports</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-indigo-900 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to supercharge your hackathon?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the growing list of organizations using HackVision Analytics to drive developer success.
          </p>
          <div className="flex justify-center gap-6">
            <Link to="/demo" className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              Try Demo
            </Link>
            <a href="https://github.com/CreedsCode/hack-intel" className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}; 