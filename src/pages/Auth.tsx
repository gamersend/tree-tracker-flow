import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { SydneyGreenLogo } from '@/components/theme/SydneyGreenTheme';

const Auth = () => {
  const { signIn, signUp, loading } = useAuth();
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signInData.email || !signInData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    const success = await signIn(signInData.email, signInData.password);
    if (success) {
      toast.success('Welcome back!');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (signUpData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const success = await signUp(signUpData.email, signUpData.password, {
      first_name: signUpData.firstName,
      last_name: signUpData.lastName
    });
    
    if (success) {
      toast.success('Account created successfully!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sydney-bg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 opacity-20">
          <img src="/lovable-uploads/899d8c38-987c-47fe-8aca-ed6ffc4f4715.png" alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute bottom-10 right-10 w-24 h-24 opacity-20">
          <img src="/lovable-uploads/47e1dabd-47dd-4d8b-9470-152f88762ef2.png" alt="" className="w-full h-full object-contain" />
        </div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 opacity-10">
          <img src="/lovable-uploads/3322d569-4ef8-49df-81d0-4b9b1982a3ba.png" alt="" className="w-full h-full object-contain" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-sydney-green/30 bg-gradient-to-br from-sydney-dark/95 to-sydney-purple/95 backdrop-blur-sm shadow-2xl shadow-sydney-green/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <SydneyGreenLogo />
            </div>
            <CardTitle className="text-2xl text-sydney-green sydney-glow">Welcome to Sydney Green</CardTitle>
            <CardDescription className="text-slate-300">Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-sydney-dark/50 border border-sydney-green/30">
                <TabsTrigger value="signin" className="data-[state=active]:bg-sydney-green data-[state=active]:text-black">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-sydney-green data-[state=active]:text-black">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-sydney-green">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                      className="bg-sydney-dark/50 border-sydney-green/30 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-sydney-green">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                      className="bg-sydney-dark/50 border-sydney-green/30 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-sydney-green hover:bg-sydney-green/90 text-black font-semibold shadow-lg shadow-sydney-green/30"
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-firstname" className="text-sydney-green">First Name</Label>
                      <Input
                        id="signup-firstname"
                        placeholder="First name"
                        value={signUpData.firstName}
                        onChange={(e) => setSignUpData({...signUpData, firstName: e.target.value})}
                        className="bg-sydney-dark/50 border-sydney-green/30 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-lastname" className="text-sydney-green">Last Name</Label>
                      <Input
                        id="signup-lastname"
                        placeholder="Last name"
                        value={signUpData.lastName}
                        onChange={(e) => setSignUpData({...signUpData, lastName: e.target.value})}
                        className="bg-sydney-dark/50 border-sydney-green/30 text-white placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sydney-green">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                      className="bg-sydney-dark/50 border-sydney-green/30 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sydney-green">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Enter your password (min 6 chars)"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                      className="bg-sydney-dark/50 border-sydney-green/30 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="text-sydney-green">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="Confirm your password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                      className="bg-sydney-dark/50 border-sydney-green/30 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-sydney-green hover:bg-sydney-green/90 text-black font-semibold shadow-lg shadow-sydney-green/30"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
