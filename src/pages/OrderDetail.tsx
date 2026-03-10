import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Package, Truck, MapPin, CreditCard } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useOrdersStore } from '@/stores/ordersStore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useEffect } from 'react';

const statusBannerStyles: Record<string, string> = {
  Processing: 'bg-primary/10 border-b-2 border-primary',
  'In Transit': 'bg-[rgba(45,106,79,0.12)] border-b-2 border-[#2D6A4F]',
  Delivered: 'bg-[rgba(45,106,79,0.2)] border-b-2 border-[#2D6A4F]',
  Cancelled: 'bg-destructive/10 border-b-2 border-destructive',
};

const statusIcons: Record<string, React.ReactNode> = {
  Processing: <Package size={22} />,
  'In Transit': <Truck size={22} />,
  Delivered: <Check size={22} />,
  Cancelled: <span className="text-xl">✕</span>,
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const getOrder = useOrdersStore((s) => s.getOrder);

  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);

  const order = getOrder(id || '');

  if (!user) return null;

  if (!order) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="pt-32 text-center">
          <span className="text-5xl block mb-4">📦</span>
          <h1 className="font-heading text-2xl font-bold mb-2">Order not found</h1>
          <Link to="/profile/orders" className="font-mono text-sm text-primary hover:underline">← Back to Orders</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Status Banner */}
      <div className={`pt-20 ${statusBannerStyles[order.status] || ''}`}>
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-4">
          <span className="text-primary">{statusIcons[order.status]}</span>
          <div>
            <p className="font-heading text-xl font-bold">{order.status}</p>
            <p className="font-mono text-xs text-muted-foreground">{order.id} · {order.date}</p>
          </div>
        </div>
      </div>

      <section className="py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/profile/orders" className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Orders
          </Link>

          {/* Tracking Timeline */}
          <div className="mb-10">
            <h2 className="font-heading text-lg font-bold mb-5">Tracking</h2>
            <div className="flex items-start">
              {order.trackingSteps.map((step, i) => (
                <div key={i} className="flex-1 flex flex-col items-center text-center">
                  <div className={`w-8 h-8 flex items-center justify-center mb-2 ${step.done ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {step.done ? <Check size={14} /> : <span className="font-mono text-xs">{i + 1}</span>}
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-wider font-bold">{step.label}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">{step.date}</p>
                  {i < order.trackingSteps.length - 1 && (
                    <div className={`absolute h-px w-full ${step.done ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ordered Items */}
          <div className="mb-10">
            <h2 className="font-heading text-lg font-bold mb-5">Ordered Items</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border border-border bg-card">
                  <div className="w-20 h-20 bg-secondary flex items-center justify-center text-3xl shrink-0">{item.emoji}</div>
                  <div className="flex-1">
                    <p className="font-heading font-bold">{item.name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{item.category}</p>
                    <p className="font-mono text-xs text-muted-foreground mt-1">Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <span className="font-heading font-bold shrink-0">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Price Breakdown */}
            <div>
              <h2 className="font-heading text-lg font-bold mb-5">Price Breakdown</h2>
              <div className="border border-border bg-card p-5 space-y-3">
                <div className="flex justify-between font-mono text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-mono text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={order.shipping === 0 ? 'text-primary' : ''}>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
                </div>
                <div className="flex justify-between font-mono text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>₹{order.gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-heading text-xl font-bold">Grand Total</span>
                  <span className="font-heading text-xl font-bold text-primary">₹{order.grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div>
              <h2 className="font-heading text-lg font-bold mb-5">Delivery Details</h2>
              <div className="border border-border bg-card p-5 space-y-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-primary mb-1">Name</p>
                  <p className="font-body">{order.deliveryAddress.name}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-primary mb-1">Address</p>
                  <p className="font-body">{order.deliveryAddress.address1}, {order.deliveryAddress.address2}, {order.deliveryAddress.city}, {order.deliveryAddress.state} – {order.deliveryAddress.pin}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-primary mb-1">Phone</p>
                  <p className="font-body">{order.deliveryAddress.phone}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-primary mb-1">Payment Method</p>
                  <p className="font-body">{order.paymentMethod}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
