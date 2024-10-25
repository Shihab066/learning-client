import { useEffect, useRef } from 'react';

const VideoPlayer = () => {
    const cloudinaryRef = useRef();
    const videoRef = useRef();
    useEffect(() => {
        if (cloudinaryRef.current) return;
        cloudinaryRef.current = window.cloudinary;
        const player = cloudinaryRef.current.videoPlayer(videoRef.current, {
            // publicId: 'marmots_ldynjp',
            cloud_name: 'demo',
            showLogo: false,
            // secure: true,
            // autoplay: true,
            // sourceTypes: ['hls'],
            // transformation: [{ streaming_profile:  "auto"  }],
            // analytics: {
            //     events: true
            // },
            // videoJS: {
            //     sources: [{
            //         // src: 'https://res.cloudinary.com/demo/video/upload/sp_auto/v1729869034/marmots_intirm.m3u8',
            //         type: 'application/x-mpegURL'
            //     }]
            // }
        })

        // Set the source to the HLS stream
        // player.source('https://res.cloudinary.com/demo/video/upload/sp_auto/marmots_amvru3.m3u8?_s=vp-2.1.0', {


        // });
        
        player.source('https://res.cloudinary.com/demo/video/upload/sp_auto/snow_deer_t5xihe/2.m3u8?cld-content-marker=hlssub', {
            sourceTypes: [
              'hls'
            ]
          });
    }, []);
    return (
        <video
            // data-cld-source-types='["hls"]'
            
            ref={videoRef}
            controls
        />
    );
};

export default VideoPlayer;