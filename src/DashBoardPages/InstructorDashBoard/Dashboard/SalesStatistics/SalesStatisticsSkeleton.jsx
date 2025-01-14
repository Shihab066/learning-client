import GraphIncrease from "../../../../components/Icons/GraphIncrease";

const SalesStatisticsSkeleton = () => {
    return (
        <div>
            <div className="flex flex-col lg:flex-row items-start gap-6 mt-6 md:mt-8 h-fit">

                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-col gap-x-4 gap-y-5 w-full lg:w-fit lg:min-w-[330px]">

                    <div className="w-full h-fit rounded-md bg-gray-50 px-6 py-8">
                        <div className="flex flex-col gap-y-2 animate-pulse">
                            <div className="w-[70%] h-2 rounded-full bg-gray-300" />
                            <div className="w-[80%] h-2 rounded-full bg-gray-300" />
                            <div className="w-[90%] h-2 rounded-full bg-gray-300" />
                            <div className="w-[100%] h-2 rounded-full bg-gray-300" />
                        </div>
                    </div>

                    <div className="w-full h-fit rounded-md bg-gray-50 px-6 py-8">
                        <div className="flex flex-col gap-y-2 animate-pulse">
                            <div className="w-[70%] h-2 rounded-full bg-gray-300" />
                            <div className="w-[80%] h-2 rounded-full bg-gray-300" />
                            <div className="w-[90%] h-2 rounded-full bg-gray-300" />
                            <div className="w-[100%] h-2 rounded-full bg-gray-300" />
                        </div>
                    </div>

                    <div className="w-full h-fit rounded-md bg-gray-50 px-6 py-8">
                        <div className="flex flex-col gap-y-2 animate-pulse">
                            <div className="w-[70%] h-2 rounded-full bg-gray-300" />
                            <div className="w-[80%] h-2 rounded-full bg-gray-300" />
                            <div className="w-[90%] h-2 rounded-full bg-gray-300" />
                            <div className="w-[100%] h-2 rounded-full bg-gray-300" />
                        </div>
                    </div>
                </div>

                <div className="w-full h-[400px] bg-gray-50 rounded-md">
                    <div className="w-full h-full flex items-center justify-center text-gray-300 animate-pulse">
                        <GraphIncrease width='[50%]' />
                    </div>
                </div>
            </div>

            <div className="w-full h-[400px] bg-gray-50 rounded-md mt-10">
                <div className="w-full h-full flex items-center justify-center text-gray-300 animate-pulse">
                    <GraphIncrease width='[50%]' />
                </div>
            </div>
        </div>
    )
};


export default SalesStatisticsSkeleton;