'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export default function AuthPage() {
  const { signIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background overflow-hidden">
      {/* Left panel - Brand section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-button-primary to-button-secondary p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern-bg.png')] bg-repeat opacity-20"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white opacity-10"></div>
        </div>
        
        <div className="relative z-10">
          <div className="mb-12">
            <Image 
              src="/logo.png" 
              alt="Supernova LMS Logo" 
              width={180} 
              height={60}
              className="mb-6"
            />
            <h1 className="text-white text-4xl font-bold mb-4">Transform your learning experience</h1>
            <p className="text-white/80 text-xl">Your journey to excellence begins with Supernova LMS.</p>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Personalized Learning</h3>
                <p className="text-white/70">Tailored experiences for every student's unique needs</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Rapid Progress</h3>
                <p className="text-white/70">Advanced analytics to track and accelerate learning</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Flexible Learning</h3>
                <p className="text-white/70">Learn at your own pace, anywhere, anytime</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 mt-auto pt-12">
          <p className="text-white/70 text-sm">© 2023 Supernova LMS. All rights reserved.</p>
        </div>
      </div>
      
      {/* Right panel - Auth form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* <div className="md:hidden mb-10 flex justify-center">
            <Image 
              src="/logo.png" 
              alt="Supernova LMS Logo" 
              width={150} 
              height={50}
            />
          </div> */}
          
          <div className="text-center mb-10">
            <h2 className="heading-xl mb-2">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-text-secondary">
              {isLogin ? 'Sign in to continue your learning journey' : 'Join thousands of learners today'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-secondary-sm block font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-text-secondary" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 block w-full rounded-lg border border-border bg-background px-3 py-3 text-text-primary shadow-sm focus:border-button-primary focus:outline-none focus:ring-1 focus:ring-button-primary"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-secondary-sm block font-medium">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-text-secondary" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full rounded-lg border border-border bg-background px-3 py-3 text-text-primary shadow-sm focus:border-button-primary focus:outline-none focus:ring-1 focus:ring-button-primary"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-secondary-sm block font-medium">
                  Password
                </label>
                {isLogin && (
                  <Link href="/forgot-password" className="text-sm text-button-primary hover:text-button-primary/80">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-text-secondary" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 block w-full rounded-lg border border-border bg-background px-3 py-3 text-text-primary shadow-sm focus:border-button-primary focus:outline-none focus:ring-1 focus:ring-button-primary"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              variant="default"
              size="lg"
              disabled={isLoading}
              className="w-full py-6 text-md font-semibold"
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              <FiArrowRight className="ml-1" />
            </Button>

            <div className="relative flex items-center justify-center mt-8">
              <div className="border-t border-border w-full absolute"></div>
              <div className="bg-background px-4 relative z-10 text-sm text-text-secondary">or continue with</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center py-3 px-4 border border-border rounded-lg hover:bg-background-secondary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#4285F4"/>
                  <path d="M7.015,14.062l-1.759,1.319C6.146,16.91,8.021,18,10.222,18c2.342,0,4.236-1.273,5.211-3.333 l-1.744-1.204C13.022,14.813,11.592,15.67,10.222,15.67C8.851,15.67,7.721,14.949,7.015,14.062z" fill="#34A853"/>
                  <path d="M10.222,8.33c-0.834,0-1.596,0.32-2.175,0.845l-1.722-1.329C7.4,6.708,8.698,6,10.222,6 c1.946,0,3.661,0.729,4.987,1.917L13.486,9.46C12.466,8.726,11.386,8.33,10.222,8.33z" fill="#FBBC05"/>
                  <path d="M10.222,18c2.149,0,4.155-0.741,5.556-1.989l-2.116-1.715c-0.785,0.642-1.876,1.03-3.087,1.03 C8.221,15.325,6.523,13.88,6.019,12h-2.17C4.379,15.45,7.007,18,10.222,18z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center py-3 px-4 border border-border rounded-lg hover:bg-background-secondary transition-colors"
              >
                <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M13.397,20.997v-8.196h2.765l0.411-3.209h-3.176V7.548c0-0.926,0.258-1.56,1.587-1.56h1.684V3.127 C15.849,3.039,15.025,2.997,14.201,3c-2.444,0-4.122,1.492-4.122,4.231v2.355H7.332v3.209h2.753v8.202H13.397z" fill="#3b5998"/>
                </svg>
                Facebook
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-text-secondary">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-button-primary font-semibold ml-1"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </Button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-secondary-sm">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="text-link hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-link hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
