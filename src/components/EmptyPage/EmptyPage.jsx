import { useNavigate } from "react-router-dom";

const EmptyPage = ({ text, height = 'h-[30rem]', btn = false, btnText = "Keep shopping" }) => {
    const navigate = useNavigate();
    return (
        <div className={`${height} flex flex-col gap-y-6 items-center justify-center`}>
            <p className="text-gray-400 sm:text-lg md:text-xl font-medium text-center">
                {text}
            </p>
            {
                btn &&
                <button onClick={() => navigate('/courses')} className="btn btn-md normal-case text-xs sm:text-sm md:text-base bg-black hover:bg-black hover:bg-opacity-80 duration-300 text-white py-2 rounded-md">
                    {btnText}
                </button>
            }
        </div>
    );
};

export default EmptyPage;