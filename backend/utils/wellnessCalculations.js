// Stress Rules Utility
// Contains rules and algorithms for stress level calculation and recommendations

const stressRules = {
  // Stress level ranges
  LOW: { min: 1, max: 3 },
  MEDIUM: { min: 4, max: 6 },
  HIGH: { min: 7, max: 10 },
  
  // Get stress category
  getStressCategory: function(level) {
    if (level >= this.LOW.min && level <= this.LOW.max) return 'LOW';
    if (level >= this.MEDIUM.min && level <= this.MEDIUM.max) return 'MEDIUM';
    if (level >= this.HIGH.min && level <= this.HIGH.max) return 'HIGH';
    return 'UNKNOWN';
  },
  
  // Get recommendations based on stress level
  getRecommendations: function(stressLevel) {
    const category = this.getStressCategory(stressLevel);
    
    const recommendations = {
      LOW: [
        'Keep up your great work!',
        'Maintain your current routine',
        'Focus on your tasks'
      ],
      MEDIUM: [
        'Consider taking a short break',
        'Practice deep breathing exercises',
        'Take a 5-minute walk'
      ],
      HIGH: [
        'Take an immediate break',
        'Practice meditation or mindfulness',
        'Contact support if needed',
        'Step away from work for 15 minutes'
      ]
    };
    
    return recommendations[category] || [];
  },
  
  // Calculate average stress from logs
  calculateAverageStress: function(moodLogs) {
    if (moodLogs.length === 0) return 0;
    const sum = moodLogs.reduce((acc, log) => acc + log.stressLevel, 0);
    return Math.round(sum / moodLogs.length);
  }
};

module.exports = stressRules;
