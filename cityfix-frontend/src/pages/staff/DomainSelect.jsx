import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CATEGORY_INFO = [
  {
    value: 'Pothole/Road Damage',
    label: 'Pothole/Road Damage',
    icon: '🛣️',
    desc: 'Repair damaged roads, potholes, cracks, and surface irregularities.',
    color: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/30',
  },
  {
    value: 'Sanitation',
    label: 'Sanitation',
    icon: '🧹',
    desc: 'Clean streets, manage waste collection, and maintain public hygiene.',
    color: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
  },
  {
    value: 'Electricity',
    label: 'Electricity',
    icon: '⚡',
    desc: 'Fix street lights, electrical lines, and power supply issues.',
    color: 'from-yellow-500/20 to-amber-500/20',
    borderColor: 'border-yellow-500/30',
  },
  {
    value: 'Water Problems',
    label: 'Water Problems',
    icon: '💧',
    desc: 'Handle water supply issues, leaks, and drainage problems.',
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
  },
  {
    value: 'Environmental factors',
    label: 'Environmental factors',
    icon: '🌳',
    desc: 'Address pollution, tree maintenance, and environmental concerns.',
    color: 'from-green-500/20 to-teal-500/20',
    borderColor: 'border-green-500/30',
  },
  {
    value: 'Other',
    label: 'Other',
    icon: '📋',
    desc: 'Handle miscellaneous issues not covered by other categories.',
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
  },
];

export default function DomainSelect() {
  const navigate = useNavigate();
  const { user, selectDomain } = useAuth();
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get staff's assigned categories
  const assignedCategories = user?.assignedCategories || [];

  if (!user || user.role !== 'staff') {
    navigate('/login');
    return null;
  }

  if (assignedCategories.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#03060f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
        <div style={{ textAlign: 'center', color: '#e6f1ff' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '12px' }}>No domains assigned</p>
          <p style={{ color: '#7c8aa5', marginBottom: '24px' }}>Please contact your administrator to assign domains.</p>
          <button
            onClick={() => navigate('/staff')}
            style={{
              padding: '12px 24px', borderRadius: 12,
              background: '#00f5d4', color: '#03060f', border: 'none',
              fontWeight: 600, cursor: 'pointer'
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleSelectDomain = async (domain) => {
    setSelectedDomain(domain);
    setLoading(true);

    // Small delay to make the transition feel smooth
    setTimeout(() => {
      selectDomain(domain);
      navigate('/staff');
    }, 300);
  };

  const getAvailableCategories = () => {
    return CATEGORY_INFO.filter(cat => assignedCategories.includes(cat.value));
  };

  const availableCategories = getAvailableCategories();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#03060f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 16px',
      position: 'relative'
    }}>
      {/* Glow orbs */}
      <div style={{
        position: 'absolute', width: 500, height: 400, top: '-10%', right: '-10%',
        background: 'rgba(0,245,212,0.07)', filter: 'blur(90px)', borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 350, bottom: '-10%', left: '-5%',
        background: 'rgba(124,111,255,0.07)', filter: 'blur(80px)', borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,245,212,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,212,.03) 1px,transparent 1px)',
        backgroundSize: '50px 50px', pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1000 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2.2rem',
            color: '#e6f1ff', marginBottom: 12
          }}>
            Select Your Work Domain
          </h1>
          <p style={{ color: '#7c8aa5', fontSize: '1rem', marginBottom: 8 }}>
            Choose the category you want to focus on today
          </p>
          <p style={{ color: '#6b7a99', fontSize: '0.9rem' }}>
            You can switch domains anytime
          </p>
        </div>

        {/* Domain Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: availableCategories.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          marginBottom: 32
        }}>
          {availableCategories.map((category) => {
            const isSelected = selectedDomain === category.value;

            return (
              <button
                key={category.value}
                onClick={() => handleSelectDomain(category.value)}
                disabled={loading}
                style={{
                  all: 'unset',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  padding: 24,
                  borderRadius: 16,
                  border: `2px solid ${isSelected ? '#00f5d4' : 'rgba(0,245,212,0.2)'}`,
                  background: isSelected
                    ? 'rgba(0,245,212,0.15)'
                    : 'rgba(255,255,255,0.02)',
                  backdropFilter: 'blur(10px)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: loading && !isSelected ? 0.5 : 1,
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isSelected ? '0 8px 32px rgba(0,245,212,0.15)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected && !loading) {
                    e.currentTarget.style.borderColor = 'rgba(0,245,212,0.5)';
                    e.currentTarget.style.background = 'rgba(0,245,212,0.08)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected && !loading) {
                    e.currentTarget.style.borderColor = 'rgba(0,245,212,0.2)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {/* Icon */}
                <div style={{ fontSize: '3rem', textAlign: 'center' }}>
                  {category.icon}
                </div>

                {/* Title */}
                <h2 style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: isSelected ? '#00f5d4' : '#e6f1ff',
                  margin: 0
                }}>
                  {category.label}
                </h2>

                {/* Description */}
                <p style={{
                  fontSize: '0.9rem',
                  color: '#7c8aa5',
                  margin: 0,
                  lineHeight: 1.5
                }}>
                  {category.desc}
                </p>

                {/* Selected indicator */}
                {isSelected && (
                  <div style={{
                    marginTop: 8,
                    padding: '8px 16px',
                    background: 'rgba(0,245,212,0.2)',
                    borderRadius: 8,
                    color: '#00f5d4',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textAlign: 'center'
                  }}>
                    Selected ✓
                  </div>
                )}

                {/* Loading indicator */}
                {isSelected && loading && (
                  <div style={{
                    marginTop: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    color: '#00f5d4',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{
                      width: 12, height: 12, borderRadius: '50%',
                      border: '2px solid #00f5d4', borderTopColor: 'transparent',
                      animation: 'spin 0.7s linear infinite', display: 'inline-block'
                    }} />
                    Loading...
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Helper text */}
        <div style={{
          textAlign: 'center',
          padding: 16,
          background: 'rgba(0,245,212,0.08)',
          borderRadius: 12,
          border: '1px solid rgba(0,245,212,0.2)',
          color: '#7c8aa5',
          fontSize: '0.9rem'
        }}>
          💡 {availableCategories.length === 1
            ? 'You have one work domain assigned.'
            : `You have ${availableCategories.length} work domains assigned to you.`}
        </div>
      </div>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
