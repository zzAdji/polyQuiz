import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, Check, X } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Quiz() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isAnswered, setIsAnswered] = useState(false);

  // Mock Question
  const question = {
    id: 1,
    category: 'Manga/Anime',
    text: "Dans L'Attaque des Titans, quel est le véritable nom du Titan Cuirassé ?",
    options: ['Bertolt Hoover', 'Reiner Braun', 'Zeke Yeager', 'Annie Leonhart'],
    correct: 1
  };

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timerId = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0) {
      handleNext();
    }
  }, [timeLeft, isAnswered]);

  const handleSelect = (index) => {
    if (!isAnswered) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOption !== null && !isAnswered) {
      setIsAnswered(true);
    } else if (isAnswered) {
      handleNext();
    }
  };

  const handleNext = () => {
    navigate('/resultats');
  };

  const getOptionStatus = (index) => {
    if (!isAnswered) {
      return 'default';
    }
    if (index === question.correct) {
      return 'correct';
    }
    if (selectedOption === index && index !== question.correct) {
      return 'wrong';
    }
    return 'default';
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Header with Progress & Timer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1 }}>
          <div className="progress-container" style={{ marginBottom: 0 }}>
            <div className="progress-fill" style={{ width: '20%' }}></div>
          </div>
        </div>
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', 
          color: timeLeft <= 10 ? 'var(--apple-red)' : 'var(--apple-green)',
          fontWeight: 700, fontSize: '1.2rem' 
        }}>
          <Timer size={24} />
          <span>0:{timeLeft.toString().padStart(2, '0')}</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Category Badge */}
        <div style={{ 
          alignSelf: 'flex-start', background: 'var(--apple-purple)', padding: '6px 16px', 
          borderRadius: '16px', fontSize: '0.9rem', fontWeight: 700, color: '#fff', 
          textTransform: 'uppercase', letterSpacing: '1px' 
        }}>
          {question.category}
        </div>

        {/* Question Text */}
        <h2 style={{ fontSize: '1.8rem', lineHeight: '1.4', color: 'var(--text-primary)' }}>
          {question.text}
        </h2>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 'auto' }}>
          {question.options.map((opt, idx) => (
            <Button 
              key={idx}
              variant="secondary"
              selected={!isAnswered && selectedOption === idx}
              status={getOptionStatus(idx)}
              onClick={() => handleSelect(idx)}
            >
              <span>{opt}</span>
              {isAnswered && idx === question.correct && <Check color="var(--apple-green)" size={24} />}
              {isAnswered && selectedOption === idx && idx !== question.correct && <X color="var(--apple-red)" size={24} />}
            </Button>
          ))}
        </div>
      </div>

      {/* Footer Action */}
      <div style={{ marginTop: '32px' }}>
        <Button 
          variant="primary" 
          disabled={selectedOption === null && !isAnswered}
          onClick={handleSubmit}
          status={isAnswered ? (selectedOption === question.correct ? 'correct' : 'wrong') : 'default'}
        >
          {isAnswered ? 'CONTINUER' : 'VÉRIFIER'}
        </Button>
      </div>

    </div>
  );
}
