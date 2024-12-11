import { useEffect, useRef, useState } from 'react';
// import 'cloudinary-video-player/playlist';

const VideoPlayer = ({ videoIds, videoId, setVideoId, handlePrevButton, handleNextButton }) => {
    const cloudinaryRef = useRef();
    const playerRef = useRef();

    const playlist = ['https://learning-info-bd.vercel.app/api/v1/upload/video/get/wgs3rcdhgngvd2rei3pw', 'https://learning-info-bd.vercel.app/api/v1/upload/video/get/z6udvua8go4ck8ahdpwi'];
    // const playlist = [
    //     { publicId: "https://learning-info-bd.vercel.app/api/v1/upload/video/get/wgs3rcdhgngvd2rei3pw", title: "Video 1", type: "application/x-mpegURL" },
    //     { publicId: "https://learning-info-bd.vercel.app/api/v1/upload/video/get/z6udvua8go4ck8ahdpwi", title: "Video 2", type: "application/x-mpegURL" },
    // ];

    // const videoIds = [
    //     "wgs3rcdhgngvd2rei3pw",
    //     "z6udvua8go4ck8ahdpwi",
    //     "jfwnszwqwrmg4dwjh8a6",
    //     "j8lvppkgnnkxjkm8ct7y"
    // ]    

    // console.log(playerRef.current.plugins);
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
                hideContextMenu: true,
            });

            // playerRef.current.playlist(playlist);
        }

        // Get the video element and disable right-click
        const videoElement = document.getElementById("vjs_video_3");
        if (videoElement) {
            const handleContextMenu = (e) => {
                e.preventDefault();
            };

            videoElement.addEventListener("contextmenu", handleContextMenu);

            return () => {
                videoElement.removeEventListener("contextmenu", handleContextMenu);
            };
        }
    }, []);

    useEffect(() => {
        console.log('video effect')
        if (playerRef.current && videoId) {
            playerRef.current.source(`https://learning-info-bd.vercel.app/api/v1/upload/video/get/${videoId}`);
            // playerRef.current.playlist(playlist);
            playerRef.current.on("ended", () => {
                // Automatically play the next video
                console.log('video end')
                setVideoId(videoIds[videoIds.indexOf(videoId) + 1])
            });
        }
    }, [videoId]);

    useEffect(() => {
        // Select the parent div
        const parentDiv = document.querySelector('.vjs-control-bar');

        if (!parentDiv) return; // Ensure the parent div exists

        // Check if buttons are already added
        const prevButtonExists = parentDiv.querySelector('#video-prev');
        const nextButtonExists = parentDiv.querySelector('#video-next');

        if (!prevButtonExists) {
            // Create the "Previous" button
            const prevButton = document.createElement('button');
            prevButton.id = 'video-prev';
            prevButton.className = 'vjs-control vjs-playlist-button vjs-button vjs-icon-previous-item';
            prevButton.setAttribute('aria-label', 'Playlist previous item');
            prevButton.setAttribute('aria-disabled', 'false');

            // Insert the first child at the beginning
            const firstChild = parentDiv.firstChild; // Get the current first child
            parentDiv.insertBefore(prevButton, firstChild);
        }

        if (!nextButtonExists) {
            // Create the "Next" button
            const nextButton = document.createElement('button');
            nextButton.id = 'video-next';
            nextButton.className = 'vjs-control vjs-playlist-button vjs-button vjs-icon-next-item';
            nextButton.setAttribute('aria-label', 'Playlist next item');
            nextButton.setAttribute('aria-disabled', 'false');

            // Insert the third child at the third position
            const secondChild = parentDiv.children[2]; // Get the current third position (index starts from 0)
            parentDiv.insertBefore(nextButton, secondChild);
        }

        const reverseButton = parentDiv.querySelector('.vjs-icon-skip-10-min');
        const forwardButton = parentDiv.querySelector('.vjs-icon-skip-10-plus');
        const playbackRate = parentDiv.querySelector('.vjs-playback-rate');
        const sourceSelector = parentDiv.querySelector('.vjs-http-source-selector');
        const fullscreenButton = parentDiv.querySelector('.vjs-fullscreen-control');

        if (reverseButton && forwardButton && sourceSelector && playbackRate && fullscreenButton) {
            reverseButton.style.order = 9
            forwardButton.style.order = 10
            playbackRate.style.order = 11
            playbackRate.style.width = '45px'
            sourceSelector.style.order = 12
            fullscreenButton.style.order = 13
        }
    }, [])

    useEffect(() => {
        const prevButton = document.querySelector('#video-prev');
        const nextButton = document.querySelector('#video-next');

        if (prevButton) prevButton.addEventListener('click', handlePrevButton);
        if (nextButton) nextButton.addEventListener('click', handleNextButton);

        // Cleanup event listeners on unmount
        return () => {
            if (prevButton) prevButton.removeEventListener('click', handlePrevButton);
            if (nextButton) nextButton.removeEventListener('click', handleNextButton);
        };
    }, [handleNextButton, handlePrevButton]);


    return (
        <>
            <video
                ref={playerRef}
                className="w-full h-[30rem] vjs-playlist"
            />
        </>
    );
};

export default VideoPlayer;