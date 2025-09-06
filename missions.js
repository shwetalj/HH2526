// YouTube API Loading with Retry Logic
const API_LOADING_CONFIG = {
    maxRetries: 3,
    retryDelay: 1000, // Start with 1 second
    maxWaitTime: 10000, // Maximum 10 seconds to wait
    checkInterval: 100 // Check every 100ms
};

// API Loading State Management
const apiState = {
    status: 'idle', // idle, loading, ready, failed
    retryCount: 0,
    loadingStartTime: null,
    callbacks: [],
    errorMessage: null
};

// YouTube player variable
var player;
var playerReady = false;

// Enhanced API Ready Handler
function onYouTubeIframeAPIReady() {
    console.log('✅ YouTube IFrame API ready');
    apiState.status = 'ready';
    playerReady = true;
    
    // Execute any pending callbacks
    apiState.callbacks.forEach(callback => callback());
    apiState.callbacks = [];
    
    // Show success indicator
    showApiStatus('ready');
}

// Show API loading status to user
function showApiStatus(status, message = '') {
    // Remove any existing status indicators
    const existingStatus = document.querySelector('.api-status-indicator');
    if (existingStatus) existingStatus.remove();
    
    if (status === 'loading') {
        const indicator = document.createElement('div');
        indicator.className = 'api-status-indicator';
        indicator.innerHTML = `
            <div class="api-loading">
                <div class="spinner"></div>
                <span>Loading video player...</span>
            </div>
        `;
        document.body.appendChild(indicator);
    } else if (status === 'error') {
        const indicator = document.createElement('div');
        indicator.className = 'api-status-indicator api-error';
        indicator.innerHTML = `
            <div class="api-error-msg">
                <span>⚠️ ${message}</span>
                <button onclick="retryApiLoad()">Retry</button>
            </div>
        `;
        document.body.appendChild(indicator);
    } else if (status === 'ready') {
        // Briefly show success, then remove
        const indicator = document.createElement('div');
        indicator.className = 'api-status-indicator api-success';
        indicator.innerHTML = '<span>✅ Video player ready</span>';
        document.body.appendChild(indicator);
        setTimeout(() => indicator.remove(), 2000);
    }
}

// Load YouTube API with retry logic
function loadYouTubeAPI() {
    if (apiState.status === 'loading' || apiState.status === 'ready') {
        console.log(`API already ${apiState.status}`);
        return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
        apiState.status = 'loading';
        apiState.loadingStartTime = Date.now();
        showApiStatus('loading');
        
        const attemptLoad = () => {
            console.log(`Loading YouTube API (attempt ${apiState.retryCount + 1}/${API_LOADING_CONFIG.maxRetries})`);
            
            // Create and insert script tag
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            tag.onerror = () => handleApiLoadError(resolve, reject, attemptLoad);
            
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            
            // Check if API is ready
            const checkReady = setInterval(() => {
                const elapsed = Date.now() - apiState.loadingStartTime;
                
                if (typeof YT !== 'undefined' && YT.Player) {
                    clearInterval(checkReady);
                    if (apiState.status !== 'ready') {
                        onYouTubeIframeAPIReady();
                    }
                    resolve();
                } else if (elapsed > API_LOADING_CONFIG.maxWaitTime) {
                    clearInterval(checkReady);
                    handleApiLoadError(resolve, reject, attemptLoad);
                }
            }, API_LOADING_CONFIG.checkInterval);
        };
        
        attemptLoad();
    });
}

// Handle API loading errors
function handleApiLoadError(resolve, reject, retryFunc) {
    apiState.retryCount++;
    
    if (apiState.retryCount < API_LOADING_CONFIG.maxRetries) {
        const delay = API_LOADING_CONFIG.retryDelay * Math.pow(2, apiState.retryCount - 1);
        console.log(`Retrying in ${delay}ms...`);
        showApiStatus('error', `Loading failed. Retrying (${apiState.retryCount}/${API_LOADING_CONFIG.maxRetries})...`);
        
        setTimeout(() => {
            retryFunc();
        }, delay);
    } else {
        apiState.status = 'failed';
        apiState.errorMessage = 'Failed to load YouTube API after multiple attempts';
        console.error(apiState.errorMessage);
        showApiStatus('error', 'Video player unavailable. Using fallback mode.');
        resolve(); // Resolve anyway to allow fallback
    }
}

// Manual retry function
function retryApiLoad() {
    apiState.retryCount = 0;
    apiState.status = 'idle';
    loadYouTubeAPI();
}

// Initialize API loading on page load
document.addEventListener('DOMContentLoaded', () => {
    // Pre-load API in background
    setTimeout(() => {
        if (apiState.status === 'idle') {
            loadYouTubeAPI().catch(err => {
                console.error('Failed to pre-load YouTube API:', err);
            });
        }
    }, 1000);
});

// Create grid overlay
function createGrid() {
    const gridOverlay = document.getElementById('gridOverlay');
    gridOverlay.innerHTML = '';
    
    // Create horizontal lines every 10%
    for (let i = 0; i <= 100; i += 10) {
        const line = document.createElement('div');
        line.className = 'grid-line-h';
        line.style.top = i + '%';
        
        const label = document.createElement('div');
        label.className = 'grid-label';
        label.style.top = i + '%';
        label.style.left = '5px';
        label.textContent = i + '%';
        
        gridOverlay.appendChild(line);
        gridOverlay.appendChild(label);
    }
    
    // Create vertical lines every 10%
    for (let i = 0; i <= 100; i += 10) {
        const line = document.createElement('div');
        line.className = 'grid-line-v';
        line.style.left = i + '%';
        
        const label = document.createElement('div');
        label.className = 'grid-label';
        label.style.left = i + '%';
        label.style.top = '5px';
        label.textContent = i + '%';
        
        gridOverlay.appendChild(line);
        gridOverlay.appendChild(label);
    }
}

// Toggle grid visibility
function toggleGrid() {
    const gridOverlay = document.getElementById('gridOverlay');
    gridOverlay.classList.toggle('show');
}

// Track mouse coordinates
document.addEventListener('DOMContentLoaded', function() {
    createGrid();
    initializeTouchGestures();
    
    const mapWrapper = document.getElementById('mapWrapper');
    const xCoord = document.getElementById('xCoord');
    const yCoord = document.getElementById('yCoord');
    
    mapWrapper.addEventListener('mousemove', function(e) {
        const rect = mapWrapper.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
        
        xCoord.textContent = x;
        yCoord.textContent = y;
    });
    
    // Click to log coordinates
    mapWrapper.addEventListener('click', function(e) {
        if (e.target.closest('.marker')) return;
        
        const rect = mapWrapper.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
        
        console.log(`Clicked at: X: ${x}%, Y: ${y}%`);
    });
});

// Mission data with scoring information
const missionData = {
    '01': {
        title: 'M01: Surface Brushing',
        hint: '<picture><source srcset="mission_cards/M01_Surface_Brushing.webp" type="image/webp"><img src="mission_cards/M01_Surface_Brushing.png" style="width: 100%; max-width: 100%; height: auto; border-radius: 5px;"></picture>'
    },
    '02': {
        title: 'M02: Map Reveal',
        hint: '<picture><source srcset="mission_cards/M02_Map_Reward.webp" type="image/webp"><img src="mission_cards/M02_Map_Reward.png" style="width: 100%; max-width: 100%; height: auto; border-radius: 5px;"></picture>'
    },
    '03': {
        title: 'M03: Mineshaft Explorer',
        hint: '<picture><source srcset="mission_cards/M03_Mineshaft_Explorers.webp" type="image/webp"><img src="mission_cards/M03_Mineshaft_Explorers.png" style="width: 100%; max-width: 100%; height: auto; border-radius: 5px;"></picture>'
    },
    '04': {
        title: 'M04: Careful Recovery',
        hint: '<picture><source srcset="mission_cards/M04_Careful_Recovery.webp" type="image/webp"><img src="mission_cards/M04_Careful_Recovery.png" style="width: 100%; max-width: 100%; height: auto; border-radius: 5px;"></picture>'
    },
    '05': {
        title: 'M05: Who Lived Here?',
        hint: '<picture><source srcset="mission_cards/M05_Who_Lived_Here.webp" type="image/webp"><img src="mission_cards/M05_Who_Lived_Here.png" style="width: 100%; max-width: 100%; height: auto; border-radius: 5px;"></picture>'
    },
    '06': {
        title: 'M06: Forge',
        hint: '<picture><source srcset="mission_cards/M06_Forge.webp" type="image/webp"><img src="mission_cards/M06_Forge.png" style="width: 100%; max-width: 100%; height: auto; border-radius: 5px;"></picture>'
    },
    '07': {
        title: 'M07: Heavy Lifting',
        hint: '<picture><source srcset="mission_cards/M07_Heavy_Lifting.webp" type="image/webp"><img src="mission_cards/M07_Heavy_Lifting.png" style="width: 100%; max-width: 100%; height: auto; border-radius: 5px;"></picture>'
    },
    '08': {
        title: 'M08: Silo',
        hint: '<picture><source srcset="mission_cards/M08_Silo.webp" type="image/webp"><img src="mission_cards/M08_Silo.png" style="width: 100%; max-width: 100%; height: auto; border-radius: 5px;"></picture>'
    },
    '09': {
        title: 'M09: What\'s on Sale?',
        hint: '<picture><source srcset="mission_cards/M09_Rock_on_Slab.webp" type="image/webp"><img src="mission_cards/M09_Rock_on_Slab.png" style="width: 100%; max-width: 100%; height: auto; border-radius: 5px;"></picture>'
    },
    '10': {
        title: 'M10: Tip the Scales',
        hint: '<picture><source srcset="mission_cards/M10_Tip_the_Scales.webp" type="image/webp"><img src="mission_cards/M10_Tip_the_Scales.png" style="width: 100%; max-width: 100%; height: auto; border-radius: 5px;"></picture>'
    },
    '11': {
        title: 'M11: Angler Artifacts',
        hint: '<picture><source srcset="mission_cards/M11_Angler_Artifacts.webp" type="image/webp"><img src="mission_cards/M11_Angler_Artifacts.png" style="width: 100%; max-width: 100%; height: auto; border-radius: 5px;"></picture>'
    },
    '12': {
        title: 'M12: Salvage Operation',
        hint: '<picture><source srcset="mission_cards/M12_Salvage_Operation.webp" type="image/webp"><img src="mission_cards/M12_Salvage_Operation.png" style="width: 100%; max-width: 100%; height: auto; border-radius: 5px;"></picture>'
    },
    '13': {
        title: 'M13: Statue Rebuild',
        hint: '<picture><source srcset="mission_cards/M13_Statue_Rebuild.webp" type="image/webp"><img src="mission_cards/M13_Statue_Rebuild.png" style="width: 100%; max-width: 100%; height: auto; border-radius: 5px;"></picture>'
    },
    '14': {
        title: 'M14: Forum',
        hint: '<picture><source srcset="mission_cards/M14_Forum.webp" type="image/webp"><img src="mission_cards/M14_Forum.png" style="width: 100%; max-width: 100%; height: auto; border-radius: 5px;"></picture>'
    },
    '15': {
        title: 'M15: Site Marking',
        hint: '<picture><source srcset="mission_cards/M15_Site_Marking.webp" type="image/webp"><img src="mission_cards/M15_Site_Marking.png" style="width: 100%; max-width: 100%; height: auto; border-radius: 5px;"></picture>'
    },
    'PT': {
        title: 'Precision Tokens',
        hint: '<picture><source srcset="mission_cards/Precision_Tokens.webp" type="image/webp"><img src="mission_cards/Precision_Tokens.png" style="width: 100%; max-width: 100%; height: auto; border-radius: 5px;"></picture>'
    }
};

// Get all markers
const markers = document.querySelectorAll('.marker');
const hintPopup = document.getElementById('hintPopup');
const hintTitle = document.getElementById('hintTitle');
const hintContent = document.getElementById('hintContent');

// Track closing timeout
let closeTimeout = null;

// Function to cancel close timeout
function cancelCloseTimeout() {
    if (closeTimeout) {
        clearTimeout(closeTimeout);
        closeTimeout = null;
    }
}

// Function to schedule popup close
function scheduleClose() {
    cancelCloseTimeout();
    closeTimeout = setTimeout(() => {
        // Check if mouse is not over any marker, link, or the popup itself
        const isOverMarker = Array.from(markers).some(m => m.matches(':hover'));
        const isOverPopup = hintPopup.matches(':hover');
        const isOverLink = Array.from(document.querySelectorAll('.mission-link')).some(l => l.matches(':hover'));
        
        if (!isOverMarker && !isOverPopup && !isOverLink) {
            closeHint();
        }
    }, 300); // Increased delay to 300ms for better tolerance
}

// Check if device is touch-enabled
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Add hover events to each marker
markers.forEach(marker => {
    if (isTouchDevice) {
        // For touch devices, use click/tap
        marker.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const missionId = this.getAttribute('data-mission');
            const mission = missionData[missionId];
            
            if (mission) {
                // Close any open popup first
                if (hintPopup.classList.contains('active')) {
                    closeHint();
                    // If clicking the same marker, just close
                    if (hintPopup.dataset.currentMission === missionId) {
                        delete hintPopup.dataset.currentMission;
                        return;
                    }
                }
                // Show the new popup
                hintPopup.dataset.currentMission = missionId;
                showHint(mission, this);
            }
        });
    } else {
        // For non-touch devices, use hover
        marker.addEventListener('mouseenter', function(e) {
            cancelCloseTimeout(); // Cancel any pending close
            const missionId = this.getAttribute('data-mission');
            const mission = missionData[missionId];
            
            if (mission) {
                showHint(mission, this);
            }
        });
        
        marker.addEventListener('mouseleave', function(e) {
            scheduleClose(); // Schedule close with delay
        });
    }
});

// Keep hint open when hovering over it
hintPopup.addEventListener('mouseenter', function() {
    cancelCloseTimeout(); // Cancel close when entering popup
    hintPopup.classList.add('active');
});

hintPopup.addEventListener('mouseleave', function() {
    scheduleClose(); // Schedule close when leaving popup
});

// Add hover events to table mission links
const missionLinks = document.querySelectorAll('.mission-link');
missionLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default link behavior
    });
    
    link.addEventListener('mouseenter', function(e) {
        cancelCloseTimeout(); // Cancel any pending close
        const missionId = this.getAttribute('data-mission');
        const mission = missionData[missionId];
        
        if (mission) {
            showHint(mission, this);
        }
    });
    
    link.addEventListener('mouseleave', function(e) {
        scheduleClose(); // Schedule close with delay
    });
});

function showHint(mission, markerElement) {
    hintTitle.textContent = mission.title;
    hintContent.innerHTML = mission.hint;
    
    // Get marker position and dimensions
    const rect = markerElement.getBoundingClientRect();
    const popupWidth = 320;
    const popupMaxHeight = window.innerHeight * 0.8;
    
    // Calculate position relative to viewport
    let left = rect.right + 10; // Default: right of marker
    let top = rect.top;
    
    // Check if popup would go off right edge
    if (left + popupWidth > window.innerWidth) {
        left = rect.left - popupWidth - 10; // Show on left instead
    }
    
    // Check if popup would go off left edge
    if (left < 10) {
        // Center horizontally on mobile
        left = (window.innerWidth - popupWidth) / 2;
        // Position below marker on mobile
        top = rect.bottom + 10;
    }
    
    // Check if popup would go off bottom
    if (top + popupMaxHeight > window.innerHeight) {
        top = Math.max(10, window.innerHeight - popupMaxHeight - 10);
    }
    
    // Check if popup would go off top
    if (top < 10) {
        top = 10;
    }
    
    hintPopup.style.left = left + 'px';
    hintPopup.style.top = top + 'px';
    hintPopup.classList.add('active');
}

function closeHint() {
    hintPopup.classList.remove('active');
}

// Close popup when clicking outside (especially for touch devices)
document.addEventListener('click', function(e) {
    // Only close if it's a touch device or clicking outside marker/popup
    if (isTouchDevice) {
        if (!e.target.closest('.marker') && !e.target.closest('.hint-popup')) {
            closeHint();
            delete hintPopup.dataset.currentMission;
        }
    } else {
        if (!e.target.closest('.marker') && !e.target.closest('.hint-popup') && !e.target.closest('.mission-link')) {
            closeHint();
        }
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    closeHint();
});

// Mission data for playlist and end screens
const allMissions = [
    {id: 'M01', videoId: 'OUHg0bMwHtM', name: 'Surface Brushing', points: '30', start: 6, end: 126},
    {id: 'M02', videoId: 'b-7zkBkgNUw', name: 'Map Reveal', points: '40', start: 6, end: 126},
    {id: 'M03', videoId: 'y6RxJpgBOQM', name: 'Mineshaft Explorer', points: '40', start: 6, end: 126},
    {id: 'M04', videoId: 'MX2WMQ4vN0g', name: 'Careful Recovery', points: '40', start: 6, end: 126},
    {id: 'M05', videoId: 'JmYsPn4cig8', name: 'Who Lived Here?', points: '30', start: 6, end: 126},
    {id: 'M06', videoId: 'szFSKDQCFFw', name: 'Forge', points: '30', start: 6, end: 126},
    {id: 'M07', videoId: '6xcrIo-2WJ8', name: 'Heavy Lifting', points: '30', start: 6, end: 126},
    {id: 'M08', videoId: 'MbvDiuorKsc', name: 'Silo', points: '40', start: 6, end: 126},
    {id: 'M09', videoId: 'yymtNugu4V4', name: "What's on Sale?", points: '30', start: 6, end: 126},
    {id: 'M10', videoId: 'RX8MMw_MJ9g', name: 'Tip the Scales', points: '30', start: 6, end: 126},
    {id: 'M11', videoId: 'qVrT1DH4Zh8', name: 'Angler Artifacts', points: '30', start: 6, end: 126},
    {id: 'M12', videoId: 'hFzNIv1NBzg', name: 'Salvage Operation', points: '30', start: 6, end: 126},
    {id: 'M13', videoId: '1yyh08hg398', name: 'Statue Rebuild', points: '30', start: 6, end: 126},
    {id: 'M14', videoId: 'Pq9d-23TMos', name: 'Forum', points: '35', start: 6, end: 126},
    {id: 'M15', videoId: 'd6cNKGmYxh4', name: 'Site Marking', points: '40', start: 6, end: 126}
];

let currentMissionIndex = -1;
let playlist = [];
let playlistMode = false;
let completedMissions = [];
let currentPlayer = null;
let checkEndInterval = null;

// Initialize playlist display
function initializePlaylist() {
    const playlistItems = document.getElementById('playlistItems');
    playlistItems.innerHTML = '';
    
    allMissions.forEach((mission, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        item.dataset.index = index;
        item.onclick = () => playMissionFromPlaylist(index);
        
        item.innerHTML = `
            <span class="playlist-item-number">${mission.id}</span>
            <span class="playlist-item-name">${mission.name}</span>
            <span class="playlist-item-status" id="status-${mission.id}"></span>
        `;
        
        playlistItems.appendChild(item);
    });
}

// Store current video details for replay
let currentVideoDetails = null;

// Touch gesture support
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Initialize touch gestures for mobile
function initializeTouchGestures() {
    const modal = document.getElementById('videoModal');
    const videoContainer = document.getElementById('videoContainer');
    
    if (!modal || !videoContainer) return;
    
    // Swipe gestures on video container
    videoContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    videoContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipeGesture();
    }, { passive: true });
    
    // Double tap to toggle playback
    let lastTap = 0;
    videoContainer.addEventListener('touchend', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 300 && tapLength > 0) {
            e.preventDefault();
            togglePlayback();
        }
        lastTap = currentTime;
    });
}

// Handle swipe gestures
function handleSwipeGesture() {
    const swipeThreshold = 50;
    const verticalThreshold = 100;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Horizontal swipe for playlist navigation
    if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaY) < verticalThreshold) {
        if (playlistMode && playlist.length > 0) {
            if (deltaX > 0) {
                // Swipe right - previous video
                playPreviousInPlaylist();
            } else {
                // Swipe left - next video
                playNextInPlaylist();
            }
        }
    }
    
    // Vertical swipe down to close
    if (deltaY > verticalThreshold && Math.abs(deltaX) < swipeThreshold) {
        closeVideo();
    }
}

// Toggle video playback
function togglePlayback() {
    if (window.player && typeof window.player.getPlayerState === 'function') {
        const state = window.player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            window.player.pauseVideo();
            showToast('Paused', 'info', 1000);
        } else {
            window.player.playVideo();
            showToast('Playing', 'info', 1000);
        }
    }
}

// Add previous video function
function playPreviousInPlaylist() {
    if (currentMissionIndex > 0) {
        currentMissionIndex--;
        const mission = allMissions[currentMissionIndex];
        playVideo(mission.videoId, `${mission.id}: ${mission.name}`, mission.startTime, mission.endTime);
        showToast('Previous: ' + mission.name, 'info', 2000);
    } else {
        showToast('First video in playlist', 'info', 1500);
    }
}

// Add next video function
function playNextInPlaylist() {
    if (currentMissionIndex < allMissions.length - 1) {
        currentMissionIndex++;
        const mission = allMissions[currentMissionIndex];
        playVideo(mission.videoId, `${mission.id}: ${mission.name}`, mission.start, mission.end);
        showToast('Next: ' + mission.name, 'info', 2000);
    } else {
        showToast('Last video in playlist', 'info', 1500);
    }
}

// Video modal functions with enhanced features
function playVideo(videoId, title, startTime = null, endTime = null) {
    const modal = document.getElementById('videoModal');
    const videoContainer = document.getElementById('videoContainer');
    const videoTitle = document.getElementById('videoTitle');
    
    // Store video details for potential replay
    currentVideoDetails = { videoId, title, startTime, endTime };
    
    // Find mission details
    const missionIndex = allMissions.findIndex(m => m.videoId === videoId);
    if (missionIndex !== -1) {
        currentMissionIndex = missionIndex;
    }
    
    videoTitle.textContent = title;
    
    // Clear existing player
    if (window.player && typeof window.player.destroy === 'function') {
        try {
            window.player.destroy();
            window.player = null;
        } catch(e) {
            console.error('Error destroying player:', e);
        }
    }
    
    modal.classList.add('active');
    
    // Reset end screen and speed selector
    document.getElementById('customEndScreen').classList.remove('active');
    document.getElementById('speedSelect').value = '1';
    
    // Update playlist UI
    updatePlaylistUI();
    
    // Create player container
    videoContainer.innerHTML = '<div id="ytplayer" style="width: 100%; height: 100%;"></div>';
    
    // Small delay to ensure DOM is ready
    setTimeout(() => {
        createYouTubePlayer(videoId, startTime, endTime);
    }, 100);
}

// Separate function to create YouTube player with API checking
async function createYouTubePlayer(videoId, startTime, endTime) {
    // Ensure API is loaded first
    if (apiState.status !== 'ready') {
        console.log('API not ready, loading...');
        showApiStatus('loading');
        
        try {
            await loadYouTubeAPI();
        } catch (err) {
            console.error('Failed to load API:', err);
        }
    }
    
    // Check if API is loaded
    if (typeof YT !== 'undefined' && YT.Player && apiState.status === 'ready') {
        console.log('Creating YouTube player with API');
        
        window.player = new YT.Player('ytplayer', {
            width: '100%',
            height: '100%',
            videoId: videoId,
            playerVars: {
                'autoplay': 1,
                'controls': 1,
                'modestbranding': 1,
                'rel': 0,
                'showinfo': 0,
                'fs': 1,
                'loop': 0,
                'start': startTime || 0,
                'end': endTime || undefined,
                'enablejsapi': 1,
                'origin': window.location.origin,
                'playsinline': 1,
                'iv_load_policy': 3,
                'disablekb': 0
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
        
        // Store player globally
        player = window.player;
    } else {
        console.log('YouTube API not loaded, using iframe fallback');
        // Fallback to iframe
        const videoContainer = document.getElementById('videoContainer');
        let embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&origin=${window.location.origin}`;
        if (startTime !== null) {
            embedUrl += `&start=${startTime}`;
        }
        if (endTime !== null) {
            embedUrl += `&end=${endTime}`;
        }
        
        videoContainer.innerHTML = `<iframe id="ytplayer" src="${embedUrl}" style="width: 100%; height: 100%;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        
        // Try to get iframe reference for postMessage API
        setTimeout(() => {
            const iframe = document.getElementById('ytplayer');
            if (iframe) {
                window.playerIframe = iframe;
            }
        }, 500);
    }
}

// YouTube player event handlers
function onPlayerReady(event) {
    console.log('Player ready - speed control enabled');
    // Store player reference
    window.player = event.target;
    player = event.target;
    
    // Load saved speed preference or set default
    const savedSpeed = localStorage.getItem('preferredPlaybackSpeed');
    const initialSpeed = savedSpeed ? parseFloat(savedSpeed) : 1;
    
    try {
        event.target.setPlaybackRate(initialSpeed);
        
        // Update selector to match
        const selector = document.getElementById('speedSelect');
        if (selector) {
            selector.value = initialSpeed.toString();
        }
        
        // Show speed if not default
        if (initialSpeed !== 1) {
            showToast(`Playback speed: ${initialSpeed}x`, 'speed');
            showSpeedIndicator(initialSpeed);
        }
        
        // Get available playback rates
        const rates = event.target.getAvailablePlaybackRates();
        console.log('Available playback rates:', rates);
    } catch(e) {
        console.error('Error setting initial playback rate:', e);
    }
}

function onPlayerStateChange(event) {
    // Check if video ended
    if (event.data == YT.PlayerState.ENDED) {
        console.log('Video ended');
        
        // Check if we should loop (single video mode) or show end screen
        if (playlistMode && playlist.length > 0) {
            // In playlist mode, show end screen which handles auto-advance
            setTimeout(() => {
                showEndScreen();
            }, 500);
        } else {
            // In single video mode, loop the video
            if (currentVideoDetails && window.player && window.player.seekTo) {
                // Loop by seeking back to start time
                const startTime = currentVideoDetails.startTime || 0;
                window.player.seekTo(startTime, true);
                window.player.playVideo();
            } else {
                // Show end screen if we can't loop
                setTimeout(() => {
                    showEndScreen();
                }, 500);
            }
        }
    } else if (event.data == YT.PlayerState.PLAYING) {
        console.log('Video playing');
        // Ensure player reference is set
        if (event.target) {
            window.player = event.target;
            player = event.target;
        }
    }
}

function onPlayerError(event) {
    console.error('Player error:', event.data);
}

function closeVideo() {
    const modal = document.getElementById('videoModal');
    const videoContainer = document.getElementById('videoContainer');
    
    // Destroy YouTube player properly
    if (player && player.destroy) {
        try {
            player.destroy();
            player = null;
        } catch (e) {
            console.error('Error destroying player:', e);
        }
    }
    
    modal.classList.remove('active');
    videoContainer.innerHTML = ''; // Clear container
    clearInterval(checkEndInterval);
    
    // Hide end screen
    document.getElementById('customEndScreen').classList.remove('active');
}

// Custom End Screen Functions
function showEndScreen() {
    const endScreen = document.getElementById('customEndScreen');
    const mission = allMissions[currentMissionIndex];
    
    if (!mission) return;
    
    document.getElementById('endScreenTitle').textContent = `${mission.id}: ${mission.name} Complete!`;
    document.getElementById('endScreenScore').textContent = `Maximum Points: ${mission.points}`;
    
    const nextOptions = document.getElementById('nextOptions');
    nextOptions.innerHTML = '';
    
    // Replay button
    const replayBtn = document.createElement('button');
    replayBtn.textContent = '🔄 Replay Mission';
    replayBtn.onclick = () => {
        document.getElementById('customEndScreen').classList.remove('active');
        playVideo(mission.videoId, `${mission.id}: ${mission.name}`, mission.start, mission.end);
    };
    nextOptions.appendChild(replayBtn);
    
    // Next mission button
    if (currentMissionIndex < allMissions.length - 1) {
        const nextBtn = document.createElement('button');
        const nextMission = allMissions[currentMissionIndex + 1];
        nextBtn.textContent = `➡️ Next: ${nextMission.id}`;
        nextBtn.onclick = () => {
            document.getElementById('customEndScreen').classList.remove('active');
            playVideo(nextMission.videoId, `${nextMission.id}: ${nextMission.name}`, nextMission.start, nextMission.end);
        };
        nextOptions.appendChild(nextBtn);
    }
    
    // View scoring details button
    const detailsBtn = document.createElement('button');
    detailsBtn.textContent = '📋 View Scoring';
    detailsBtn.onclick = () => {
        // Scroll to mission in table
        const missionRow = document.querySelector(`a[data-mission="${mission.id.substring(1)}"]`);
        if (missionRow) {
            closeVideo();
            missionRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };
    nextOptions.appendChild(detailsBtn);
    
    // Back to playlist button
    const playlistBtn = document.createElement('button');
    playlistBtn.textContent = '📋 Back to Playlist';
    playlistBtn.onclick = () => {
        closeVideo();
        togglePlaylist();
    };
    nextOptions.appendChild(playlistBtn);
    
    // Mark as completed
    if (!completedMissions.includes(mission.id)) {
        completedMissions.push(mission.id);
        document.getElementById(`status-${mission.id}`).textContent = '✓';
    }
    
    endScreen.classList.add('active');
    
    // Auto-play next if in playlist mode
    if (playlistMode && playlist.length > 0) {
        const currentInPlaylist = playlist.findIndex(m => m.id === mission.id);
        if (currentInPlaylist !== -1 && currentInPlaylist < playlist.length - 1) {
            setTimeout(() => {
                const nextInPlaylist = playlist[currentInPlaylist + 1];
                document.getElementById('customEndScreen').classList.remove('active');
                playVideo(nextInPlaylist.videoId, `${nextInPlaylist.id}: ${nextInPlaylist.name}`, nextInPlaylist.start, nextInPlaylist.end);
            }, 5000); // Auto-advance after 5 seconds
        }
    }
}

// Toast Notification System
function showToast(message, type = 'info', duration = 2500) {
    // Create container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Add icon based on type
    const icons = {
        'success': '✅',
        'error': '❌',
        'info': 'ℹ️',
        'speed': '⚡'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Remove toast after duration
    setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) {
            container.remove();
        }
    }, duration);
}

// Show speed indicator on video
function showSpeedIndicator(speed) {
    const videoContainer = document.getElementById('videoContainer');
    if (!videoContainer) return;
    
    // Remove existing indicator
    const existing = videoContainer.querySelector('.speed-indicator-overlay');
    if (existing) existing.remove();
    
    // Create new indicator
    const indicator = document.createElement('div');
    indicator.className = 'speed-indicator-overlay';
    indicator.textContent = `${speed}x`;
    videoContainer.appendChild(indicator);
    
    // Remove after animation
    setTimeout(() => indicator.remove(), 2000);
}

// Enhanced Playback Speed Control with Visual Feedback
function changePlaybackSpeed(speed) {
    const speedValue = parseFloat(speed);
    console.log(`Attempting to change speed to ${speedValue}x`);
    
    // Store speed preference in localStorage
    localStorage.setItem('preferredPlaybackSpeed', speed);
    
    // Visual feedback - highlight selector
    const selector = document.getElementById('speedSelect');
    if (selector) {
        selector.classList.add('speed-changed');
        setTimeout(() => selector.classList.remove('speed-changed'), 1000);
    }
    
    let speedChanged = false;
    
    // Try multiple methods to change speed
    
    // Method 1: Use player API if available
    if (window.player && typeof window.player.setPlaybackRate === 'function') {
        try {
            window.player.setPlaybackRate(speedValue);
            
            // Verify the speed was actually changed
            setTimeout(() => {
                if (window.player && typeof window.player.getPlaybackRate === 'function') {
                    const actualSpeed = window.player.getPlaybackRate();
                    if (Math.abs(actualSpeed - speedValue) < 0.01) {
                        showToast(`Playback speed: ${speedValue}x`, 'speed');
                        showSpeedIndicator(speedValue);
                        speedChanged = true;
                    } else {
                        showToast(`Speed change failed. Current: ${actualSpeed}x`, 'error');
                    }
                }
            }, 100);
            
            console.log(`Speed changed to ${speedValue}x via API`);
            return;
        } catch (e) {
            console.error('Error with API method:', e);
        }
    }
    
    // Method 2: Try postMessage to iframe
    const iframe = document.getElementById('ytplayer');
    if (iframe && iframe.contentWindow) {
        try {
            const message = JSON.stringify({
                event: 'command',
                func: 'setPlaybackRate',
                args: [speedValue]
            });
            iframe.contentWindow.postMessage(message, 'https://www.youtube.com');
            console.log(`Speed change command sent via postMessage to ${speedValue}x`);
            
            // Show feedback for postMessage method
            showToast(`Speed command sent: ${speedValue}x`, 'info');
            showSpeedIndicator(speedValue);
            return;
        } catch (e) {
            console.error('Error with postMessage method:', e);
        }
    }
    
    // Method 3: If all else fails, recreate player with new speed
    if (currentVideoDetails) {
        console.log('Attempting to reload video with new speed setting');
        // Store the current time if possible
        let currentTime = 0;
        if (window.player && typeof window.player.getCurrentTime === 'function') {
            try {
                currentTime = window.player.getCurrentTime();
            } catch(e) {}
        }
        
        // Note: This would require modifying the player creation to accept speed parameter
        console.log('Speed control requires API. Please ensure YouTube IFrame API is loaded.');
    }
    
    // If no method worked, show error
    if (!speedChanged) {
        showToast('Unable to change speed. Try reloading the video.', 'error');
    }
    
    console.log('Unable to change playback speed. Check console for details.');
}

// Load saved speed preference
function loadSpeedPreference() {
    const savedSpeed = localStorage.getItem('preferredPlaybackSpeed');
    if (savedSpeed) {
        const selector = document.getElementById('speedSelect');
        if (selector) {
            selector.value = savedSpeed;
            // Apply speed after player is ready
            if (window.player && typeof window.player.setPlaybackRate === 'function') {
                try {
                    window.player.setPlaybackRate(parseFloat(savedSpeed));
                    showToast(`Restored speed: ${savedSpeed}x`, 'info');
                } catch (e) {
                    console.error('Error restoring speed preference:', e);
                }
            }
        }
    }
}

// Playlist Functions
function togglePlaylist() {
    const controls = document.getElementById('playlistControls');
    controls.classList.toggle('active');
    
    if (controls.classList.contains('active')) {
        initializePlaylist();
        updatePlaylistUI();
        // Add click listener to close when clicking outside
        setTimeout(() => {
            document.addEventListener('click', closePlaylistOnOutsideClick);
        }, 100);
    } else {
        // Remove click listener when closing
        document.removeEventListener('click', closePlaylistOnOutsideClick);
    }
}

// Close playlist when clicking outside
function closePlaylistOnOutsideClick(event) {
    const controls = document.getElementById('playlistControls');
    const trigger = document.querySelector('.playlist-trigger');
    
    // Check if click is outside the playlist menu and not on the trigger button
    if (!controls.contains(event.target) && !trigger.contains(event.target)) {
        controls.classList.remove('active');
        document.removeEventListener('click', closePlaylistOnOutsideClick);
    }
}

function updatePlaylistUI() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach(item => {
        const index = parseInt(item.dataset.index);
        item.classList.remove('active');
        if (index === currentMissionIndex) {
            item.classList.add('active');
        }
        if (completedMissions.includes(allMissions[index].id)) {
            item.classList.add('completed');
        }
    });
}

function playMissionFromPlaylist(index) {
    const mission = allMissions[index];
    playVideo(mission.videoId, `${mission.id}: ${mission.name}`, mission.start, mission.end);
    document.getElementById('playlistControls').classList.remove('active');
}

function playAllMissions() {
    playlist = [...allMissions];
    playlistMode = true;
    completedMissions = [];
    
    // Start with first mission
    if (playlist.length > 0) {
        const firstMission = playlist[0];
        playVideo(firstMission.videoId, `${firstMission.id}: ${firstMission.name}`, firstMission.start, firstMission.end);
        document.getElementById('playlistControls').classList.remove('active');
    }
}

function shufflePlaylist() {
    // Fisher-Yates shuffle
    const shuffled = [...allMissions];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    playlist = shuffled;
    playlistMode = true;
    completedMissions = [];
    
    // Start with first shuffled mission
    if (playlist.length > 0) {
        const firstMission = playlist[0];
        playVideo(firstMission.videoId, `${firstMission.id}: ${firstMission.name}`, firstMission.start, firstMission.end);
        document.getElementById('playlistControls').classList.remove('active');
    }
}

function clearPlaylist() {
    playlist = [];
    playlistMode = false;
    completedMissions = [];
    
    // Clear all checkmarks
    allMissions.forEach(mission => {
        const status = document.getElementById(`status-${mission.id}`);
        if (status) status.textContent = '';
    });
    
    // Reset UI
    updatePlaylistUI();
}

// Test function to debug player API
function testPlayerAPI() {
    console.log('=== Testing Player API ===');
    console.log('1. window.player exists?', !!window.player);
    console.log('2. player variable exists?', !!player);
    console.log('3. YT API loaded?', typeof YT !== 'undefined');
    console.log('4. YT.Player exists?', typeof YT !== 'undefined' && !!YT.Player);
    
    if (window.player) {
        console.log('5. Player methods available:');
        console.log('   - setPlaybackRate?', typeof window.player.setPlaybackRate === 'function');
        console.log('   - getPlaybackRate?', typeof window.player.getPlaybackRate === 'function');
        console.log('   - getAvailablePlaybackRates?', typeof window.player.getAvailablePlaybackRates === 'function');
        
        try {
            const currentRate = window.player.getPlaybackRate();
            console.log('6. Current playback rate:', currentRate);
            
            const availableRates = window.player.getAvailablePlaybackRates();
            console.log('7. Available rates:', availableRates);
            
            // Try setting rate to 1.5
            console.log('8. Attempting to set rate to 1.5x...');
            window.player.setPlaybackRate(1.5);
            
            setTimeout(() => {
                const newRate = window.player.getPlaybackRate();
                console.log('9. New rate after change:', newRate);
                if (newRate === 1.5) {
                    console.log('✅ Speed control is working!');
                    alert('Speed control is working! Changed to 1.5x');
                } else {
                    console.log('❌ Speed did not change');
                    alert('Speed control not working - check console');
                }
            }, 500);
        } catch(e) {
            console.error('Error during API test:', e);
        }
    } else {
        console.log('❌ No player object found');
        
        // Check for iframe
        const iframe = document.getElementById('ytplayer');
        console.log('10. iframe exists?', !!iframe);
        if (iframe) {
            console.log('11. iframe src:', iframe.src);
        }
    }
    console.log('=== End Test ===');
}

// Mobile viewport adjustments (removed full-screen behavior)

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    const videoModal = document.getElementById('videoModal');
    const playlistModal = document.getElementById('playlistControls');
    
    // Escape key to close modals
    if (e.key === 'Escape' || e.key === 'Esc') {
        // Close video if it's open
        if (videoModal && videoModal.classList.contains('active')) {
            e.preventDefault();
            closeVideo();
        }
        // Close playlist if it's open
        else if (playlistModal && playlistModal.classList.contains('active')) {
            e.preventDefault();
            togglePlaylist();
        }
    }
    
    // 'E' key to manually trigger end screen (for testing)
    if (e.key === 'e' && videoModal.classList.contains('active')) {
        showEndScreen();
    }
    
    // Space bar to pause/play video (when modal is active)
    if (e.key === ' ' && videoModal.classList.contains('active')) {
        e.preventDefault(); // Prevent page scroll
        if (window.player && typeof window.player.getPlayerState === 'function') {
            const state = window.player.getPlayerState();
            if (state === 1) { // Playing
                window.player.pauseVideo();
            } else if (state === 2) { // Paused
                window.player.playVideo();
            }
        }
    }
});

// Close modal when clicking outside the video
document.getElementById('videoModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeVideo();
    }
});

// Header scroll effect is handled by shared-scripts.js
// Mobile menu is handled by shared-scripts.js

// Handle window resize for PDF viewer
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Only recalculate if PDF modal is open
        const pdfModal = document.getElementById('pdfModal');
        const scrollContainer = document.getElementById('pdfScrollContainer');
        const iframe = document.getElementById('pdfIframe');
        
        if (pdfModal && pdfModal.classList.contains('active') && scrollContainer && iframe) {
            // Update page height multiplier
            const oldMultiplier = pdfPageHeightMultiplier;
            pdfPageHeightMultiplier = getResponsivePageMultiplier();
            
            if (oldMultiplier !== pdfPageHeightMultiplier) {
                // Recalculate iframe height
                const containerHeight = scrollContainer.clientHeight;
                const pageHeight = containerHeight * pdfPageHeightMultiplier;
                const calculatedHeight = Math.ceil(estimatedPDFPages * pageHeight);
                
                iframe.style.height = calculatedHeight + 'px';
                
                // Recalculate current page position
                const scrollTop = scrollContainer.scrollTop;
                const effectivePageHeight = containerHeight * pdfPageHeightMultiplier;
                const scrollProgress = scrollTop + (containerHeight / 2);
                const actualTotalPages = Math.max(
                    estimatedPDFPages,
                    Math.ceil(scrollContainer.scrollHeight / containerHeight)
                );
                
                currentPDFPage = Math.min(
                    Math.max(1, Math.ceil(scrollProgress / effectivePageHeight)),
                    actualTotalPages
                );
                
                updatePageIndicator(actualTotalPages);
                
                console.log(`Resize: Multiplier changed from ${oldMultiplier} to ${pdfPageHeightMultiplier}`);
            }
        }
    }, 250); // Debounce resize events
});

// PDF Modal Functions
let currentPDFUrl = null;
let currentPDFPage = 1;
let estimatedPDFPages = 50; // Default estimate
let pdfPageHeightMultiplier = 1.0; // Store current multiplier

// Get responsive page height multiplier based on screen size
function getResponsivePageMultiplier() {
    if (window.innerWidth <= 480) {
        // Small mobile screens - smaller pages
        return 0.85;
    } else if (window.innerWidth <= 768) {
        // Tablets and larger phones
        return 0.9;
    } else if (window.innerWidth <= 1024) {
        // Small laptops
        return 0.95;
    } else {
        // Desktop
        return 1.0;
    }
}

// Get actual PDF page count using PDF.js
async function getActualPDFPageCount(pdfUrl) {
    try {
        // Load PDF.js if not already loaded
        await window.loadPDFJS();
        
        if (typeof pdfjsLib !== 'undefined') {
            const loadingTask = pdfjsLib.getDocument(pdfUrl);
            const pdf = await loadingTask.promise;
            const pageCount = pdf.numPages;
            console.log('PDF.js: Actual page count is', pageCount);
            return pageCount;
        }
    } catch (error) {
        console.log('Could not get PDF page count:', error);
    }
    return null; // Fallback to dynamic detection
}

async function openPDF(pdfUrl, title) {
    const modal = document.getElementById('pdfModal');
    const pdfContainer = document.getElementById('pdfContainer');
    const pdfTitle = document.getElementById('pdfTitle');
    const downloadLink = document.getElementById('pdfDownloadLink');
    
    // Store current PDF URL
    currentPDFUrl = pdfUrl;
    
    // Start with reasonable estimate
    estimatedPDFPages = 35;
    
    // Set title
    pdfTitle.textContent = title || 'Build Instructions';
    
    // Set download link
    downloadLink.href = pdfUrl;
    const filename = pdfUrl.split('/').pop();
    downloadLink.download = filename;
    
    // Create iframe for PDF with mobile-friendly embedding
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid;
    
    // Reset page counter
    currentPDFPage = 1;
    
    // Clear container first
    pdfContainer.innerHTML = '';
    
    // Create a scrollable container for the PDF
    const scrollContainer = document.createElement('div');
    scrollContainer.style.width = '100%';
    scrollContainer.style.height = '100%';
    scrollContainer.style.overflow = 'auto';
    scrollContainer.style.position = 'relative';
    scrollContainer.id = 'pdfScrollContainer';
    
    // Create iframe element
    const iframe = document.createElement('iframe');
    iframe.id = 'pdfIframe';
    iframe.frameBorder = '0';
    iframe.style.width = '100%';
    
    if (isIOS || isAndroid) {
        // For mobile devices, use Google Docs Viewer
        const encodedUrl = encodeURIComponent(window.location.origin + '/' + pdfUrl);
        iframe.src = `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`;
        
        // Don't set any height - let the iframe size itself
        // This prevents the distortion issue
        iframe.style.width = '100%';
        iframe.style.border = 'none';
        
        // Remove height constraints for mobile
        scrollContainer.style.overflow = 'auto';
        scrollContainer.style.WebkitOverflowScrolling = 'touch';
    } else {
        // For desktop, embed the PDF directly
        iframe.src = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&zoom=page-width`;
        iframe.style.width = '100%';
        iframe.style.border = 'none';
        
        // Start with reasonable height
        iframe.style.minHeight = '100vh';
        iframe.style.height = '3500vh'; // ~35 pages initial
    }
    
    // Add iframe to container
    scrollContainer.appendChild(iframe);
    pdfContainer.appendChild(scrollContainer);
    
    // Enable smooth scrolling
    scrollContainer.style.scrollBehavior = 'smooth';
    scrollContainer.style.webkitOverflowScrolling = 'touch';
    
    // Try to detect PDF load and setup navigation
    iframe.onload = function() {
        console.log('PDF iframe loaded');
        
        // Quick setup without waiting
        requestAnimationFrame(() => {
            const containerHeight = scrollContainer.clientHeight;
            
            // Dynamic height adjustment based on actual content
            if (!isMobile) {
                // For desktop, start with a reasonable height and adjust
                pdfPageHeightMultiplier = getResponsivePageMultiplier();
                
                // Try to detect actual PDF height by checking iframe content
                let actualHeight = 0;
                try {
                    // Check if we can access iframe content (may be blocked by CORS)
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                    if (iframeDoc && iframeDoc.body) {
                        actualHeight = iframeDoc.body.scrollHeight;
                        console.log('Detected actual PDF height:', actualHeight);
                    }
                } catch (e) {
                    console.log('Cannot access iframe content (CORS), using dynamic adjustment');
                }
                
                // Set initial height for desktop
                const pageHeight = containerHeight * 1.1; // 1.1x viewport per page
                const initialHeight = Math.ceil(estimatedPDFPages * pageHeight);
                iframe.style.height = initialHeight + 'px';
                
                console.log(`Desktop - Initial: ${estimatedPDFPages} pages, height: ${initialHeight}px`);
                updatePageIndicator(estimatedPDFPages);
                
                // Load PDF.js in background to get actual page count
                getActualPDFPageCount(pdfUrl).then(actualCount => {
                    if (actualCount) {
                        estimatedPDFPages = actualCount;
                        const accurateHeight = Math.ceil(actualCount * pageHeight);
                        iframe.style.height = accurateHeight + 'px';
                        console.log(`Updated with PDF.js: ${actualCount} pages, height: ${accurateHeight}px`);
                        updatePageIndicator(actualCount);
                    }
                });
            } else {
                // For mobile, let Google Docs Viewer handle its own height
                iframe.style.height = '100vh';
                iframe.style.position = 'fixed';
                iframe.style.top = '0';
                iframe.style.left = '0';
                iframe.style.right = '0';
                iframe.style.bottom = '0';
                
                console.log('Mobile - Using fixed viewport height');
            }
            
            // Force a reflow to ensure proper scroll height calculation
            scrollContainer.style.display = 'none';
            scrollContainer.offsetHeight; // Trigger reflow
            scrollContainer.style.display = '';
            
            // Only add navigation buttons for desktop
            const isMobileDevice = window.innerWidth <= 768;
            
            if (!isMobileDevice) {
                const navButtons = document.createElement('div');
                navButtons.className = 'pdf-nav-buttons';
                navButtons.innerHTML = `
                    <button class="pdf-nav-btn prev" onclick="scrollPDF('prev')" title="Previous Page" disabled>&lt;</button>
                    <button class="pdf-nav-btn next" onclick="scrollPDF('next')" title="Next Page">&gt;</button>
                `;
                pdfContainer.appendChild(navButtons);
            }
            
            // Add page indicator for all devices
            const pageIndicator = document.createElement('div');
            pageIndicator.className = 'pdf-page-indicator';
            pageIndicator.id = 'pdfPageIndicator';
            pdfContainer.appendChild(pageIndicator);
            
            // Add mobile close button
            if (isMobileDevice) {
                const mobileCloseBtn = document.createElement('button');
                mobileCloseBtn.className = 'pdf-mobile-close';
                mobileCloseBtn.innerHTML = '×';
                mobileCloseBtn.onclick = closePDF;
                mobileCloseBtn.setAttribute('aria-label', 'Close PDF');
                pdfContainer.appendChild(mobileCloseBtn);
            }
            
            // Calculate actual total pages after height is set
            const actualTotalPages = Math.max(
                estimatedPDFPages,
                Math.ceil(scrollContainer.scrollHeight / containerHeight)
            );
            
            // Update initial page indicator
            updatePageIndicator(actualTotalPages);
            
            // Setup scroll listener for page tracking
            let scrollTimeout;
            scrollContainer.addEventListener('scroll', function() {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    const scrollTop = this.scrollTop;
                    const containerHeight = this.clientHeight;
                    const scrollHeight = this.scrollHeight;
                    
                    // More accurate page calculation
                    const effectivePageHeight = containerHeight * pdfPageHeightMultiplier;
                    const scrollProgress = scrollTop + (containerHeight / 2); // Use middle of viewport
                    const newPage = Math.min(
                        Math.max(1, Math.ceil(scrollProgress / effectivePageHeight)),
                        actualTotalPages
                    );
                    
                    if (newPage !== currentPDFPage) {
                        currentPDFPage = newPage;
                        updatePageIndicator(actualTotalPages);
                        
                        // Update button states (only for desktop)
                        if (window.innerWidth > 768) {
                            const prevBtn = document.querySelector('.pdf-nav-btn.prev');
                            const nextBtn = document.querySelector('.pdf-nav-btn.next');
                            if (prevBtn) prevBtn.disabled = (currentPDFPage === 1);
                            if (nextBtn) nextBtn.disabled = (currentPDFPage === actualTotalPages);
                        }
                    }
                }, 100); // Debounce scroll events
            });
        }); // Execute on next frame
    };
    
    // Navigation buttons and page indicator will be added after iframe loads
    
    // Modal already shown at the beginning for fast response
}

function closePDF() {
    const modal = document.getElementById('pdfModal');
    const pdfContainer = document.getElementById('pdfContainer');
    
    // Hide modal
    modal.classList.remove('active');
    
    // Clear PDF container completely
    pdfContainer.innerHTML = '';
    
    // Reset current PDF URL and page
    currentPDFUrl = null;
    currentPDFPage = 1;
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Scroll PDF page by page
function scrollPDF(direction) {
    console.log('Navigating PDF:', direction);
    
    const scrollContainer = document.getElementById('pdfScrollContainer');
    
    if (!scrollContainer) {
        console.error('PDF scroll container not found');
        return;
    }
    
    // Get responsive page height multiplier
    pdfPageHeightMultiplier = getResponsivePageMultiplier();
    
    // Calculate page dimensions
    const containerHeight = scrollContainer.clientHeight;
    const effectivePageHeight = containerHeight * pdfPageHeightMultiplier;
    const scrollHeight = scrollContainer.scrollHeight;
    const currentScroll = scrollContainer.scrollTop;
    
    // Use the estimated pages or calculated pages, whichever is larger
    const calculatedPages = Math.ceil(scrollHeight / effectivePageHeight);
    const totalPages = Math.max(estimatedPDFPages, calculatedPages);
    
    // Calculate target page
    let targetPage = currentPDFPage;
    
    if (direction === 'prev' && currentPDFPage > 1) {
        targetPage = currentPDFPage - 1;
    } else if (direction === 'next' && currentPDFPage < totalPages) {
        targetPage = currentPDFPage + 1;
    } else {
        return; // No change needed
    }
    
    // Calculate scroll position for target page
    const targetScroll = (targetPage - 1) * effectivePageHeight;
    const maxScroll = scrollHeight - containerHeight;
    
    // Scroll to target page
    scrollContainer.scrollTo({
        top: Math.min(targetScroll, maxScroll),
        behavior: 'smooth'
    });
    
    // Update current page
    currentPDFPage = targetPage;
    
    // Update page indicator
    updatePageIndicator(totalPages);
    
    // Update navigation button states (only for desktop)
    if (window.innerWidth > 768) {
        const prevBtn = document.querySelector('.pdf-nav-btn.prev');
        const nextBtn = document.querySelector('.pdf-nav-btn.next');
        
        if (prevBtn) prevBtn.disabled = (currentPDFPage === 1);
        if (nextBtn) nextBtn.disabled = (currentPDFPage === totalPages);
    }
    
    console.log(`Page ${currentPDFPage} of ${totalPages}`);
    console.log(`Effective page height: ${effectivePageHeight}px`);
}

// Make function globally accessible
window.scrollPDF = scrollPDF;

// Update page indicator
function updatePageIndicator(totalPages) {
    const indicator = document.getElementById('pdfPageIndicator');
    if (indicator) {
        if (totalPages) {
            indicator.textContent = `Page ${currentPDFPage} of ${totalPages}`;
        } else {
            indicator.textContent = `Page ${currentPDFPage}`;
        }
        indicator.classList.add('active');
        
        // Hide after 2 seconds
        setTimeout(() => {
            indicator.classList.remove('active');
        }, 2000);
    }
}

function openPDFInNewTab() {
    if (currentPDFUrl) {
        window.open(currentPDFUrl, '_blank');
    }
}

function togglePDFFullscreen() {
    const pdfModalContent = document.querySelector('.pdf-modal-content');
    
    if (!document.fullscreenElement) {
        // Enter fullscreen
        if (pdfModalContent.requestFullscreen) {
            pdfModalContent.requestFullscreen();
        } else if (pdfModalContent.webkitRequestFullscreen) { // Safari
            pdfModalContent.webkitRequestFullscreen();
        } else if (pdfModalContent.msRequestFullscreen) { // IE11
            pdfModalContent.msRequestFullscreen();
        }
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE11
            document.msExitFullscreen();
        }
    }
}

// Close PDF modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const pdfModal = document.getElementById('pdfModal');
    if (pdfModal) {
        pdfModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closePDF();
            }
        });
        
        // Add swipe down to close for mobile
        let pdfTouchStartY = 0;
        let pdfTouchEndY = 0;
        
        pdfModal.addEventListener('touchstart', function(e) {
            pdfTouchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        pdfModal.addEventListener('touchend', function(e) {
            pdfTouchEndY = e.changedTouches[0].screenY;
            handlePDFSwipe();
        }, { passive: true });
        
        function handlePDFSwipe() {
            const swipeDistance = pdfTouchEndY - pdfTouchStartY;
            const swipeThreshold = 100; // Minimum swipe distance
            
            // Swipe down to close
            if (swipeDistance > swipeThreshold) {
                closePDF();
            }
        }
    }
});

// Add keyboard shortcuts for PDF modal
document.addEventListener('keydown', function(e) {
    const pdfModal = document.getElementById('pdfModal');
    if (pdfModal && pdfModal.classList.contains('active')) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            e.preventDefault();
            closePDF();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            e.preventDefault();
            scrollPDF('prev');
        } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
            e.preventDefault();
            scrollPDF('next');
        } else if (e.key === 'Home') {
            e.preventDefault();
            const scrollContainer = document.getElementById('pdfScrollContainer');
            if (scrollContainer) {
                currentPDFPage = 1;
                scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
                updatePageIndicator(Math.ceil(scrollContainer.scrollHeight / scrollContainer.clientHeight));
            }
        } else if (e.key === 'End') {
            e.preventDefault();
            const scrollContainer = document.getElementById('pdfScrollContainer');
            if (scrollContainer) {
                const totalPages = Math.ceil(scrollContainer.scrollHeight / scrollContainer.clientHeight);
                currentPDFPage = totalPages;
                scrollContainer.scrollTo({ 
                    top: scrollContainer.scrollHeight - scrollContainer.clientHeight, 
                    behavior: 'smooth' 
                });
                updatePageIndicator(totalPages);
            }
        }
    }
});