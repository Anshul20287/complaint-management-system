import { useState, useEffect } from 'react';

/**
 * useScrollSpy
 * Returns the id of the section currently in the viewport.
 * @param {string[]} sectionIds - ordered list of section ids to watch
 * @param {number}   offset     - px offset from top (accounts for fixed navbar)
 */
export function useScrollSpy(sectionIds, offset = 100) {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY + offset;
      for (const id of [...sectionIds].reverse()) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          setActiveId(id);
          return;
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [sectionIds, offset]);

  return activeId;
}
