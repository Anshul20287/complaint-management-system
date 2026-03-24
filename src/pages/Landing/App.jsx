import Navbar from "../../components/Navbar";
import Hero        from '../../components/Hero';
import About       from '../../components/About';
import Features    from '../../components/Features';
import HowItWorks  from '../../components/HowItWorks';
import Contact     from '../../components/Contact';
import Footer      from '../../components/Footer';

/**
 * App — root component.
 * Composes all page sections in order.
 */
export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <HowItWorks />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
