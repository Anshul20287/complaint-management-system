import footerLinks from '../../data/footerLinks';

/**
 * Footer — slim bar with logo, copyright, and links.
 */
export default function Footer() {
  return (
    <footer
      className="relative z-[1] px-6 md:px-12 py-7 flex items-center justify-between flex-wrap gap-3"
      style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="font-syne font-extrabold text-[1.1rem] text-[#e8edf8]">
        City<span className="text-accent">Fix</span>
      </div>

      <div className="text-[0.78rem] text-muted">
        © {new Date().getFullYear()} CityFix. All rights reserved.
      </div>

      <div className="flex gap-5">
        {footerLinks.map((link) => (
          <a
            key={link}
            href="#"
            className="text-[0.78rem] text-muted no-underline transition-colors hover:text-accent"
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}
