# Video Picture-in-Picture Chrome Extension

A Chrome extension that enables Picture-in-Picture (PiP) mode for any video playing on a webpage. Watch videos in a floating window that stays on top of all applications - perfect for multitasking!

## Features

- 🎬 **One-Click PiP Activation**: Click the extension icon to enable Picture-in-Picture mode
- 🔄 **Auto-Detection**: Automatically detects playing videos on the current page
- 📍 **Floating Button**: Shows a convenient floating button when videos are detected
- 🎯 **Smart Selection**: Prioritizes currently playing videos
- 🌐 **Universal Support**: Works on YouTube, Vimeo, and most video streaming sites
- 💻 **Always On Top**: Video window stays visible over all applications (VS Code, games, etc.)

## Installation

### Load Unpacked Extension (Developer Mode)

1. **Download the Extension**
   - Download or clone this repository to your computer

2. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or click the three dots menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to the `video-pip-extension` folder
   - Select the folder and click "Select Folder"

5. **Pin the Extension (Optional)**
   - Click the puzzle piece icon in Chrome toolbar
   - Find "Video Picture-in-Picture" and click the pin icon

## Usage

### Method 1: Extension Popup
1. Navigate to any webpage with a video (e.g., YouTube)
2. Start playing the video
3. Click the extension icon in your Chrome toolbar
4. Click "Enable PiP Mode" button

### Method 2: Floating Button
1. When a video is playing, a floating "🎬 PiP" button appears in the bottom-right corner
2. Click this button to instantly enable Picture-in-Picture mode

### Exiting PiP Mode
- Click the PiP button again to exit
- Or use the controls on the floating video window

## How It Works

The extension uses the native browser Picture-in-Picture API to:
- Detect video elements on webpages
- Monitor video playback state
- Enable PiP mode with a single click
- Keep the video window floating on top of all applications

## Browser Compatibility

- ✅ Google Chrome (version 70+)
- ✅ Microsoft Edge (Chromium-based)
- ✅ Brave Browser
- ✅ Opera

## Permissions

The extension requires:
- **activeTab**: To access the current tab and detect videos
- **scripting**: To inject scripts that control video elements

## Privacy

This extension:
- ✅ Does NOT collect any data
- ✅ Does NOT track your browsing
- ✅ Works entirely locally in your browser
- ✅ Does NOT require an internet connection (except for the videos themselves)

## Troubleshooting

**Q: The extension doesn't detect my video**
- Make sure the video is using the HTML5 `<video>` element
- Some videos may be embedded in iframes and require additional permissions

**Q: PiP mode doesn't activate**
- Ensure your browser supports Picture-in-Picture API
- Try refreshing the page and playing the video again

**Q: The floating button doesn't appear**
- The button only appears when a video is actively playing
- Try playing the video first

## Preview

<img width="425" height="239" alt="Screenshot 2026-02-19 113240" src="https://github.com/user-attachments/assets/c7659236-c6cd-4737-aff2-6980797d4fcb" />

<video width="425" height="239" src="https://github.com/user-attachments/assets/7f48502c-7d2f-4fe7-afc7-658da9cad778" controls></video>

## License

This project is open source and available for personal and commercial use.

## Support

If you encounter any issues or have suggestions, please feel free to report them!

---

**Enjoy watching videos while you work! 🎬✨**
