import { useState, useEffect } from 'react';

/**
 * useNavbarScroll
 * Returns true when the page has been scrolled past `threshold` px.
 * Used by the Navbar to apply a frosted-glass background on scroll.
 */
export function useNavbarScroll(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > threshold);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
