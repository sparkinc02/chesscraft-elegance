import { motion } from 'framer-motion';

const policies = [
  {
    title: 'Payment Policy',
    emoji: '💳',
    items: [
      'Accepted: UPI, Credit/Debit Cards, Net Banking, EMI, COD',
      'COD available on orders above ₹500',
      'All transactions secured via Razorpay (PCI DSS compliant)',
      'EMI available on orders above ₹3,000 (0% on select cards)',
      'GST invoice provided for all orders',
    ],
  },
  {
    title: 'Refund Policy',
    emoji: '💰',
    items: [
      'Full refund within 7 days if item is damaged or incorrect',
      'Refund processed in 5–7 business days to original method',
      'UPI/Card refunds: 3–5 days | Bank transfer: 5–7 days',
      'COD orders refunded via bank transfer',
      'No refund on opened books or downloadable content',
    ],
  },
  {
    title: 'Return Policy',
    emoji: '🔄',
    items: [
      'Easy 7-day returns from date of delivery',
      'Item must be unused, in original packaging',
      'Initiate via WhatsApp or email with order ID + photos',
      'Free pickup for defective/wrong items',
      'Change-of-mind: customer pays return shipping',
      'Replacement dispatched within 2 business days',
    ],
  },
];

export default function PoliciesSection() {
  return (
    <section id="policies" className="py-24 px-6 bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-3">Trust</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold">Our Policies</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {policies.map((policy, i) => (
            <motion.div
              key={policy.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border border-primary/20 p-8"
            >
              <span className="text-3xl block mb-4">{policy.emoji}</span>
              <h3 className="font-heading text-xl font-bold mb-4">{policy.title}</h3>
              <ul className="space-y-3">
                {policy.items.map((item, j) => (
                  <li key={j} className="font-body text-sm text-secondary-foreground/70 leading-relaxed flex gap-2">
                    <span className="text-primary mt-0.5 shrink-0">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
