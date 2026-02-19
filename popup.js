document.getElementById('pipBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
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
  const videos = document.querySelectorAll('video');
  
  if (videos.length === 0) {
    alert('No videos found on this page!');
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
    }
    
    if (playingVideo !== document.pictureInPictureElement) {
      playingVideo.requestPictureInPicture()
        .then(() => {
          console.log('Picture-in-Picture mode activated');
        })
        .catch(error => {
          alert('Could not enable Picture-in-Picture: ' + error.message);
          console.error('PiP error:', error);
        });
    }
  } else {
    alert('No suitable video found to enable Picture-in-Picture!');
  }
}
