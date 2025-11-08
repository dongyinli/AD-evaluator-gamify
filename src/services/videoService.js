import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

// Add video to Firestore
export const addVideo = async (videoData) => {
  try {
    await setDoc(doc(db, 'videos', videoData.id), videoData);
    return { success: true };
  } catch (error) {
    console.error('Add video error:', error);
    return { success: false, error: error.message };
  }
};

// Get single video
export const getVideo = async (videoId) => {
  try {
    const videoDoc = await getDoc(doc(db, 'videos', videoId));
    if (videoDoc.exists()) {
      return { success: true, data: videoDoc.data() };
    } else {
      return { success: false, error: 'Video not found' };
    }
  } catch (error) {
    console.error('Get video error:', error);
    return { success: false, error: error.message };
  }
};

// Get all training videos
export const getTrainingVideos = async () => {
  try {
    const q = query(
      collection(db, 'videos'),
      where('type', '==', 'training'),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const videos = [];
    querySnapshot.forEach((doc) => {
      videos.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: videos };
  } catch (error) {
    console.error('Get training videos error:', error);
    return { success: false, error: error.message };
  }
};

// Get all test videos
export const getTestVideos = async () => {
  try {
    const q = query(
      collection(db, 'videos'),
      where('type', '==', 'test'),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const videos = [];
    querySnapshot.forEach((doc) => {
      videos.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: videos };
  } catch (error) {
    console.error('Get test videos error:', error);
    return { success: false, error: error.message };
  }
};

// Get all videos (training + test)
export const getAllVideos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'videos'));
    const videos = [];
    querySnapshot.forEach((doc) => {
      videos.push({ id: doc.id, ...doc.data() });
    });
    // Sort by type (training first) then by order
    videos.sort((a, b) => {
      if (a.type === b.type) return a.order - b.order;
      return a.type === 'training' ? -1 : 1;
    });
    return { success: true, data: videos };
  } catch (error) {
    console.error('Get all videos error:', error);
    return { success: false, error: error.message };
  }
};