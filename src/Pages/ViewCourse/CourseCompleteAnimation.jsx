import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useNavigate } from 'react-router-dom';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';

const CourseCompleteAnimation = ({ setAutoPlay }) => {
    const [showAnimation, setShowAnimation] = useState(true);
    const navigate = useNavigate();

    // Get current screen dimensions for confetti size
    const width = window.innerWidth - 6;
    const height = window.innerHeight;

    // Handle 'Watch Again' button click
    const handleWatchAgain = () => {
        setShowAnimation(false);
        setAutoPlay(true);
    };

    const [audio, setAudio] = useState(null);

    useEffect(() => {
        const soundTracks = ["track1", "track2"];
        const currentSoundTrack = soundTracks[Math.floor(Math.random() * 2)];
        const audioUrl = `/audio/course_success_${currentSoundTrack}.mp3`;

        fetch(audioUrl)
            .then((response) => response.blob())
            .then((blob) => {
                const objectURL = URL.createObjectURL(blob);
                const welcomeAudio = new Audio(objectURL);                
                setAudio(welcomeAudio);               
            })
            .catch((error) => console.error("Error loading audio:", error));
    }, [showAnimation]);

    useEffect(() => {
        if (audio) {
            audio.volume = 0.5;
            if (showAnimation) {
                audio.play()
            }
        }

        return () => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
                URL.revokeObjectURL(audio.src);
            }
        };

    }, [audio, showAnimation])

    return (
        <>
            {/* Scroll to Top Component */}
            <ScrollToTop />

            {/* Confetti Animation */}
            <Confetti
                width={width}
                height={height}
                numberOfPieces={showAnimation ? 600 : 0}
                gravity={0.05}
            />

            {/* Course Completion Modal */}
            <div
                role="dialog"
                className={`modal ${showAnimation ? 'modal-open' : ''} bg-[rgba(0,0,0,0.05)!important]`}
            >
                <div className="modal-box py-[3rem!important] rounded">
                    <h3 className="text-center text-lg font-medium">🎉 Congratulations! 🎓</h3>
                    <p className="py-4 text-center">
                        You&apos;ve successfully completed the course
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-2">
                        {/* View My Classes Button */}
                        <button
                            onClick={() => navigate('/my-classes')}
                            className="px-4 py-2 font-medium text-white bg-black border border-black rounded-md hover:bg-opacity-80"
                        >
                            📚 View My Classes
                        </button>

                        {/* Watch Again Button */}
                        <button
                            onClick={handleWatchAgain}
                            className="px-4 py-2 font-medium text-white bg-black border border-black rounded-md hover:bg-opacity-80"
                        >
                            🔄 Watch Again
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseCompleteAnimation;