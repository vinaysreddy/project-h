import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Facebook, ChevronLeft } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const LoginPage = ({ onLoginSuccess, onRedirectToSignup, onBackToLanding }) => {
  const { signInWithGoogle, signInWithFacebook, signInWithEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handlers remain the same...
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await signInWithGoogle();
      
      if (result.user) {
        onLoginSuccess();
      }
    } catch (err) {
      setError('Failed to sign in with Google: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFacebookSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await signInWithFacebook();
      
      if (result.user) {
        onLoginSuccess();
      }
    } catch (err) {
      setError('Failed to sign in with Facebook: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      const result = await signInWithEmail(email, password);
      if (result.user) {
        onLoginSuccess();
      }
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
      
      if (errorMessage.includes("No account exists")) {
        setTimeout(() => {
          const createAccountLink = document.getElementById('create-account-link');
          if (createAccountLink) {
            createAccountLink.classList.add('animate-pulse', 'font-semibold', 'text-[#3E7B27]');
          }
        }, 100);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Background circles for visual consistency with landing page */}
      <div className="absolute top-20 -right-12 w-64 h-64 bg-[#e72208]/10 rounded-full opacity-60"></div>
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-[#3E7B27]/10 rounded-full opacity-60"></div>
      <div className="absolute -bottom-20 left-1/4 w-56 h-56 bg-[#4D55CC]/10 rounded-full opacity-60"></div>
      
      <div className="w-full max-w-md z-10">

        {/* Back button */}
        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            aria-label="Back to landing page"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Back to home</span>
          </button>
        )}
        
        <Card className="shadow-xl border-gray-100">
          <CardHeader className="text-center pb-3">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500">Sign in to continue to your dashboard</p>
          </CardHeader>
          
          <CardContent className="pb-4">
            {error && (
              <Alert 
                variant={error.includes("No account exists") ? "default" : "destructive"} 
                className={`mb-6 ${error.includes("No account exists") ? "border-[#3E7B27]/20 bg-[#3E7B27]/5" : ""}`}
              >
                <AlertCircle className={`h-4 w-4 ${error.includes("No account exists") ? "text-[#3E7B27]" : ""}`} />
                <AlertTitle className="font-medium">
                  {error.includes("No account exists") ? "Account Not Found" : "Error"}
                </AlertTitle>
                <AlertDescription className="text-sm">
                  {error}
                  {error.includes("No account exists") && (
                    <Button 
                      onClick={onRedirectToSignup} 
                      variant="outline"
                      className="mt-3 w-full border-[#3E7B27]/30 text-[#3E7B27] hover:bg-[#3E7B27]/10 font-medium"
                    >
                      Get Started
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleEmailSubmit} className="mb-6 space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3E7B27]/30 focus:border-[#3E7B27] transition-all outline-none"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-xs text-[#3E7B27] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3E7B27]/30 focus:border-[#3E7B27] transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full py-2.5 bg-[#3E7B27] hover:bg-[#346A21] text-white font-medium rounded-lg transition-all"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handleGoogleSignIn} 
                disabled={loading} 
                variant="outline" 
                className="w-full border-gray-200 hover:bg-gray-50 transition-all"
              >
                {/* Inline SVG for Google logo to avoid external image dependency */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 48 48" 
                  className="h-5 w-5 mr-2"
                >
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                <span className="text-gray-700">Google</span>
              </Button>
              
              <Button 
                onClick={handleFacebookSignIn} 
                disabled={loading} 
                variant="outline" 
                className="w-full border-gray-200 hover:bg-gray-50 transition-all"
              >
                <Facebook className="h-5 w-5 mr-2 text-[#4267B2]" />
                <span className="text-gray-700">Facebook</span>
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center pt-2 pb-6">
            <div className="text-xs text-gray-500 text-center mb-3">
              By signing in, you agree to our Terms and Privacy Policy
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <button 
                id="create-account-link"
                type="button" 
                onClick={onRedirectToSignup}
                className="text-[#3E7B27] font-medium hover:underline"
              >
                Create an account
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;