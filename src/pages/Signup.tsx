import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OTPInput from '@/components/OTPInput';

interface SignupForm {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const signup = useAuthStore((s) => s.signup);
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignupForm | null>(null);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [shakeOtp, setShakeOtp] = useState(false);
  const [timer, setTimer] = useState(45);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<SignupForm>();

  useEffect(() => {
    if (step !== 'otp') return;
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  const onFormSubmit = (data: SignupForm) => {
    setFormData(data);
    setStep('otp');
    setTimer(45);
    toast.success(`OTP sent to ${data.email}`);
  };

  const handleVerify = useCallback(() => {
    if (otp.length !== 6) return;
    setLoading(true);
    setTimeout(() => {
      if (otp === '123456') {
        const result = signup(formData!.name, formData!.email, formData!.phone, formData!.password);
        setLoading(false);
        if (result.success) {
          toast.success(`Welcome to ChessCraft, ${formData!.name}! ♛`);
          navigate('/');
        } else {
          toast.error(result.error);
        }
      } else {
        setLoading(false);
        setOtpError('Incorrect OTP. Try again.');
        setShakeOtp(true);
        setTimeout(() => setShakeOtp(false), 600);
      }
    }, 800);
  }, [otp, formData, signup, navigate]);

  const handleResend = () => {
    setTimer(45);
    toast.success(`OTP resent to ${formData?.email}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-md mx-auto">
          {step === 'form' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="font-heading text-3xl font-bold mb-2">Create Account</h1>
              <p className="font-body text-muted-foreground mb-8">Join the ChessCraft community</p>

              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Full Name <span className="text-primary">*</span></label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-3.5 bg-card border border-border font-body text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                  {errors.name && <p className="font-mono text-[10px] text-destructive mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Email <span className="text-primary">*</span></label>
                  <input
                    {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } })}
                    type="email"
                    className="w-full px-4 py-3.5 bg-card border border-border font-body text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                  {errors.email && <p className="font-mono text-[10px] text-destructive mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Phone Number <span className="text-primary">*</span></label>
                  <div className="flex">
                    <span className="flex items-center px-3 bg-muted border border-r-0 border-border font-mono text-xs text-muted-foreground">+91</span>
                    <input
                      {...register('phone', { required: 'Phone is required', pattern: { value: /^\d{10}$/, message: 'Enter 10-digit number' } })}
                      type="tel"
                      maxLength={10}
                      placeholder="98765 43210"
                      className="w-full px-4 py-3.5 bg-card border border-border font-body text-foreground focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  {errors.phone && <p className="font-mono text-[10px] text-destructive mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Password <span className="text-primary">*</span></label>
                  <div className="relative">
                    <input
                      {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-4 py-3.5 bg-card border border-border font-body text-foreground focus:border-primary focus:outline-none transition-colors pr-12"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="font-mono text-[10px] text-destructive mt-1">{errors.password.message}</p>}
                </div>

                <button type="submit" className="w-full py-4 bg-secondary text-secondary-foreground font-mono text-xs uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors">
                  Create Account
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                  <div className="relative flex justify-center"><span className="bg-background px-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">or</span></div>
                </div>

                <button type="button" className="w-full py-3.5 border border-border bg-card font-mono text-xs uppercase tracking-wider text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-3">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign up with Google
                </button>
              </form>

              <p className="text-center font-body text-sm text-muted-foreground mt-8">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-mono text-xs uppercase">Sign In</Link>
              </p>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <span className="text-5xl block mb-4">♛</span>
              <h1 className="font-heading text-3xl font-bold mb-2">Verify Your Email</h1>
              <p className="font-body text-muted-foreground mb-8">
                Enter the 6-digit code sent to {formData?.email}
              </p>

              <div className="mb-6">
                <OTPInput value={otp} onChange={(v) => { setOtp(v); setOtpError(''); }} shake={shakeOtp} />
                {otpError && <p className="font-mono text-xs text-destructive mt-3">{otpError}</p>}
              </div>

              <div className="mb-6">
                {timer > 0 ? (
                  <p className="font-mono text-xs text-muted-foreground">
                    Resend OTP in 0:{timer.toString().padStart(2, '0')}
                  </p>
                ) : (
                  <button onClick={handleResend} className="font-mono text-xs text-primary hover:underline">
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                onClick={handleVerify}
                disabled={otp.length !== 6 || loading}
                className="w-full py-4 bg-secondary text-secondary-foreground font-mono text-xs uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>

              <button
                onClick={() => setStep('form')}
                className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary mt-6 mx-auto"
              >
                <ArrowLeft size={14} /> Change Email
              </button>
            </motion.div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
