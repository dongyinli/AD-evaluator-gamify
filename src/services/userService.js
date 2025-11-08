import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// Create new user account
export const signUpUser = async (username, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await setDoc(doc(db, 'users', user.uid), {
      username: username,
      email: email,
      trainingScore: 0,
      testScore: 0,
      totalScore: 0,
      completedVideos: [],
      videoAnswers: {},
      createdAt: new Date().toISOString()
    });
    
    return { success: true, userId: user.uid };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: error.message };
  }
};

// Sign in existing user
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, userId: userCredential.user.uid };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user document exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(doc(db, 'users', user.uid), {
        username: user.displayName || user.email.split('@')[0],
        email: user.email,
        trainingScore: 0,
        testScore: 0,
        totalScore: 0,
        completedVideos: [],
        videoAnswers: {},
        createdAt: new Date().toISOString()
      });
    } else {
      // Update username in case it changed in Google account
      await updateDoc(doc(db, 'users', user.uid), {
        username: user.displayName || user.email.split('@')[0],
        email: user.email
      });
    }
    
    return { success: true, userId: user.uid };
  } catch (error) {
    console.error('Google sign in error:', error);
    return { success: false, error: error.message };
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
};

// Get user data
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Get user data error:', error);
    return { success: false, error: error.message };
  }
};

// Save user answer for a video
export const saveUserAnswer = async (userId, videoId, questionId, answer, points, isTraining) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userData = await getDoc(userRef);
    
    if (!userData.exists()) {
      throw new Error('User not found');
    }
    
    const currentData = userData.data();
    const videoAnswers = currentData.videoAnswers || {};
    
    if (!videoAnswers[videoId]) {
      videoAnswers[videoId] = {};
    }
    
    videoAnswers[videoId][questionId] = {
      answer: answer,
      points: points,
      timestamp: new Date().toISOString()
    };
    
    let updateData = {
      videoAnswers: videoAnswers,
      totalScore: currentData.totalScore + points
    };
    
    if (isTraining) {
      updateData.trainingScore = (currentData.trainingScore || 0) + points;
    } else {
      updateData.testScore = (currentData.testScore || 0) + points;
    }
    
    await updateDoc(userRef, updateData);
    
    return { success: true };
  } catch (error) {
    console.error('Save answer error:', error);
    return { success: false, error: error.message };
  }
};

// Mark video as completed
export const markVideoCompleted = async (userId, videoId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userData = await getDoc(userRef);
    
    if (!userData.exists()) {
      throw new Error('User not found');
    }
    
    const currentData = userData.data();
    const completedVideos = currentData.completedVideos || [];
    
    if (!completedVideos.includes(videoId)) {
      completedVideos.push(videoId);
      await updateDoc(userRef, { completedVideos });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Mark video completed error:', error);
    return { success: false, error: error.message };
  }
};

// Reset displayed score when starting test phase
export const resetDisplayScore = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      totalScore: 0
    });
    return { success: true };
  } catch (error) {
    console.error('Reset display score error:', error);
    return { success: false, error: error.message };
  }
};