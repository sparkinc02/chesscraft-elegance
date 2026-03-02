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
