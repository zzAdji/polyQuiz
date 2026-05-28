import React from 'react';
import { Trophy, X } from 'lucide-react';

export default function Leaderboard({ onClose }) {
  const leaderboardData = [
    { rank: 1, name: 'Faker', score: 9800 },
    { rank: 2, name: 'S1mple', score: 8500 },
    { rank: 3, name: 'ZywOo', score: 8100 },
    { rank: 4, name: 'TenZ', score: 7200 },
    { rank: 5, name: 'Caps', score: 6900 },
  ];

  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div style={{
      background: 'var(--surface-color)',
      borderRadius: '24px',
      padding: '24px',
      border: '1px solid var(--border-color)',
      position: 'relative',
      width: '100%',
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
    }}>
      {onClose && (
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          <X size={24} />
        </button>
      )}

      <h2 style={{ 
        display: 'flex', alignItems: 'center', gap: '12px', 
        fontSize: '1.5rem', marginBottom: '24px', color: 'var(--text-primary)',
        justifyContent: 'center'
      }}>
        <Trophy size={28} color="#FFD700" /> 
        Classement Global
      </h2>
      
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {leaderboardData.map((player) => (
          <li key={player.rank} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            background: 'var(--bg-color)',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            fontWeight: 600
          }}>
            <span style={{ 
              fontSize: '1.2rem', 
              color: getRankColor(player.rank),
              width: '32px',
              fontWeight: 700
            }}>
              #{player.rank}
            </span>
            <span style={{ flex: 1, fontSize: '1.1rem' }}>{player.name}</span>
            <span style={{ color: 'var(--apple-blue)', fontWeight: 700 }}>{player.score.toLocaleString()} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
