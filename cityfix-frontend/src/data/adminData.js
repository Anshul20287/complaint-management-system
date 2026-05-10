export const stats = [
  { label: 'Total Issues', value: '1,284', sub: '↑ 48 this week',  color: 'text-[#e8eaed]' },
  { label: 'Resolved',     value: '946',   sub: '73.7% rate',      color: 'text-[#3ecf8e]' },
  { label: 'Pending',      value: '248',   sub: '↑ 12 new today',  color: 'text-[#f59e0b]' },
  { label: 'Escalated',    value: '90',    sub: 'Needs attention',  color: 'text-[#a78bfa]' },
];

export const recentIssues = [
  { id: '#4831', type: 'Pothole',     area: 'Andheri',  assigned: 'Ravi S.',   status: 'Open' },
  { id: '#4830', type: 'Drain',       area: 'Bandra',   assigned: 'Priya K.',  status: 'In Progress' },
  { id: '#4828', type: 'Garbage',     area: 'Kurla',    assigned: 'Unassigned',status: 'Escalated' },
  { id: '#4822', type: 'Streetlight', area: 'Dadar',    assigned: 'Arjun M.',  status: 'Resolved' },
  { id: '#4815', type: 'Water',       area: 'Malad',    assigned: 'Sneha T.',  status: 'In Progress' },
];

export const categories = [
  { label: 'Pothole',      pct: 72, color: 'bg-[#4f8ef7]' },
  { label: 'Garbage',      pct: 55, color: 'bg-[#3ecf8e]' },
  { label: 'Streetlight',  pct: 38, color: 'bg-[#fbbf24]' },
  { label: 'Drain',        pct: 29, color: 'bg-[#f87171]' },
  { label: 'Tree Fall',    pct: 18, color: 'bg-[#a78bfa]' },
  { label: 'Water',        pct: 12, color: 'bg-[#60a5fa]' },
];

export const staffList = [
  { name: 'Ravi S.',   zone: 'North',   open: 8,  resolved: 34 },
  { name: 'Priya K.',  zone: 'West',    open: 5,  resolved: 41 },
  { name: 'Arjun M.',  zone: 'Central', open: 12, resolved: 27 },
  { name: 'Sneha T.',  zone: 'East',    open: 3,  resolved: 55 },
];

export const alerts = [
  {
    type: 'warn',
    title: 'High volume in Andheri',
    message: '32 unresolved potholes, no staff assigned.',
  },
  {
    type: 'warn',
    title: 'SLA breach risk',
    message: '8 issues unresolved past 72 hours.',
  },
  {
    type: 'info',
    title: 'Weekly report ready',
    message: 'March 17–23 summary generated.',
  },
];