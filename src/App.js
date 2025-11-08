import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Trophy, LogOut, ChevronRight, Flame } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import {
  signOutUser,
  getUserData,
  saveUserAnswer,
  markVideoCompleted,
  resetDisplayScore,
  signInWithGoogle
} from './services/userService';
import { calculatePoints, getAlignmentMessage } from './utils/scoring';
import { TRAINING_VIDEOS, TEST_VIDEOS, isTrainingComplete } from './data/videosData';
import { getShuffleOrderForUser } from './utils/shuffleVideos';
//import { seedVideos } from './scripts/seedDatabase';

const App = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Video state
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [videoWatched, setVideoWatched] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNearMiss, setShowNearMiss] = useState(false);
  const [showMinusOne, setShowMinusOne] = useState(false);
  const [showMinusTwo, setShowMinusTwo] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [confettiConfig, setConfettiConfig] = useState({ count: 0, emojis: [], minDuration: 1.6, maxDuration: 2.2 });
  const [showGoldBadge, setShowGoldBadge] = useState(false);

  const currentVideo = videos[currentVideoIndex] || null;
  const isTraining = currentVideo?.type === 'training';
  const completedTraining = userData?.completedVideos ?
    isTrainingComplete(userData.completedVideos) : false;

  /*
  useEffect(() => {
    // Run once to upload videos to Firebase
    seedVideos();
  }, []);
  */

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        try {
          const result = await getUserData(user.uid);
          if (result.success) {
            setUserData(result.data);

            // Get shuffled video order for this user (from Firebase)
            console.log('Fetching shuffled videos for user:', user.uid);
            console.log('TRAINING_VIDEOS:', TRAINING_VIDEOS);
            console.log('TEST_VIDEOS:', TEST_VIDEOS);

            let shuffledVideos = [];
            try {
              shuffledVideos = await getShuffleOrderForUser(user.uid, TRAINING_VIDEOS, TEST_VIDEOS);
              console.log('Shuffled videos received:', shuffledVideos);
            } catch (error) {
              console.error('Error in getShuffleOrderForUser:', error);
              // Fallback: use videos directly
              shuffledVideos = [...TRAINING_VIDEOS, ...TEST_VIDEOS];
            }

            if (!shuffledVideos || shuffledVideos.length === 0) {
              console.warn('No videos returned, using fallback');
              shuffledVideos = [...TRAINING_VIDEOS, ...TEST_VIDEOS];
            }

            setVideos(shuffledVideos);

            if (shuffledVideos.length > 0) {
              // Find the first video that hasn't been completed
              const completedVideos = result.data.completedVideos || [];
              const firstUncompletedIndex = shuffledVideos.findIndex(
                video => !completedVideos.includes(video.id)
              );

              // Start at first uncompleted video, or first video if all completed
              const startIndex = firstUncompletedIndex !== -1 ? firstUncompletedIndex : 0;
              setCurrentVideoIndex(startIndex);

              loadUserAnswersForVideo(result.data, shuffledVideos[startIndex]?.id, shuffledVideos[startIndex]);
            }
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        setCurrentUserId(null);
        setUserData(null);
        setVideos([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load user's previous answers for a specific video (uses videoId to avoid stale currentVideo)
  const loadUserAnswersForVideo = (user, videoId, videoObj) => {
    if (!user || !videoId || !videoObj) return;

    const videoAnswers = user.videoAnswers?.[videoId] || {};
    const loadedAnswers = {};
    const loadedFeedback = {};

    Object.keys(videoAnswers).forEach(questionId => {
      const answerData = videoAnswers[questionId];
      loadedAnswers[questionId] = answerData.answer;

      const question = videoObj.questions.find(q => q.id === parseInt(questionId));
      if (question) {
        loadedFeedback[questionId] = {
          points: answerData.points,
          correct: answerData.answer === question.correctAnswer,
          justification: question.justification
        };
      }
    });

    setAnswers(loadedAnswers);
    setFeedback(loadedFeedback);

    if (Object.keys(loadedAnswers).length > 0) {
      setVideoWatched(true);
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    if (!result.success) {
      alert(result.error);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    setAnswers({});
    setFeedback({});
    setVideoWatched(false);
  };

  const handleAnswerSelect = async (questionId, newAnswer) => {
    if (answers[questionId] !== undefined) return;

    const question = currentVideo.questions.find(q => q.id === questionId);
    const difference = Math.abs(newAnswer - question.correctAnswer);
    const points = calculatePoints(newAnswer, question.correctAnswer);
    const isPerfect = difference === 0;
    const isNearMiss = difference === 1;

    setAnswers(prev => ({ ...prev, [questionId]: newAnswer }));
    setFeedback(prev => ({
      ...prev,
      [questionId]: {
        points: points,
        correct: isPerfect,
        justification: question.justification
      }
    }));

    // Perfect (+2): gold/amber confetti (40–60), 1.6–2.2s, streak++
    if (isPerfect) {
      const count = 40 + Math.floor(Math.random() * 21);
      setConfettiConfig({ count, emojis: ['🏅', '⭐', '✨', '🎉', '🎊'], minDuration: 1.6, maxDuration: 2.2 });
      setShowConfetti(true);
      setShowGoldBadge(true);
      setTimeout(() => setShowConfetti(false), 2000);
      setTimeout(() => setShowGoldBadge(false), 2000);
      setStreakCount(prev => prev + 1);
    }
    // Near miss (+1): silver/gray confetti (15–25), 1.6–2.2s, streak reset
    if (!isPerfect && isNearMiss) {
      setShowGoldBadge(false);
      setShowNearMiss(true);
      setTimeout(() => setShowNearMiss(false), 2000);
      setStreakCount(0);
    }
    // Negative: no confetti, red overlays
    if (!isPerfect && !isNearMiss) {
      setShowGoldBadge(false);
      setStreakCount(0);
      if (difference === 2) {
        setShowMinusOne(true);
        setTimeout(() => setShowMinusOne(false), 2000);
      } else if (difference >= 3) {
        setShowMinusTwo(true);
        setTimeout(() => setShowMinusTwo(false), 2000);
      }
    }

    // Save to Firebase
    await saveUserAnswer(
      currentUserId,
      currentVideo.id,
      questionId,
      newAnswer,
      points,
      isTraining
    );

    // Reload user data to update score
    const result = await getUserData(currentUserId);
    if (result.success) {
      setUserData(result.data);
    }
  };

  const handleNextVideo = async () => {
    // Mark current video as completed
    await markVideoCompleted(currentUserId, currentVideo.id);

    // Check if this was the last training video
    const updatedUserData = await getUserData(currentUserId);
    if (updatedUserData.success) {
      setUserData(updatedUserData.data);

      // If just completed training, reset displayed score for test phase
      if (isTraining && isTrainingComplete(updatedUserData.data.completedVideos)) {
        await resetDisplayScore(currentUserId);
        alert('🎉 Training complete! Your training score has been saved. Starting test phase with fresh score!');
        const refreshedData = await getUserData(currentUserId);
        if (refreshedData.success) {
          setUserData(refreshedData.data);
        }
      }
    }

    // Move to next video
    if (currentVideoIndex < videos.length - 1) {
      const nextIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(nextIndex);
      setAnswers({});
      setFeedback({});
      setVideoWatched(false);

      // Load answers for next video if they exist
      if (updatedUserData.success) {
        loadUserAnswersForVideo(updatedUserData.data, videos[nextIndex].id, videos[nextIndex]);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl text-indigo-600">Loading...</div>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <Trophy className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">AssessAD</h1>
            <p className="text-gray-600 mt-2">Gamified Audio Description Quality Assessment</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-lg">Continue with Google</span>
          </button>

          <p className="text-center text-sm text-gray-500 mt-6">
            Sign in to start evaluating audio descriptions
          </p>
        </div>
      </div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-indigo-600 mb-4">Loading videos...</div>
          <div className="text-sm text-gray-600">
            Videos array length: {videos.length}
          </div>
          <button
            onClick={() => {
              console.log('Current state:', { videos, currentVideoIndex, userData });
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Debug Info (Check Console)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(confettiConfig.count || 40)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-falling-sway drop-shadow"
              style={{
                left: `${Math.random() * 100}%`,
                fontSize: `${18 + Math.random() * 26}px`,
                animationDelay: `${Math.random() * 0.6}s`,
                animationDuration: `${confettiConfig.minDuration + Math.random() * (confettiConfig.maxDuration - confettiConfig.minDuration)}s`
              }}
            >
              {confettiConfig.emojis && confettiConfig.emojis.length > 0
                ? confettiConfig.emojis[Math.floor(Math.random() * confettiConfig.emojis.length)]
                : '🎉'}
            </div>
          ))}
          {/* Center gold badge for perfect score (+2) */}
          {showGoldBadge && (
            <div className="fixed top-1/3 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl shadow-xl border bg-gradient-to-r from-yellow-400 to-amber-500 border-amber-500 text-amber-900 font-extrabold text-2xl animate-pop backdrop-blur">
              Legendary! +2 🏅
            </div>
          )}
        </div>
      )}
      {showNearMiss && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* Center silver badge for near-miss (+1) */}
          <div className="fixed top-1/3 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl shadow-xl border bg-gradient-to-r from-gray-200 to-gray-400 border-gray-400 text-gray-800 font-extrabold text-2xl animate-pop backdrop-blur">
            So close! +1 🥈
          </div>
        </div>
      )}
      {showMinusOne && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* Center red badge for -1 (two away) */}
          <div className="fixed top-1/3 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl shadow-xl border bg-gradient-to-r from-red-400 to-red-600 border-red-600 text-white font-extrabold text-2xl animate-pop backdrop-blur">
            Try harder! −1 ⚡
          </div>
        </div>
      )}
      {showMinusTwo && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* Center deeper red badge for -2 (three or more away) */}
          <div className="fixed top-1/3 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl shadow-xl border bg-gradient-to-r from-rose-600 to-red-800 border-red-800 text-white font-extrabold text-2xl animate-pop backdrop-blur">
            Kepp practicing! −2 💥
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Trophy className="w-8 h-8 text-indigo-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Welcome, {userData?.username}!</h2>
              <p className="text-sm text-gray-600">
                {isTraining ? 'Training Phase' : 'Test Phase'} - Video {currentVideoIndex + 1} of {videos.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 px-6 py-2 rounded-lg">
              <p className="text-sm text-indigo-600 font-medium">
                {isTraining ? 'Training Score' : 'Test Score'}
              </p>
              <p className="text-2xl font-bold text-indigo-700">
                {isTraining ? userData?.trainingScore || 0 : userData?.testScore || 0}
              </p>
            </div>
            <div className="bg-white/70 px-4 py-2 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700">Streak</span>
                <span className="text-sm font-bold text-orange-600">{streakCount}</span>
              </div>
              <div className="mt-1 h-2 w-32 bg-orange-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all"
                  style={{ width: `${Math.min(streakCount, 5) / 5 * 100}%` }}
                />
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {completedTraining && isTraining && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-semibold">
              🎉 Congratulations! You've completed all training videos. Click "Next Video" to start the test phase!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {currentVideo.type === 'training'
                ? currentVideo.title
                : `Test Video ${currentVideoIndex - TRAINING_VIDEOS.length + 1}`}
            </h3>
            <div className="relative w-full mb-4" style={{ paddingBottom: '90%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={currentVideo.youDescribeUrl}
                title="Audio Description Video"
                style={{ border: 'none' }}
              />
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-indigo-800">
                <span className="font-semibold">Instructions:</span> Watch the entire video with audio description,
                then answer the questions on the right. Once you select an answer, it cannot be changed.
              </p>
            </div>
            {!videoWatched && (
              <button
                onClick={() => setVideoWatched(true)}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium text-lg"
              >
                I've Watched the Entire Video
              </button>
            )}
          </div>

          <div className="space-y-4 max-h-screen overflow-y-auto pr-2">
            {!videoWatched ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 text-lg">Please watch the video first before answering questions.</p>
              </div>
            ) : (
              <>
                {currentVideo.questions.map((question) => (
                  <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      Question {question.id}: {question.text}
                    </h4>

                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {[
                        { value: 1, label: 'Critical Issue' },
                        { value: 2, label: 'Major Issue' },
                        { value: 3, label: 'Perceptible Issue' },
                        { value: 4, label: 'Minor Issues' },
                        { value: 5, label: 'Just Right' }
                      ].map((option) => (
                        <div key={option.value} className="flex flex-col items-center">
                          <button
                            onClick={() => handleAnswerSelect(question.id, option.value)}
                            disabled={answers[question.id] !== undefined}
                            className={`w-full py-3 rounded-lg font-medium transition ${answers[question.id] === option.value
                              ? (feedback[question.id]?.correct
                                ? 'bg-green-500 text-white animate-pop'
                                : 'bg-red-500 text-white')
                              : option.value === question.correctAnswer && answers[question.id] !== undefined
                                ? 'bg-green-100 border-2 border-green-500 text-green-700'
                                : answers[question.id] !== undefined
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer'
                              }`}
                          >
                            {option.value}
                          </button>
                          <span className="text-xs text-gray-600 mt-1 text-center">{option.label}</span>
                        </div>
                      ))}
                    </div>

                    {feedback[question.id] && (
                      <div className={`p-4 rounded-lg ${feedback[question.id].points > 0 ? 'bg-green-50 border border-green-200' :
                        feedback[question.id].points === 0 ? 'bg-yellow-50 border border-yellow-200' :
                          'bg-red-50 border border-red-200'
                        }`}>
                        <div className="flex items-start gap-2 mb-2">
                          {feedback[question.id].correct ? (
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className={`font-semibold text-lg ${feedback[question.id].points > 0 ? 'text-green-800' :
                              feedback[question.id].points === 0 ? 'text-yellow-800' :
                                'text-red-800'
                              }`}>
                              {getAlignmentMessage(answers[question.id], question.correctAnswer)}
                            </p>
                            <p className={`text-md font-bold mt-1 ${feedback[question.id].points > 0 ? 'text-green-700' : 'text-red-700'
                              }`}>
                              {feedback[question.id].points > 0 ? '+' : ''}{feedback[question.id].points} points
                            </p>
                            <p className="text-sm text-gray-700 mt-2">
                              Your rating: {answers[question.id]} | Consensus: {question.correctAnswer}
                            </p>
                            {feedback[question.id].justification && (
                              <p className="text-sm text-gray-600 mt-2">
                                <span className="font-medium">Why:</span> {feedback[question.id].justification}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {!answers[question.id] && (
                      <p className="text-sm text-gray-500 text-center mt-2">
                        Select your rating above
                      </p>
                    )}
                  </div>
                ))}

                {Object.keys(answers).length === currentVideo.questions.length && (
                  <div className="bg-white rounded-lg shadow-md p-6 text-center sticky bottom-0">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Evaluation Complete!</h3>
                    <p className="text-gray-600 mb-4">
                      You scored {Object.values(feedback).reduce((sum, f) => sum + f.points, 0)} points on this video.
                    </p>
                    {currentVideoIndex < videos.length - 1 && (
                      <button
                        onClick={handleNextVideo}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium inline-flex items-center gap-2"
                      >
                        {/* Check if next video is test phase */}
                        {isTraining && videos[currentVideoIndex + 1]?.type === 'test'
                          ? 'Start Test Phase'
                          : 'Next Video'}
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                    {currentVideoIndex === videos.length - 1 && (
                      <p className="text-green-600 font-semibold">
                        🎉 Congratulations! You've completed all videos!
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;