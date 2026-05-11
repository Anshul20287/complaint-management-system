/**
 * Live map pins and issue list data for the Hero map card.
 */
export const mapPins = [
  { color: '#ef4444', top: '25%', left: '30%', label: 'Pothole – Andheri',      delay: '0s'    },
  { color: '#eab308', top: '55%', left: '60%', label: 'Streetlight – Bandra',   delay: '0.5s'  },
  { color: '#22c55e', top: '70%', left: '20%', label: 'Fixed – Dadar',           delay: '1s'    },
  { color: '#00f5d4', top: '35%', left: '72%', label: 'In Progress – Kurla',     delay: '1.5s'  },
];

export const issueList = [
  {
    color:  '#ef4444',
    name:   'Pothole on SV Road',
    loc:    'Andheri West · 2h ago',
    badge:  'Open',
    bg:     'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.2)',
  },
  {
    color:  '#eab308',
    name:   'Broken Streetlight',
    loc:    'Bandra East · 5h ago',
    badge:  'In Review',
    bg:     'rgba(234,179,8,0.1)',
    border: 'rgba(234,179,8,0.2)',
  },
  {
    color:  '#22c55e',
    name:   'Water Leakage Fixed',
    loc:    'Dadar · Yesterday',
    badge:  'Resolved',
    bg:     'rgba(34,197,94,0.1)',
    border: 'rgba(34,197,94,0.2)',
  },
];
