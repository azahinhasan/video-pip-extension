document.getElementById('pipBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      function: enablePictureInPicture
    });
    
    statusDiv.textContent = '✓ PiP mode activated!';
    statusDiv.className = 'show';
    
    setTimeout(() => {
      window.close();
    }, 500);
    
  } catch (error) {
    statusDiv.textContent = '✗ Error: ' + error.message;
    statusDiv.className = 'show';
    console.error('PiP Error:', error);
  }
});

function enablePictureInPicture() {
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
      playingVideo.requestPictureInPicture()
        .then(() => {
          console.log('Picture-in-Picture mode activated');
        })
        .catch(error => {
          console.error('PiP error:', error);
        });
    }
  }
}
