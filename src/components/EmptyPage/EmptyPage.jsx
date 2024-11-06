
const EmptyPage = ({ text, height = 'h-[30rem]' }) => {
    return (
        <div className={`${height} flex items-center justify-center`}>
            <p className="text-gray-400 text-xl font-medium mx-auto">
                {text}
            </p>
        </div>
    );
};

export default EmptyPage;