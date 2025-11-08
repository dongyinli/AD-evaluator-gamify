// Utility to shuffle videos while keeping versions together
// Stores shuffle order in Firebase per user

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Define content groups and their test IDs (10 groups × 3 versions each = 30 videos)
const CONTENT_GROUPS = {
  starwars: ['test1', 'test2', 'test3'],           // Human, Qwen, GPT
  janegoodall: ['test4', 'test5', 'test6'],        // Human, Qwen, GPT
  elf: ['test7', 'test8', 'test9'],                // Human, Qwen, GPT
  crashcoursekids: ['test10', 'test11', 'test12'], // Human, Qwen, GPT
  ladybird: ['test13', 'test14', 'test15'],        // Human, Qwen, GPT
  makeup: ['test16', 'test17', 'test18'],          // Human, Qwen, GPT (5 Minute Makeup)
  origami: ['test19', 'test20', 'test21'],         // Human, Qwen, GPT
  baldeagles: ['test22', 'test23', 'test24'],      // Human, Qwen, GPT
  pickles: ['test25', 'test26', 'test27'],         // Human, Qwen, GPT (3 Ways Pickles)
  frozen: ['test28', 'test29', 'test30']           // Human, Qwen, GPT (Frozen Trailer)
};

// Group test videos by content
const groupTestVideos = (testVideos) => {
  const grouped = {
    starwars: [],
    janegoodall: [],
    elf: [],
    crashcoursekids: [],
    ladybird: [],
    makeup: [],
    origami: [],
    baldeagles: [],
    pickles: [],
    frozen: []
  };
  
  testVideos.forEach(video => {
    // Find which group this video belongs to
    for (const [groupKey, videoIds] of Object.entries(CONTENT_GROUPS)) {
      if (videoIds.includes(video.id)) {
        grouped[groupKey].push(video);
        break;
      }
    }
  });
  
  return grouped;
};

// Create shuffled order for a new user
const createShuffledOrder = (trainingVideos, testVideos) => {
  // Training videos always stay in order
  const orderedTraining = [...trainingVideos];
  
  // Group test videos by content
  const grouped = groupTestVideos(testVideos);
  
  // Shuffle versions within each group
  const shuffledGroups = {};
  Object.keys(grouped).forEach(groupKey => {
    shuffledGroups[groupKey] = shuffleArray(grouped[groupKey]);
  });
  
  // Shuffle the order of content groups
  const groupKeys = shuffleArray(Object.keys(shuffledGroups));
  
  // Flatten back to array
  const shuffledTest = [];
  groupKeys.forEach(groupKey => {
    shuffledTest.push(...shuffledGroups[groupKey]);
  });
  
  return [...orderedTraining, ...shuffledTest];
};

// Get or create shuffle order for a user (stored in Firebase)
export const getShuffleOrderForUser = async (userId, trainingVideos, testVideos) => {
  try {
    // Check Firebase for existing shuffle order
    const shuffleRef = doc(db, 'userShuffleOrders', userId);
    const shuffleDoc = await getDoc(shuffleRef);
    
    if (shuffleDoc.exists()) {
      // User has an existing shuffle order
      const storedOrder = shuffleDoc.data().videoOrder;
      
      // Map stored IDs back to full video objects
      const allVideos = [...trainingVideos, ...testVideos];
      const orderedVideos = storedOrder.map(videoId => 
        allVideos.find(v => v.id === videoId)
      ).filter(v => v !== undefined);
      
      return orderedVideos;
    } else {
      // Create new shuffle order for new user
      const shuffledVideos = createShuffledOrder(trainingVideos, testVideos);
      
      // Store the order in Firebase
      await setDoc(shuffleRef, {
        userId,
        videoOrder: shuffledVideos.map(v => v.id),
        createdAt: new Date().toISOString()
      });
      
      return shuffledVideos;
    }
  } catch (error) {
    console.error('Error getting shuffle order:', error);
    // Fallback: return unshuffled order
    return [...trainingVideos, ...testVideos];
  }
};

// Optional: Get shuffle order stats for admin
export const getShuffleStats = async (userId) => {
  try {
    const shuffleRef = doc(db, 'userShuffleOrders', userId);
    const shuffleDoc = await getDoc(shuffleRef);
    
    if (shuffleDoc.exists()) {
      return { success: true, data: shuffleDoc.data() };
    }
    return { success: false, error: 'No shuffle order found' };
  } catch (error) {
    console.error('Error getting shuffle stats:', error);
    return { success: false, error: error.message };
  }
};