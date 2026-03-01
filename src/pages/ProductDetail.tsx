import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, ArrowLeft, Truck, Shield, RotateCcw } from 'lucide-react';
import { products } from '@/data/products';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ShopProductCard from '@/components/ShopProductCard';
import { useState } from 'react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const [qty, setQty] = useState(1);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="pt-32 text-center">
          <span className="text-6xl block mb-4">♟</span>
          <h1 className="font-heading text-2xl font-bold mb-2">Product not found</h1>
          <Link to="/shop" className="font-mono text-sm text-primary hover:underline">← Back to Shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        emoji: product.emoji,
        category: product.category,
      });
    }
    toast.success(`${product.name} (x${qty}) added to cart`);
    setCartOpen(true);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <CartSidebar />

      <section className="pt-24 pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 font-mono text-xs text-muted-foreground mb-8"
          >
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </motion.div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Back
          </button>
        </div>
      </section>

      {/* Product */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative bg-secondary aspect-square flex items-center justify-center"
            >
              <span className="text-[120px] md:text-[160px]">{product.emoji}</span>
              {product.badge && (
                <span className={`absolute top-4 left-4 font-mono text-xs uppercase tracking-wider px-4 py-1.5 ${
                  product.badge === 'BESTSELLER' ? 'bg-bordeaux text-cream' : 'bg-amber text-secondary'
                }`}>
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="absolute top-4 right-4 font-mono text-xs bg-primary text-primary-foreground px-3 py-1.5">
                  -{discount}%
                </span>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col"
            >
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3">{product.category}</p>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className={i < product.stars ? 'fill-primary text-primary' : 'text-border'} />
                  ))}
                </div>
                <span className="font-mono text-sm text-muted-foreground">{product.rating} / 5</span>
              </div>

              <p className="font-body text-lg leading-relaxed text-muted-foreground mb-8">{product.description}</p>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-8">
                <span className="font-heading text-3xl font-bold text-foreground">₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice && (
                  <span className="font-body text-lg text-muted-foreground line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                )}
              </div>

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-border">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-12 h-12 flex items-center justify-center font-mono text-lg hover:bg-muted transition-colors"
                  >
                    −
                  </button>
                  <span className="w-12 h-12 flex items-center justify-center font-mono text-sm border-x border-border">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-12 h-12 flex items-center justify-center font-mono text-lg hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  className="flex-1 flex items-center justify-center gap-3 py-3.5 bg-secondary text-secondary-foreground font-mono text-sm uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ShoppingBag size={18} />
                  Add to Cart — ₹{(product.price * qty).toLocaleString('en-IN')}
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 border-t border-border pt-8">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck size={20} className="text-primary" />
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Free shipping over ₹999</p>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Shield size={20} className="text-primary" />
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Secure Payment</p>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw size={20} className="text-primary" />
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">7-Day Returns</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-16 px-6 bg-card border-t border-border">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-2xl font-bold text-card-foreground mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <ShopProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
