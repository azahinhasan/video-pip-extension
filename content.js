let pipButton = null;

function createPipButton() {
  if (pipButton) return;
  
  pipButton = document.createElement('button');
  pipButton.innerHTML = '🎬 PiP';
  pipButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999999;
    padding: 12px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: none;
  `;
  
  pipButton.addEventListener('mouseenter', () => {
    pipButton.style.transform = 'translateY(-3px)';
    pipButton.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
  });
  
  pipButton.addEventListener('mouseleave', () => {
    pipButton.style.transform = 'translateY(0)';
    pipButton.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
  });
  
  pipButton.addEventListener('click', activatePiP);
  
  document.body.appendChild(pipButton);
}

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
      playingVideo.requestPictureInPicture()
        .then(() => {
          showNotification('PiP mode activated!', 'success');
        })
        .catch(error => {
          showNotification('Could not enable PiP: ' + error.message, 'error');
        });
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

function checkForVideos() {
  const videos = document.querySelectorAll('video');
  
  if (videos.length > 0 && pipButton) {
    let hasPlayingVideo = false;
    videos.forEach(video => {
      if (!video.paused) {
        hasPlayingVideo = true;
      }
    });
    
    pipButton.style.display = hasPlayingVideo ? 'block' : 'none';
  }
}

const observer = new MutationObserver(() => {
  if (!pipButton && document.body) {
    createPipButton();
  }
  checkForVideos();
});

if (document.body) {
  createPipButton();
  checkForVideos();
}

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});

document.addEventListener('play', checkForVideos, true);
document.addEventListener('pause', checkForVideos, true);

setInterval(checkForVideos, 2000);
