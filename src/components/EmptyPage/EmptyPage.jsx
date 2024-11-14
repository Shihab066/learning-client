import { useNavigate } from "react-router-dom";

const EmptyPage = ({ text, height = 'h-[30rem]', btn = false, btnText = "Keep shopping" }) => {
  const navigate = useNavigate();
  return (
    <div className={`${height} flex flex-col gap-y-6 items-center justify-center`}>
      <p className="font-medium text-center text-gray-400 sm:text-lg md:text-xl">
        {text}
      </p>
      {
        btn &&
        <button onClick={() => navigate('/courses')} className="bg-black hover:bg-black hover:bg-opacity-80 py-2 rounded-md text-white text-xs sm:text-sm md:text-base normal-case duration-300 btn btn-md">
          {btnText}
        </button>
      }
    </div>
  );
};

export default EmptyPage;