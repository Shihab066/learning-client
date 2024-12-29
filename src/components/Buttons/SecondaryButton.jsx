
const SecondaryButton = ({ text = 'Secondary Btn', ...props }) => {
    return (
        <button
            className={`bg-white hover:bg-base-300 text-black border border-black rounded-none px-4 py-2 font-bold text-sm select-none`}
            {...props}
        >
            {text}
        </button>
    );
};

export default SecondaryButton;