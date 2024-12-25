const InstructorIcon = ({ width = 6 }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 12 12"
            className={`w-${width}`}
        >
            <path fill="currentColor" d="M7.5 5.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0M1 3.5A1.5 1.5 0 0 1 2.5 2h7A1.5 1.5 0 0 1 11 3.5v5A1.5 1.5 0 0 1 9.5 10h-7A1.5 1.5 0 0 1 1 8.5zM8 9h1.5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5H4v-.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1z"></path>
        </svg>
    );
};

export default InstructorIcon;