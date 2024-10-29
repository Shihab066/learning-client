import { useEffect, useRef } from 'react';

const VideoPlayer = () => {
    const cloudinaryRef = useRef();
    const videoRef = useRef();
    useEffect(() => {
        if (cloudinaryRef.current) return;
        cloudinaryRef.current = window.cloudinary;
        const player = cloudinaryRef.current.videoPlayer(videoRef.current, {            
            showLogo: false,  
            controls: true,
            playbackRates: [2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25],            
            sourceTypes: ['hls'],
            
        })        

        player.source("https://learning-info-bd.vercel.app/api/v1/upload/video/get/ewqgnwr8agoltbtqjzj8");
    }, []);
    return (
        <video
            ref={videoRef}                             
            width={'540px'}
            height={'360px'}            
        />
    );
};

export default VideoPlayer;