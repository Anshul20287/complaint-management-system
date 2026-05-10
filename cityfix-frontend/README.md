# CityFix 🏙️

> Smart Urban Issue Tracker — Track. Report. Fix Your City.

A production-ready React + Vite + Tailwind CSS project. Every UI section is its own self-contained component with its own folder.

---

## 📁 Project Structure

```
cityfix/
├── public/
│   ├── favicon.svg
│   └── _redirects              # Netlify SPA support
├── src/
│   ├── components/
│   │   ├── Navbar/
│   │   │   └── index.jsx       # Sticky nav, scroll-spy, mobile menu
│   │   ├── Hero/
│   │   │   ├── index.jsx       # Hero section layout
│   │   │   ├── MapCard.jsx     # Floating live-map card
│   │   │   ├── MapPin.jsx      # Animated map pin
│   │   │   └── IssueRow.jsx    # Single issue row
│   │   ├── About/
│   │   │   ├── index.jsx       # About section layout
│   │   │   └── AboutCard.jsx   # Feature highlight card
│   │   ├── Features/
│   │   │   ├── index.jsx       # Features section layout
│   │   │   └── FeatureCard.jsx # Individual feature card
│   │   ├── HowItWorks/
│   │   │   ├── index.jsx       # Steps section layout
│   │   │   └── StepCard.jsx    # Numbered step card
│   │   ├── Contact/
│   │   │   ├── index.jsx       # Contact section layout
│   │   │   ├── ContactForm.jsx # Controlled form + validation
│   │   │   └── ContactInfoItem.jsx
│   │   └── Footer/
│   │       └── index.jsx       # Footer bar
│   ├── data/                   # Static data arrays (no logic)
│   │   ├── navLinks.js
│   │   ├── stats.js
│   │   ├── mapIssues.js
│   │   ├── aboutCards.js
│   │   ├── features.js
│   │   ├── steps.js
│   │   ├── contactInfo.js
│   │   └── footerLinks.js
│   ├── hooks/                  # Reusable custom React hooks
│   │   ├── useScrollSpy.js     # Active nav link tracking
│   │   ├── useScrollReveal.js  # IntersectionObserver fade-in
│   │   └── useNavbarScroll.js  # Navbar frosted-glass on scroll
│   ├── styles/
│   │   └── index.css           # Tailwind directives + global CSS
│   ├── App.jsx                 # Root component
│   └── main.jsx                # React DOM entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── .eslintrc.cjs
└── README.md
```

---

## ⚙️ Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Install
```bash
npm install
```

### Development
```bash
npm run dev
# → http://localhost:3000
```

### Production build
```bash
npm run build
```

### Preview build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

---

## 🚀 Deploy

### Vercel
Import the repo → Framework: **Vite** → Deploy. Zero config needed.

### Netlify
Build command: `npm run build` · Publish dir: `dist`
The `public/_redirects` file handles SPA routing automatically.

---

## 🎨 Tech Stack

| Tool | Role |
|------|------|
| React 18 | UI library |
| Vite 5 | Build tool & dev server |
| Tailwind CSS 3 | Utility-first styling |
| ESLint | Code quality |

---

© 2026 CityFix
