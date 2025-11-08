// Scoring utility functions

export const calculatePoints = (userAnswer, correctAnswer) => {
    const difference = Math.abs(userAnswer - correctAnswer);
    if (difference === 0) return 2;  // Perfect! +2 points
    if (difference === 1) return 1;  // Close! +1 point
    if (difference === 2) return -1; // Try harder! -1 point
    return -2; // Way off! -2 points
  };
  
  export const getAlignmentMessage = (userAnswer, correctAnswer) => {
    const difference = Math.abs(userAnswer - correctAnswer);
    if (difference === 0) return 'Perfect! Exact alignment with consensus!';
    if (difference === 1) return 'Nice! Just 1 point away from consensus';
    if (difference === 2) return 'Almost there! 2 points off from consensus';
    return 'Keep practicing! Way off from consensus';
  };
  
  export const getRatingLabel = (value) => {
    const labels = {
      1: 'Critical Issue',
      2: 'Major Issue',
      3: 'Perceptible Issue',
      4: 'Minor Issues',
      5: 'Just Right'
    };
    return labels[value] || '';
  };
  
  // Play celebration sound/animation for perfect score
  export const celebratePerfectScore = () => {
    // Visual celebration
    console.log('🎉 👏 🎊 PERFECT SCORE! 🎊 👏 🎉');
    
    // You can add confetti or animation here
    // For now, we'll trigger it in the UI component
  };