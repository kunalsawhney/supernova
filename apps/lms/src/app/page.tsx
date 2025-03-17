'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Icons
import { FiMail, FiLock, FiUser, FiAlertCircle, FiCheck } from 'react-icons/fi';

export default function AuthPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mounted, setMounted] = useState(false);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setFormSubmitted(true);

    try {
      await signIn(email, password);
      // Router push is handled in the signIn function
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock registration function
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setFormSubmitted(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setAuthMode('login');
      // Reset the form
      setName('');
      setEmail('');
      setPassword('');
      setFormSubmitted(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background overflow-hidden">
      {/* Left panel - Brand & Features */}
      <motion.div 
        className="relative hidden md:flex flex-col md:w-1/2 bg-gradient-to-br from-primary/90 to-primary-foreground/80 p-12"
        initial={mounted ? { opacity: 0, x: -50 } : false}
        animate={mounted ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl"></div>
          <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 blur-3xl"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wOCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgNnYtNmgtNnY2aDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Brand */}
          <div className="mb-12">
            <div className="inline-flex items-center space-x-2 mb-8">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-lg shadow-lg"></div>
                <div className="absolute inset-0.5 bg-black/80 rounded-lg flex items-center justify-center">
                  <span className="text-base font-bold text-white">SN</span>
                </div>
              </div>
              <span className="text-white text-2xl font-bold">SuperNova</span>
            </div>
            
            <h1 className="text-white text-4xl font-bold mb-6 leading-tight">
              Elevate Your Learning <br />Experience
            </h1>
            <p className="text-white/90 text-xl max-w-md">
              Join our innovative learning platform where knowledge meets technology.
            </p>
          </div>
          
          {/* Features */}
          <div className="space-y-8 my-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="flex items-start space-x-4"
                initial={mounted ? { opacity: 0, y: 20 } : false}
                animate={mounted ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + (index * 0.1) }}
              >
                <div className="bg-white/20 p-2 rounded-full">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-white text-lg font-semibold">{feature.title}</h3>
                  <p className="text-white/80">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Testimonial */}
          <motion.div 
            className="mt-auto pt-8 border-t border-white/10"
            initial={mounted ? { opacity: 0 } : false}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <blockquote className="relative">
              <div className="text-white/90 text-lg italic mb-4">
                "SuperNova has transformed how our institution delivers education. The platform is intuitive and the analytics are game-changing."
              </div>
              <footer className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-medium">JD</span>
                </div>
                <div>
                  <div className="text-white font-medium">Dr. Jane Doe</div>
                  <div className="text-white/70 text-sm">Education Director, Tech University</div>
                </div>
              </footer>
            </blockquote>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Right panel - Auth form */}
      <motion.div 
        className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12"
        initial={mounted ? { opacity: 0, x: 50 } : false}
        animate={mounted ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="md:hidden flex items-center justify-center mb-10">
            <div className="inline-flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-lg shadow-sm"></div>
                <div className="absolute inset-0.5 bg-background rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">SN</span>
                </div>
              </div>
              <span className="text-xl font-bold">SuperNova</span>
            </div>
          </div>
          
          {/* Auth tabs and form cards */}
          <Tabs defaultValue={authMode} onValueChange={(v) => setAuthMode(v as 'login' | 'register')} className="w-full">
            <div className="space-y-6">
              {/* Page heading */}
              <div className="text-center mb-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {authMode === 'login' 
                    ? 'Sign in to continue to your dashboard' 
                    : 'Fill out the form to get started'}
                </p>
              </div>
              
              {/* Tab switcher */}
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              {/* Error message */}
              {error && (
                <motion.div 
                  className="flex items-center p-4 rounded-lg bg-destructive/10 text-destructive text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FiAlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
              
              {/* Login form */}
              <TabsContent value="login">
                <Card>
                  <form onSubmit={handleSignIn}>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                            <FiMail className="w-4 h-4" />
                          </div>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className={cn(
                              "pl-10",
                              formSubmitted && !email && "border-destructive focus-visible:ring-destructive"
                            )}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-sm font-medium">
                            Password
                          </Label>
                          <Link
                            href="/forgot-password"
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                            <FiLock className="w-4 h-4" />
                          </div>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className={cn(
                              "pl-10",
                              formSubmitted && !password && "border-destructive focus-visible:ring-destructive"
                            )}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex flex-col">
                      <Button
                        type="submit"
                        className="w-full h-11 text-base font-medium"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Signing in...
                          </>
                        ) : (
                          'Sign in'
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              {/* Register form */}
              <TabsContent value="register">
                <Card>
                  <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4 pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Full Name
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                            <FiUser className="w-4 h-4" />
                          </div>
                          <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            className={cn(
                              "pl-10",
                              formSubmitted && !name && "border-destructive focus-visible:ring-destructive"
                            )}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="register-email" className="text-sm font-medium">
                          Email
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                            <FiMail className="w-4 h-4" />
                          </div>
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="you@example.com"
                            className={cn(
                              "pl-10",
                              formSubmitted && !email && "border-destructive focus-visible:ring-destructive"
                            )}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="register-password" className="text-sm font-medium">
                          Password
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                            <FiLock className="w-4 h-4" />
                          </div>
                          <Input
                            id="register-password"
                            type="password"
                            placeholder="••••••••"
                            className={cn(
                              "pl-10",
                              formSubmitted && !password && "border-destructive focus-visible:ring-destructive"
                            )}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Password must be at least 8 characters long
                        </p>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex flex-col">
                      <Button
                        type="submit"
                        className="w-full h-11 text-base font-medium"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating account...
                          </>
                        ) : (
                          'Create account'
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              {/* Social login */}
              <div className="relative flex items-center justify-center my-6">
                <div className="border-t border-border w-full absolute"></div>
                <div className="bg-background px-4 relative z-10 text-sm text-muted-foreground">or continue with</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" className="h-11">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" type="button" className="h-11">
                  <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.548c0-0.926,0.258-1.56,1.587-1.56h1.684V3.127 C15.849,3.039,15.025,2.997,14.201,3c-2.444,0-4.122,1.492-4.122,4.231v2.355H7.332v3.209h2.753v8.202H13.397z" fill="#3b5998"/>
                  </svg>
                  Facebook
                </Button>
              </div>
              
              {/* Additional sign up/in link for mobile */}
              <div className="text-center text-sm mt-6 md:hidden">
                {authMode === 'login' ? (
                  <p className="text-muted-foreground">
                    Don't have an account?{' '}
                    <Button variant="link" className="p-0 h-auto" onClick={() => setAuthMode('register')}>
                      Sign up
                    </Button>
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    Already have an account?{' '}
                    <Button variant="link" className="p-0 h-auto" onClick={() => setAuthMode('login')}>
                      Sign in
                    </Button>
                  </p>
                )}
              </div>
            </div>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}

// Sample features data
const features = [
  {
    title: "Personalized Learning",
    description: "Adaptive content tailored to each student's progress and needs",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Interactive Content",
    description: "Engage with rich multimedia and interactive learning materials",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Real-time Analytics",
    description: "Track your progress with detailed performance metrics and insights",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];
