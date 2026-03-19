let currentPiPVideo = null;

// Add keyboard event listener for arrow key controls
document.addEventListener('keydown', (e) => {
  if (!currentPiPVideo || !document.pictureInPictureElement) return;
  
  // Left arrow: seek backward 5 seconds
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    currentPiPVideo.currentTime = Math.max(0, currentPiPVideo.currentTime - 5);
  }
  
  // Right arrow: seek forward 5 seconds
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    currentPiPVideo.currentTime = Math.min(currentPiPVideo.duration, currentPiPVideo.currentTime + 5);
  }
  
  // Space: play/pause
  if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault();
    if (currentPiPVideo.paused) {
      currentPiPVideo.play();
    } else {
      currentPiPVideo.pause();
    }
  }
});

function activatePiP() {
  const videos = document.querySelectorAll('video');
  
  if (videos.length === 0) {
    showNotification('No videos found on this page!', 'error');
    return;
  }
  
  let playingVideo = null;
  
  for (const video of videos) {
    if (!video.paused && video.readyState >= 2) {
      playingVideo = video;
      break;
    }
  }
  
  if (!playingVideo && videos.length > 0) {
    playingVideo = videos[0];
  }
  
  if (playingVideo) {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(err => {
        console.error('Error exiting PiP:', err);
      });
    } else {
      currentPiPVideo = playingVideo;
      
      playingVideo.requestPictureInPicture()
        .then(() => {
          showNotification('PiP mode activated!', 'success');
        })
        .catch(error => {
          showNotification('Could not enable PiP: ' + error.message, 'error');
          currentPiPVideo = null;
        });
      
      // Clear reference when PiP is exited
      playingVideo.addEventListener('leavepictureinpicture', () => {
        currentPiPVideo = null;
      }, { once: true });
    }
  }
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000000;
    padding: 15px 25px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}


