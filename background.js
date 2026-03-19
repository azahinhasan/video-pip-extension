chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      function: enablePictureInPicture
    });
  } catch (error) {
    console.error('PiP Error:', error);
  }
});

function enablePictureInPicture() {
  let currentPiPVideo = null;
  
  // Add keyboard event listener for arrow key controls
  if (!window.pipKeyboardListenerAdded) {
    document.addEventListener('keydown', (e) => {
      const pipVideo = document.pictureInPictureElement;
      if (!pipVideo) return;
      
      // Left arrow: seek backward 5 seconds
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        pipVideo.currentTime = Math.max(0, pipVideo.currentTime - 5);
      }
      
      // Right arrow: seek forward 5 seconds
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        pipVideo.currentTime = Math.min(pipVideo.duration, pipVideo.currentTime + 5);
      }
      
      // Space: play/pause
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (pipVideo.paused) {
          pipVideo.play();
        } else {
          pipVideo.pause();
        }
      }
    });
    window.pipKeyboardListenerAdded = true;
  }
  
  function findAllVideos() {
    let videos = [];
    
    // Find videos in main document
    videos.push(...document.querySelectorAll('video'));
    
    // Find videos in iframes (same-origin only)
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      try {
        const iframeVideos = iframe.contentDocument?.querySelectorAll('video');
        if (iframeVideos) {
          videos.push(...iframeVideos);
        }
      } catch (e) {
        // Cross-origin iframe, skip
      }
    });
    
    // Find videos in shadow DOM
    function findInShadowDOM(root) {
      const elements = root.querySelectorAll('*');
      elements.forEach(el => {
        if (el.shadowRoot) {
          videos.push(...el.shadowRoot.querySelectorAll('video'));
          findInShadowDOM(el.shadowRoot);
        }
      });
    }
    findInShadowDOM(document.body || document.documentElement);
    
    return videos;
  }
  
  const videos = findAllVideos();
  
  if (videos.length === 0) {
    return; // Silently exit if no videos in this frame
  }
  
  let playingVideo = null;
  
  // Prioritize playing videos
  for (const video of videos) {
    if (!video.paused && video.readyState >= 2) {
      playingVideo = video;
      break;
    }
  }
  
  // Fallback to first video with valid source
  if (!playingVideo) {
    for (const video of videos) {
      if (video.src || video.currentSrc || video.querySelector('source')) {
        playingVideo = video;
        break;
      }
    }
  }
  
  // Last resort: use first video
  if (!playingVideo && videos.length > 0) {
    playingVideo = videos[0];
  }
  
  if (playingVideo) {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(err => {
        console.error('Error exiting PiP:', err);
      });
    }
    
    if (playingVideo !== document.pictureInPictureElement) {
      currentPiPVideo = playingVideo;
      
      playingVideo.requestPictureInPicture()
        .then(() => {
          console.log('Picture-in-Picture mode activated');
        })
        .catch(error => {
          console.error('PiP error:', error);
          currentPiPVideo = null;
        });
      
      // Clear reference when PiP is exited
      playingVideo.addEventListener('leavepictureinpicture', () => {
        currentPiPVideo = null;
      }, { once: true });
    }
  }
}
