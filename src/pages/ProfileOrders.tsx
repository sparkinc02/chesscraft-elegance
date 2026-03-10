import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useOrdersStore } from '@/stores/ordersStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect } from 'react';

const statusColors: Record<string, string> = {
  Processing: 'bg-primary/20 text-primary',
  'In Transit': 'bg-green-900/30 text-green-400',
  Delivered: 'bg-green-900/40 text-green-300',
  Cancelled: 'bg-destructive/20 text-destructive',
};

export default function ProfileOrders() {
  const { user } = useAuth();
  const orders = useOrdersStore((s) => s.orders);
  const navigate = useNavigate();

  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/profile" className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Profile
          </Link>

          <h1 className="font-heading text-3xl font-bold mb-8">My Orders</h1>

          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link to={`/profile/orders/${order.id}`} className="group flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 gap-3 sm:gap-4 border border-border bg-card hover:border-primary transition-colors">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="flex -space-x-2 shrink-0">
                      {order.items.slice(0, 3).map((item, j) => (
                        <div key={j} className="w-9 h-9 sm:w-10 sm:h-10 bg-secondary flex items-center justify-center text-base sm:text-lg border border-border">{item.emoji}</div>
                      ))}
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-bold text-sm truncate">{order.id}</p>
                      <p className="font-mono text-[10px] text-muted-foreground truncate">{order.date} · {order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-12 sm:pl-0">
                    <span className={`font-mono text-[10px] uppercase tracking-wider px-2 sm:px-3 py-1 whitespace-nowrap ${statusColors[order.status] || ''}`}>{order.status}</span>
                    <span className="font-heading font-bold whitespace-nowrap">₹{order.grandTotal.toLocaleString('en-IN')}</span>
                    <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
