import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import ShopSection from '@/components/ShopSection';
import CartSidebar from '@/components/CartSidebar';
import CheckoutModal from '@/components/CheckoutModal';
import AboutSection from '@/components/AboutSection';
import ReviewsSection from '@/components/ReviewsSection';
import ContactSection from '@/components/ContactSection';
import PoliciesSection from '@/components/PoliciesSection';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <ShopSection />
      <AboutSection />
      <ReviewsSection />
      <ContactSection />
      <PoliciesSection />
      <Footer />
      <CartSidebar />
      <CheckoutModal />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
