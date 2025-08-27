import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();

  useEffect(() => {
    document.title = '🔐 Login - SwiftPOS';
  }, []);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        toast.success('🎉 Welcome to SwiftPOS!');
      } else {
        toast.error('❌ Invalid credentials');
      }
    } catch (error) {
      toast.error('🚫 Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setUsername('admin');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Floating background elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500 opacity-10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Main Logo Card */}
          <div className="text-center mb-10">
            <div className="relative">
              <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-2xl border border-white border-opacity-20 backdrop-blur-xl">
                <div className="text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  ⚡ SwiftPOS
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-3"></div>
                <p className="text-gray-600 font-medium text-lg">Enterprise Point of Sale</p>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-20 -z-10 transform scale-110"></div>
            </div>
          </div>

          {/* Premium Login Card */}
          <div className="bg-white bg-opacity-95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white border-opacity-20 p-8 relative overflow-hidden">
            {/* Card decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
            
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Please sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="inline-flex items-center space-x-2">
                    <span className="text-blue-600">👤</span>
                    <span>Username</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 font-medium text-lg"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {username && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500">
                      ✓
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="inline-flex items-center space-x-2">
                    <span className="text-blue-600">🔐</span>
                    <span>Password</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200 font-medium text-lg"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {password && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500">
                      ✓
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 flex items-center justify-center space-x-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">🚀</span>
                    <span>Sign In to SwiftPOS</span>
                  </>
                )}
              </button>
            </form>

            {/* Premium Demo Section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
              <div className="text-center mb-4">
                <div className="inline-flex items-center space-x-2 text-gray-700 font-semibold mb-2">
                  <span className="text-xl">🎯</span>
                  <span>Demo Account Access</span>
                </div>
                <p className="text-sm text-gray-600">Use these credentials to explore SwiftPOS</p>
              </div>
              
              <div className="grid grid-cols-1 gap-3 mb-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Username:</span>
                  <code className="text-blue-600 font-mono bg-blue-50 px-3 py-1 rounded font-semibold">admin</code>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Password:</span>
                  <code className="text-blue-600 font-mono bg-blue-50 px-3 py-1 rounded font-semibold">admin123</code>
                </div>
              </div>
              
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>✨</span>
                <span>Quick Demo Login</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-white text-opacity-70 text-sm font-medium">
              © 2025 SwiftPOS • Enterprise Point of Sale Solution
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
