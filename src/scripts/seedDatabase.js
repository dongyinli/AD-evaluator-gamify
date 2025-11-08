// Script to seed videos into Firebase
// Run this once to upload all videos to Firestore

import { TRAINING_VIDEOS, TEST_VIDEOS } from '../data/videosData';
import { addVideo } from '../services/videoService';

export const seedVideos = async () => {
  console.log('🌱 Starting video seeding...');
  
  try {
    // Seed training videos
    console.log('📚 Seeding training videos...');
    for (const video of TRAINING_VIDEOS) {
      const result = await addVideo(video);
      if (result.success) {
        console.log(`✓ Added ${video.id}`);
      } else {
        console.error(`✗ Failed to add ${video.id}:`, result.error);
      }
    }
    
    // Seed test videos
    console.log('📝 Seeding test videos...');
    for (const video of TEST_VIDEOS) {
      const result = await addVideo(video);
      if (result.success) {
        console.log(`✓ Added ${video.id}`);
      } else {
        console.error(`✗ Failed to add ${video.id}:`, result.error);
      }
    }
    
    console.log('✅ Video seeding complete!');
    console.log(`Total videos seeded: ${TRAINING_VIDEOS.length + TEST_VIDEOS.length}`);
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

// To run this script:
// 1. Import it in your App.js temporarily: import { seedVideos } from './scripts/seedDatabase';
// 2. Call seedVideos() once in a useEffect on component mount
// 3. Check Firebase Console to verify videos are uploaded
// 4. Remove the import and useEffect after videos are seeded