import { useEffect, useRef } from 'react';

const VideoPlayer = ({ videoIds, videoId, setVideoId, handlePrevButton, handleNextButton }) => {
    const cloudinaryRef = useRef();
    const playerRef = useRef();

    useEffect(() => {
        if (!cloudinaryRef.current) {
            cloudinaryRef.current = window.cloudinary;
            playerRef.current = cloudinaryRef.current.videoPlayer(playerRef.current, {
                showLogo: false,
                controls: true,
                playbackRates: [2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25],
                sourceTypes: ['hls'],
                autoplay: true,
                showJumpControls: true,
                hideContextMenu: true                
            });
        }

        // Disable right-click on video element
        const videoElement = document.getElementById('vjs_video_3');
        if (videoElement) {
            const handleContextMenu = (e) => e.preventDefault();
            videoElement.addEventListener('contextmenu', handleContextMenu);

            return () => {
                videoElement.removeEventListener('contextmenu', handleContextMenu);
            };
        }
    }, []);

    useEffect(() => {
        if (playerRef.current && videoId) {
            playerRef.current.source(`https://learning-info-bd.vercel.app/api/v1/upload/video/get/${videoId}`);
            playerRef.current.on('ended', () => {
                setVideoId(videoIds[videoIds.indexOf(videoId) + 1]);
            });
        }
    }, [videoId, videoIds, setVideoId]);

    useEffect(() => {
        const parentDiv = document.querySelector('.vjs-control-bar');
        if (!parentDiv) return;
    
        // Observer to watch for added elements
        const observer = new MutationObserver(() => {
            const prevButtonExists = parentDiv.querySelector('#video-prev');
            const nextButtonExists = parentDiv.querySelector('#video-next');
            const sourceSelector = parentDiv.querySelector('.vjs-http-source-selector');
    
            // Create and insert "Previous" button if not exists
            if (!prevButtonExists) {
                const prevButton = document.createElement('button');
                prevButton.id = 'video-prev';
                prevButton.className = 'vjs-control vjs-playlist-button vjs-button vjs-icon-previous-item';
                prevButton.setAttribute('aria-label', 'Playlist previous item');
                prevButton.setAttribute('aria-disabled', 'false');
                parentDiv.insertBefore(prevButton, parentDiv.firstChild);
            }
    
            // Create and insert "Next" button if not exists
            if (!nextButtonExists) {
                const nextButton = document.createElement('button');
                nextButton.id = 'video-next';
                nextButton.className = 'vjs-control vjs-playlist-button vjs-button vjs-icon-next-item';
                nextButton.setAttribute('aria-label', 'Playlist next item');
                nextButton.setAttribute('aria-disabled', 'false');
                parentDiv.insertBefore(nextButton, parentDiv.children[2]);
            }
    
            // Reorder control bar elements for better UI
            if (sourceSelector) {
                sourceSelector.style.order = 12;  // Ensure the source selector gets its order even if added after the player starts
            }
    
            const reorderControls = [
                '.vjs-icon-skip-10-min', 
                '.vjs-icon-skip-10-plus', 
                '.vjs-playback-rate', 
                '.vjs-http-source-selector',
                '.vjs-fullscreen-control'
            ];
    
            reorderControls.forEach((selector, index) => {
                const control = parentDiv.querySelector(selector);
                if (control) {
                    control.style.order = index + 9;
                }
            });
        });

        const playbackRateControl = parentDiv.querySelector('.vjs-playback-rate');
        if (playbackRateControl) {
            playbackRateControl.style.width = '45px'
        }

        const progressHolder = parentDiv.querySelector('.vjs-progress-holder');
        if (progressHolder) {
            progressHolder.style.background = 'rgba(255, 255, 255, 0.3)'
        }

        const progressBar = parentDiv.querySelector('.vjs-progress-control');
        if (progressBar) {
            progressBar.style.height = '5px'
        }

        const loadProgressBar = parentDiv.querySelector('.vjs-load-progress');
        if (loadProgressBar) {
            loadProgressBar.style.background = 'rgba(255, 255, 255, 0.9)'
        }
        
    
        // Configure the observer to monitor childList changes
        observer.observe(parentDiv, { childList: true, subtree: true });
    
        // Cleanup observer on unmount
        return () => {
            observer.disconnect();
        };
    }, []);
    

    useEffect(() => {
        const prevButton = document.querySelector('#video-prev');
        const nextButton = document.querySelector('#video-next');

        if (prevButton) prevButton.addEventListener('click', handlePrevButton);
        if (nextButton) nextButton.addEventListener('click', handleNextButton);

        // Cleanup event listeners
        return () => {
            if (prevButton) prevButton.removeEventListener('click', handlePrevButton);
            if (nextButton) nextButton.removeEventListener('click', handleNextButton);
        };
    }, [handlePrevButton, handleNextButton]);

    return (
        <video
            ref={playerRef}
            className="w-full h-[30rem] vjs-playlist"
        />
    );
};

export default VideoPlayer;