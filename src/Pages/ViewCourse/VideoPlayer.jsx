import { useEffect, useRef } from 'react';
import useAuth from '../../hooks/useAuth';

const VideoPlayer = ({ courseId, videoId, handlePrevButton, handleNextButton, handleExpandView, autoPlay }) => {
    const { jwtToken } = useAuth();
    const cloudinaryRef = useRef();
    const playerRef = useRef();
    const prevVideoId = useRef();

    useEffect(() => {
        if (!cloudinaryRef.current) {
            cloudinaryRef.current = window.cloudinary;
            playerRef.current = cloudinaryRef.current.videoPlayer(playerRef.current, {
                showLogo: false,
                controls: true,
                playbackRates: [2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25],
                sourceTypes: ['hls'],
                showJumpControls: true,
                hideContextMenu: true
            });
        }

        // Disable right-click on video element
        const playerElement = document.querySelector('.video-container').firstChild;
        const videoElement = document.getElementById('video-element-container');
        if (playerElement) {
            playerElement.volume = 0.5;
        }

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
            if (prevVideoId.current !== videoId) {
                playerRef.current.source(`https://learning-info-bd.vercel.app/api/v1/upload/video/get/${courseId}/${videoId}/${jwtToken}`)
                // playerRef.current.source(`https://www.youtube.com/watch?v=-Vm7TdJWFOQ`)
            }
            prevVideoId.current = videoId
            playerRef.current.on('ended', () => {
                handleNextButton()
            });
        }
    }, [videoId, handleNextButton]);

    useEffect(() => {
        const parentDiv = document.querySelector('.vjs-control-bar');
        if (!parentDiv) return;

        // Observer to watch for added elements
        const observer = new MutationObserver(() => {
            const prevButtonExists = parentDiv.querySelector('#video-prev');
            const nextButtonExists = parentDiv.querySelector('#video-next');
            const expandView = parentDiv.querySelector('#expand-view');
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

            if (!expandView) {
                const expandViewButton = document.createElement('div');
                expandViewButton.style.order = 12;
                expandViewButton.classList.add('hidden')
                expandViewButton.classList.add('lg:block')
                expandViewButton.innerHTML = `
                <button id='expand-view' class="hidden opacity-80 hover:opacity-100 my-auto h-full mx-2" title='Expand view'>
                    <svg xmlns="http://www.w3.org/2000/svg" class='w-[31px] my-auto' viewBox="0 0 24 24"><path fill="#fff" d="M2 4v16h20V4zm18 14H4V6h16z"></path></svg>
                <button>
                `;
                parentDiv.insertBefore(expandViewButton, parentDiv.lastChild);
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
            progressBar.addEventListener('mouseover', () => {
                progressBar.style.height = '5px';
            });

            progressBar.addEventListener('mouseout', () => {
                progressBar.style.height = '';
            });
        }

        const loadProgressBar = parentDiv.querySelector('.vjs-load-progress');
        if (loadProgressBar) {
            loadProgressBar.style.background = 'rgba(255, 255, 255, 0.7)'
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
        const expandView = document.querySelector('#expand-view');

        if (prevButton) prevButton.addEventListener('click', handlePrevButton);
        if (nextButton) nextButton.addEventListener('click', handleNextButton);
        if (expandView) expandView.addEventListener('click', handleExpandView);

        // Cleanup event listeners
        return () => {
            if (prevButton) prevButton.removeEventListener('click', handlePrevButton);
            if (nextButton) nextButton.removeEventListener('click', handleNextButton);
            if (expandView) expandView.removeEventListener('click', handleExpandView);
        };
    }, [handlePrevButton, handleNextButton, handleExpandView]);

    useEffect(() => {
        const handleResize = () => {
            const bodyWidth = window.innerWidth;
            const playerElement = document.querySelector('.video-container');
            const replayBtn = document.querySelector('.vjs-icon-replay-10');
            const forwardBtn = document.querySelector('.vjs-icon-forward-10');
            const playBtn = document.querySelector('.vjs-big-play-button');

            if (!playerElement) return;

            if (bodyWidth < 576) {
                playerElement.classList.remove('vjs-playlist');
                replayBtn.style.display = 'none';
                forwardBtn.style.display = 'none';
                playBtn.style.fontSize = '3em';
            } else {
                playerElement.classList.add('vjs-playlist');
                replayBtn.style.display = 'block';
                forwardBtn.style.display = 'block';
                playBtn.style.fontSize = '5em';
            }
        };
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className='w-full aspect-video' id='video-element-container'>
            <video
                ref={playerRef}
                className={`w-full h-full video-container`}
                autoPlay={autoPlay}
            />
        </div>
    );
};

export default VideoPlayer;