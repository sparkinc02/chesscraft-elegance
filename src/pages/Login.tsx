import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useLoginUser, useForgotPassword, useResetPassword } from '@/features/auth/authService';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OTPInput from '@/components/OTPInput';

type View = 'login' | 'forgot-email' | 'forgot-reset';

interface LoginForm {
  email: string;
  password: string;
}

interface ResetForm {
  newPassword: string;
  confirmPassword: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();
  const loginMutation = useLoginUser();
  const forgotMutation = useForgotPassword();
  const resetMutation = useResetPassword();
  const [view, setView] = useState<View>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [shakeOtp, setShakeOtp] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const resetForm = useForm<ResetForm>();

  const loading = loginMutation.isPending || forgotMutation.isPending || resetMutation.isPending;

  const onLogin = async (data: LoginForm) => {
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        setAuthData(res.data.user, res.data.accessToken);
        toast.success('Welcome back! ♛');
        navigate('/');
      },
      onError: (err) => {
        toast.error(err.message || 'Login failed');
      },
    });
  };

  const handleGoogleLogin = async () => {
    toast.info('Google Sign-In will be connected to your backend.');
  };

  const handleForgotEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    forgotMutation.mutate({ email: resetEmail }, {
      onSuccess: () => {
        toast.success(`Reset code sent to ${resetEmail}`);
        setView('forgot-reset');
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to send reset code');
      },
    });
  };

  const handleResetPassword = async (data: ResetForm) => {
    if (data.newPassword !== data.confirmPassword) {
      resetForm.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    resetMutation.mutate({ token: otp, newPassword: data.newPassword }, {
      onSuccess: () => {
        toast.success('Password reset successfully!');
        setView('login');
        setOtp('');
        setOtpError('');
        setResetEmail('');
      },
      onError: (err) => {
        setOtpError(err.message || 'Incorrect OTP. Try again.');
        setShakeOtp(true);
        setTimeout(() => setShakeOtp(false), 600);
      },
    });
  };

  const getPasswordStrength = (pw: string) => {
    if (!pw) return { width: '0%', color: 'bg-border', label: '' };
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    const levels = [
      { width: '25%', color: 'bg-destructive', label: 'Weak' },
      { width: '50%', color: 'bg-amber', label: 'Fair' },
      { width: '75%', color: 'bg-primary', label: 'Good' },
      { width: '100%', color: 'bg-green-600', label: 'Strong' },
    ];
    return levels[Math.min(score, 3)];
  };

  const newPw = resetForm.watch('newPassword') || '';
  const strength = getPasswordStrength(newPw);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-md mx-auto">
          {view === 'login' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-heading text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="font-body text-muted-foreground mb-8">Sign in to your ChessCraft account</p>

              <form onSubmit={handleSubmit(onLogin)} className="space-y-5">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Email</label>
                  <input
                    {...register('email', { required: 'Email is required' })}
                    type="email"
                    className="w-full px-4 py-3.5 bg-card border border-border font-body text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                  {errors.email && <p className="font-mono text-[10px] text-destructive mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Password</label>
                  <div className="relative">
                    <input
                      {...register('password', { required: 'Password is required' })}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-4 py-3.5 bg-card border border-border font-body text-foreground focus:border-primary focus:outline-none transition-colors pr-12"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="font-mono text-[10px] text-destructive mt-1">{errors.password.message}</p>}
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={() => setView('forgot-email')} className="font-mono text-xs text-primary hover:underline">
                    Forgot Password?
                  </button>
                </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-secondary text-secondary-foreground font-mono text-xs uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50">
                  {loading ? 'Signing in...' : 'Sign In ♛'}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                  <div className="relative flex justify-center"><span className="bg-background px-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">or</span></div>
                </div>

                <button type="button" onClick={handleGoogleLogin} className="w-full py-3.5 border border-border bg-card font-mono text-xs uppercase tracking-wider text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-3">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign in with Google
                </button>
              </form>

              <p className="text-center font-body text-sm text-muted-foreground mt-8">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-mono text-xs uppercase">Sign Up</Link>
              </p>
            </motion.div>
          )}

          {view === 'forgot-email' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-heading text-3xl font-bold mb-2">Reset Password</h1>
              <p className="font-body text-muted-foreground mb-8">Enter your registered email address.</p>

              <form onSubmit={handleForgotEmail} className="space-y-5">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Email</label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 bg-card border border-border font-body text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <button type="submit" disabled={loading} className="w-full py-4 bg-secondary text-secondary-foreground font-mono text-xs uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </button>
              </form>

              <button onClick={() => setView('login')} className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary mt-6">
                <ArrowLeft size={14} /> Back to Login
              </button>
            </motion.div>
          )}

          {view === 'forgot-reset' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-heading text-3xl font-bold mb-2">Set New Password</h1>
              <p className="font-body text-muted-foreground mb-8">Enter the 6-digit code sent to {resetEmail}</p>

              <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-5">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3 block">Reset Code</label>
                  <OTPInput value={otp} onChange={(v) => { setOtp(v); setOtpError(''); }} shake={shakeOtp} />
                  {otpError && <p className="font-mono text-xs text-destructive mt-2">{otpError}</p>}
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2 block">New Password</label>
                  <input
                    {...resetForm.register('newPassword', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                    type="password"
                    className="w-full px-4 py-3.5 bg-card border border-border font-body text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                  {newPw && (
                    <div className="mt-2">
                      <div className="h-1 bg-border overflow-hidden">
                        <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }} />
                      </div>
                      <p className="font-mono text-[10px] text-muted-foreground mt-1">{strength.label}</p>
                    </div>
                  )}
                  {resetForm.formState.errors.newPassword && <p className="font-mono text-[10px] text-destructive mt-1">{resetForm.formState.errors.newPassword.message}</p>}
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Confirm Password</label>
                  <input
                    {...resetForm.register('confirmPassword', { required: 'Confirm your password' })}
                    type="password"
                    className="w-full px-4 py-3.5 bg-card border border-border font-body text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                  {resetForm.formState.errors.confirmPassword && <p className="font-mono text-[10px] text-destructive mt-1">{resetForm.formState.errors.confirmPassword.message}</p>}
                </div>

                <button type="submit" className="w-full py-4 bg-secondary text-secondary-foreground font-mono text-xs uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors">
                  Reset Password
                </button>
              </form>

              <button onClick={() => { setView('forgot-email'); setOtp(''); setOtpError(''); }} className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary mt-6">
                <ArrowLeft size={14} /> Back to Login
              </button>
            </motion.div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
