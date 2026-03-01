import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { categories } from '@/data/products';
import { useUIStore } from '@/stores/uiStore';

export default function CategoriesSection() {
  const setActiveFilter = useUIStore((s) => s.setActiveFilter);
  const navigate = useNavigate();

  const goToCategory = (cat: string) => {
    setActiveFilter(cat);
    navigate('/shop');
  };

  return (
    <section id="categories" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Browse</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">Our Collections</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.name}
              onClick={() => goToCategory(cat.name)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group relative bg-card border border-border p-8 text-left hover:shadow-lg transition-shadow"
            >
              <span className="text-5xl block mb-4">{cat.emoji}</span>
              <h3 className="font-heading text-xl font-bold text-card-foreground mb-1">{cat.name}</h3>
              <p className="font-mono text-xs text-muted-foreground">{cat.count} products</p>

              {/* Gold underline on hover */}
              <div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
