import { useEffect, useRef } from 'react';

const VideoPlayer = ({ videoId }) => {
    const cloudinaryRef = useRef();
    const videoRef = useRef();
    const playerRef = useRef(); // To store the player instance

    useEffect(() => {
        if (!cloudinaryRef.current) {
            cloudinaryRef.current = window.cloudinary;
            playerRef.current = cloudinaryRef.current.videoPlayer(videoRef.current, {
                showLogo: false,
                controls: true,
                playbackRates: [2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25],
                sourceTypes: ['hls'],
                autoplay: true
            });
        }
    }, []); // Run only once to initialize the player

    useEffect(() => {
        if (playerRef.current && videoId) {
            playerRef.current.source(`https://learning-info-bd.vercel.app/api/v1/upload/video/get/${videoId}`);
        }
    }, [videoId]); // Run whenever videoId changes

    return (
        <video
            ref={videoRef}
            className="w-full h-[30rem]"
        />
    );
};

export default VideoPlayer;