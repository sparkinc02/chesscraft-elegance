import { motion } from 'framer-motion';
import { Star, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import { toast } from 'sonner';

interface Props {
  product: Product;
  index: number;
  listView?: boolean;
}

export default function ShopProductCard({ product, index, listView }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useUIStore((s) => s.setCartOpen);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      category: product.category,
    });
    toast.success(`${product.name} added to cart`);
    setCartOpen(true);
  };

  if (listView) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        <Link
          to={`/product/${product.id}`}
          className="group flex gap-6 bg-background border border-border hover:shadow-lg transition-all p-4"
        >
          <div className="relative bg-secondary w-32 h-32 flex items-center justify-center shrink-0">
            <span className="text-5xl">{product.emoji}</span>
            {product.badge && (
              <span className={`absolute top-2 left-2 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 ${
                product.badge === 'BESTSELLER' ? 'bg-bordeaux text-cream' : 'bg-amber text-secondary'
              }`}>
                {product.badge}
              </span>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-between py-1">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{product.category}</p>
              <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors">{product.name}</h3>
              <p className="font-body text-sm text-muted-foreground mt-1">{product.description}</p>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-xl font-bold text-foreground">₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice && (
                  <span className="font-body text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                )}
              </div>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground font-mono text-xs uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <ShoppingBag size={14} />
                Add to Cart
              </button>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
    >
      <Link
        to={`/product/${product.id}`}
        className="group block bg-background border border-border hover:shadow-xl transition-shadow"
      >
        {/* Image area */}
        <div className="relative bg-secondary h-56 flex items-center justify-center overflow-hidden">
          <span className="text-7xl group-hover:scale-110 transition-transform duration-500">{product.emoji}</span>
          {product.badge && (
            <span className={`absolute top-3 left-3 font-mono text-[10px] uppercase tracking-wider px-3 py-1 ${
              product.badge === 'BESTSELLER' ? 'bg-bordeaux text-cream' : 'bg-amber text-secondary'
            }`}>
              {product.badge}
            </span>
          )}
        </div>

        <div className="p-5">
          {/* Stars */}
          <div className="flex items-center gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} className={i < product.stars ? 'fill-primary text-primary' : 'text-border'} />
            ))}
            <span className="font-mono text-[10px] text-muted-foreground ml-2">{product.rating}</span>
          </div>

          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{product.category}</p>
          <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-1">{product.name}</h3>
          <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">{product.description}</p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-xl font-bold text-foreground">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && (
                <span className="font-body text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
            <button
              onClick={handleAdd}
              className="p-2.5 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
