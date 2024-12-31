
const PrimaryButton = ({ text = 'Primary Btn', customClass, ...props }) => {
    return (
        <button
            className={`bg-black hover:bg-opacity-80 text-white border border-black rounded-none px-4 py-2 font-bold text-sm select-none ${customClass}`}
            {...props}
        >
            {text}
        </button>
    );
};

export default PrimaryButton;