import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Sun, Moon, User, ShieldCheck, LogOut, Settings, Package } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';

const navLinks = [
  { label: 'Collection', href: '/#categories' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/#about' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Policies', href: '/#policies' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const totalItems = useCartStore((s) => s.totalItems());
  const toggleCart = useUIStore((s) => s.toggleCart);
  const { isDark, toggle: toggleTheme } = useTheme();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">♛</span>
            <span className="font-heading text-xl font-bold tracking-wide text-foreground">ChessCraft</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.href.startsWith('/') && !link.href.includes('#') ? (
                <Link key={link.label} to={link.href} className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href} className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                </a>
              )
            )}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 text-muted-foreground hover:text-primary transition-colors" aria-label="Toggle theme">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button onClick={toggleCart} className="relative p-2 text-foreground hover:text-primary transition-colors" aria-label="Open cart">
              <ShoppingBag size={20} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-mono font-bold flex items-center justify-center">
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* User Avatar / Login */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-8 h-8 bg-primary text-primary-foreground font-mono text-xs font-bold flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  {user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-64 bg-card border border-border shadow-xl z-50"
                    >
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary text-primary-foreground font-mono text-sm font-bold flex items-center justify-center">
                            {user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-heading text-sm font-bold">{user.name}</p>
                            <p className="font-mono text-[10px] text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Admin link */}
                      {user.role === 'admin' && (
                        <button
                          onClick={() => { setDropdownOpen(false); navigate('/admin'); }}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-primary/5 transition-colors border-b border-border text-left"
                        >
                          <ShieldCheck size={16} className="text-primary" />
                          <div>
                            <p className="font-mono text-xs uppercase tracking-wider">Admin Dashboard</p>
                            <p className="font-mono text-[10px] text-muted-foreground">Manage products & orders</p>
                          </div>
                        </button>
                      )}

                      <button onClick={() => { setDropdownOpen(false); navigate('/profile'); }} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-primary/5 transition-colors text-left">
                        <User size={15} className="text-muted-foreground" />
                        <span className="font-mono text-xs">My Profile</span>
                      </button>

                      <button onClick={() => { setDropdownOpen(false); navigate('/profile/orders'); }} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-primary/5 transition-colors text-left">
                        <Package size={15} className="text-muted-foreground" />
                        <span className="font-mono text-xs">My Orders</span>
                      </button>

                      <button onClick={() => { setDropdownOpen(false); navigate('/profile/settings'); }} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-primary/5 transition-colors text-left">
                        <Settings size={15} className="text-muted-foreground" />
                        <span className="font-mono text-xs">Settings</span>
                      </button>

                      <div className="border-t border-border">
                        <button onClick={() => { logout(); setDropdownOpen(false); navigate('/'); }} className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-destructive/5 transition-colors text-left">
                          <LogOut size={15} className="text-destructive" />
                          <span className="font-mono text-xs text-destructive">Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
                <User size={16} />
              </Link>
            )}

            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 text-foreground" aria-label="Menu">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-background flex flex-col">
            <div className="flex items-center justify-between px-6 h-16">
              <span className="font-heading text-xl font-bold">♛ ChessCraft</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={24} /></button>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 gap-8">
              {navLinks.map((link, i) =>
                link.href.startsWith('/') && !link.href.includes('#') ? (
                  <motion.div key={link.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <Link to={link.href} onClick={() => setMobileOpen(false)} className="font-heading text-3xl font-bold text-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="font-heading text-3xl font-bold text-foreground hover:text-primary transition-colors">
                    {link.label}
                  </motion.a>
                )
              )}
              {!user && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="font-heading text-3xl font-bold text-primary">Login</Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
