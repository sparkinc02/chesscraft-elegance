import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
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
  const login = useAuthStore((s) => s.login);
  const [view, setView] = useState<View>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [shakeOtp, setShakeOtp] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const resetForm = useForm<ResetForm>();

  const onLogin = (data: LoginForm) => {
    setLoading(true);
    setTimeout(() => {
      const result = login(data.email, data.password);
      setLoading(false);
      if (result.success) {
        toast.success('Welcome back! ♛');
        navigate('/');
      } else {
        toast.error(result.error);
      }
    }, 500);
  };

  const handleForgotEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(`Reset code sent to ${resetEmail}`);
      setView('forgot-reset');
    }, 1000);
  };

  const handleResetPassword = (data: ResetForm) => {
    if (otp !== '123456') {
      setOtpError('Incorrect OTP. Try again.');
      setShakeOtp(true);
      setTimeout(() => setShakeOtp(false), 600);
      return;
    }
    if (data.newPassword !== data.confirmPassword) {
      resetForm.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    toast.success('Password reset successfully!');
    setView('login');
    setOtp('');
    setOtpError('');
    setResetEmail('');
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
