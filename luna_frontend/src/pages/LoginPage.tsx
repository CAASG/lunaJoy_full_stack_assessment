/**
 * @module LoginPage
 * @description Login page with Google OAuth button. Uses a calming,
 * welcoming design appropriate for a mental health application.
 * No useEffect - Google login uses the onSuccess callback directly.
 */

import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles successful Google OAuth response.
   * Sends the credential to our backend for verification and JWT issuance.
   */
  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    // Defensive: ensure Google returned a credential
    if (!credentialResponse.credential) {
      toast.error('Google sign-in did not return a valid credential. Please try again.');
      return;
    }

    try {
      await login(credentialResponse.credential);
      toast.success('Welcome! Great to see you.');
      navigate('/dashboard');
    } catch {
      toast.error('Sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-luna-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-luna-dark mb-2">
            LunaJoy
          </h1>
          <p className="text-luna-warm-gray text-lg">
            Your mental health companion
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-luna-cream-dark p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-medium text-luna-dark mb-2">
              Welcome
            </h2>
            <p className="text-luna-warm-gray text-sm">
              Track your wellbeing journey, one day at a time.
            </p>
          </div>

          <div className="flex justify-center">
            {isLoading ? (
              <div className="flex items-center gap-2 text-luna-warm-gray">
                <div className="w-5 h-5 border-2 border-luna-blue border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  toast.error('Google sign-in encountered an error. Please try again.');
                }}
                theme="outline"
                size="large"
                text="signin_with"
                shape="pill"
              />
            )}
          </div>

          <p className="text-center text-xs text-luna-warm-gray mt-6">
            Your data is private and secure. We never share your information.
          </p>
        </div>

        <p className="text-center text-sm text-luna-warm-gray mt-6">
          Every small step counts towards a healthier you.
        </p>
      </div>
    </div>
  );
}
