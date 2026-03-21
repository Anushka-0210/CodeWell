import React, { useState, useEffect } from 'react';
import { Smile, Meh, Frown, Heart } from 'lucide-react';
import WellnessCard from '../components/WellnessCard';
import { calculateStressLevel, generateWellnessMessages } from '../utils/wellnessRules';
import { showWellnessNotification } from '../utils/notifications';
import '../styles/Wellness.css';

const Wellness = ({ tasks }) => {
  const [mood, setMood] = useState(localStorage.getItem('currentMood') || 'neutral');
  const [breakTimer, setBreakTimer] = useState(0);
  const [isBreakActive, setIsBreakActive] = useState(false);

  // Calculate stress data
  const stressData = calculateStressLevel(tasks);

  // Generate wellness messages
  const wellnessMessages = generateWellnessMessages(mood, stressData);

  // Handle mood selection
  const handleMoodChange = (selectedMood) => {
    setMood(selectedMood);
    localStorage.setItem('currentMood', selectedMood);

    // Show notification based on mood
    if (selectedMood === 'sad') {
      showWellnessNotification(
        "It's okay to feel down. Take care of yourself and consider taking a break. 💙"
      );
    } else if (selectedMood === 'happy') {
      showWellnessNotification(
        "Great energy! Keep maintaining this positive balance. ✨"
      );
    }
  };

  // Break timer effect
  useEffect(() => {
    let interval;
    if (isBreakActive && breakTimer > 0) {
      interval = setInterval(() => {
        setBreakTimer(prev => {
          if (prev <= 1) {
            setIsBreakActive(false);
            showWellnessNotification("Break time is over! Ready to get back to work? 💪");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreakActive, breakTimer]);

  // Start break timer
  const startBreak = (minutes) => {
    setBreakTimer(minutes * 60);
    setIsBreakActive(true);
    showWellnessNotification(`${minutes}-minute break started. Relax and recharge! ☕`);
  };

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get stress emoji
  const getStressEmoji = () => {
    switch (stressData.level) {
      case 'low': return '😌';
      case 'medium': return '😐';
      case 'high': return '😰';
      default: return '😊';
    }
  };

  return (
    <div className="wellness-container">
      <div className="wellness-header">
        <h1>Wellness Center</h1>
        <p>Check in with yourself and maintain balance</p>
      </div>

      <div className="wellness-grid">
        {/* Mood Check-in */}
        <div className="mood-checkin-card">
          <h2>How are you feeling today?</h2>
          <p className="mood-question">Select your current mood</p>
          
          <div className="mood-options">
            <button 
              className={`mood-btn ${mood === 'happy' ? 'selected' : ''}`}
              onClick={() => handleMoodChange('happy')}
            >
              <Smile className="mood-emoji" size={48} />
              <span className="mood-label">Happy</span>
            </button>

            <button 
              className={`mood-btn ${mood === 'neutral' ? 'selected' : ''}`}
              onClick={() => handleMoodChange('neutral')}
            >
              <Meh className="mood-emoji" size={48} />
              <span className="mood-label">Neutral</span>
            </button>

            <button 
              className={`mood-btn ${mood === 'sad' ? 'selected' : ''}`}
              onClick={() => handleMoodChange('sad')}
            >
              <Frown className="mood-emoji" size={48} />
              <span className="mood-label">Sad</span>
            </button>
          </div>

          {mood && (
            <div className="current-mood">
              <div className="current-mood-label">Current Mood</div>
              <div className="current-mood-value">
                {mood.charAt(0).toUpperCase() + mood.slice(1)}
              </div>
            </div>
          )}
        </div>

        {/* Stress Level */}
        <div className="stress-level-card">
          <h2>Stress Level</h2>
          
          <div className="stress-meter">
            <div className="stress-emoji">{getStressEmoji()}</div>
            <div className="stress-text">
              {stressData.level.charAt(0).toUpperCase() + stressData.level.slice(1)} Stress
            </div>
            <div className="stress-description">
              Based on {stressData.pendingCount} pending tasks
            </div>
          </div>

          <div className="stress-factors">
            <h3>Factors</h3>
            <div className="factors-list">
              {stressData.factors.map((factor, index) => (
                <div key={index} className="factor-item">
                  <span>•</span>
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wellness Messages */}
      <div className="wellness-messages-card">
        <h2>Wellness Insights</h2>
        <div className="messages-list">
          {wellnessMessages.map((message, index) => (
            <WellnessCard key={index} message={message} />
          ))}
        </div>
      </div>

      {/* Break Reminder */}
      <div className="break-reminder-card">
        <h2>🧘 Take a Break</h2>
        <p>Regular breaks improve focus and reduce stress</p>
        
        {isBreakActive ? (
          <div className="break-timer">{formatTime(breakTimer)}</div>
        ) : (
          <div className="break-actions">
            <button className="break-btn" onClick={() => startBreak(5)}>
              5 Minutes
            </button>
            <button className="break-btn" onClick={() => startBreak(15)}>
              15 Minutes
            </button>
            <button className="break-btn" onClick={() => startBreak(30)}>
              30 Minutes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wellness;
