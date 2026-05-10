import { useState } from 'react';

const initialIssues = [
  { id: '#4821', type: 'Pothole',     location: 'Andheri', status: 'Open' },
  { id: '#4790', type: 'Streetlight', location: 'Bandra',  status: 'Resolved' },
  { id: '#4755', type: 'Garbage',     location: 'Kurla',   status: 'In Progress' },
];

export const useIssues = () => {
  const [issues, setIssues] = useState(initialIssues);

  const addIssue = (type, location) => {
    const newId = `#${Math.floor(Math.random() * 1000) + 5000}`;
    setIssues(prev => [{ id: newId, type, location, status: 'Open' }, ...prev]);
  };

  return { issues, addIssue };
};