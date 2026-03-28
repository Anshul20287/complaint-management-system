export const staffUser = {
  initials: 'RS',
  name: 'Ravi S.',
  zone: 'North Zone',
};

export const stats = [
  { label: 'Assigned to Me', value: 14, color: 'text-[#e6f1ff]' },
  { label: 'Resolved This Week', value: 9, color: 'text-[#19e6d2]' },
  { label: 'Pending Issues', value: 5, color: 'text-[#fbbf24]' },
];

export const issueQueue = [
  { id: '#4831', type: 'Pothole',     location: 'Andheri W',  priority: 'High',   status: 'Open' },
  { id: '#4819', type: 'Drain',       location: 'Malad',      priority: 'High',   status: 'In Progress' },
  { id: '#4807', type: 'Garbage',     location: 'Goregaon',   priority: 'Medium', status: 'In Progress' },
  { id: '#4795', type: 'Streetlight', location: 'Borivali',   priority: 'Low',    status: 'Open' },
  { id: '#4788', type: 'Pothole',     location: 'Kandivali',  priority: 'Medium', status: 'Resolved' },
];

export const checklist = [
  { id: 1, task: 'Inspect #4788 pothole repair',  meta: 'Kandivali · 9:00 AM',  done: true },
  { id: 2, task: 'Photo update on #4807',          meta: 'Goregaon · 11:30 AM', done: true },
  { id: 3, task: 'Follow up on drain #4819',       meta: 'Malad · 2:00 PM',     done: false },
  { id: 4, task: 'Survey pothole cluster #4831',   meta: 'Andheri W · 4:30 PM', done: false },
];

export const zoneAreas = [
  { name: 'Andheri W',  status: 'open',       label: '4 open',        color: 'text-red-400',     dot: 'bg-red-400' },
  { name: 'Goregaon',   status: 'in-progress',label: '2 in progress', color: 'text-amber-300',   dot: 'bg-amber-300' },
  { name: 'Malad',      status: 'in-progress',label: '1 in progress', color: 'text-amber-300',   dot: 'bg-amber-300' },
  { name: 'Borivali',   status: 'open',        label: '1 open',        color: 'text-red-400',     dot: 'bg-red-400' },
  { name: 'Kandivali',  status: 'resolved',    label: 'All resolved',  color: 'text-emerald-400', dot: 'bg-emerald-400' },
];