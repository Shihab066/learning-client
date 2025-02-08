const InstructorProfileSkeleton = () => {
    return (
        <>
            <section className="lg-container px-4 lg:px-6 md:flex justify-between items-start lg:gap-x-44 xl:gap-x-60 pt-10">
                <section className="text-gray-700 space-y-6">
                    <article className="space-y-6">
                        <section>
                            <div className="space-y-2">
                                <div className="w-[10rem] h-3 skeleton rounded" />
                                <div className="w-[12rem] h-3 skeleton rounded" />
                                <div className="w-[10rem] h-3 skeleton rounded" />
                            </div>
                            <div className="flex items-end gap-x-4 mt-8">
                                <article className="space-y-2">
                                    <div className="w-[10rem] h-4 skeleton rounded" />
                                    <div className="w-[8rem] h-4 skeleton rounded" />
                                </article>

                                <article className="space-y-2 hidden sm:block">
                                    <div className="w-[10rem] h-4 skeleton rounded" />
                                    <div className="w-[8rem] h-4 skeleton rounded" />
                                </article>

                                <article className="space-y-2 hidden sm:block">
                                    <div className="w-[10rem] h-4 skeleton rounded" />
                                    <div className="w-[8rem] h-4 skeleton rounded" />
                                </article>
                            </div>
                        </section>
                        <InstructorProfileAside
                            visibilityInfo={'block md:hidden'}
                        />
                    </article>

                    <article className="space-y-4">
                        <div className="w-[15rem] h-4 skeleton rounded" />
                        <div className="space-y-2">
                            <div className="w-full h-2 skeleton rounded" />
                            <div className="w-full h-2 skeleton rounded" />
                            <div className="w-full h-2 skeleton rounded" />
                            <div className="w-full h-2 skeleton rounded" />
                            <div className="w-full h-2 skeleton rounded" />
                            <div className="w-full h-2 skeleton rounded" />
                        </div>
                    </article>

                    <article className="space-y-4">
                        <div className="w-[15rem] h-4 skeleton rounded" />
                        <div className="space-y-2">
                            <div className="w-[12rem] h-2 skeleton rounded" />
                            <div className="w-[12rem] h-2 skeleton rounded" />
                            <div className="w-[12rem] h-2 skeleton rounded" />
                            <div className="w-[12rem] h-2 skeleton rounded" />
                            <div className="w-[12rem] h-2 skeleton rounded" />
                            <div className="w-[12rem] h-2 skeleton rounded" />
                        </div>
                    </article>

                    <article className="space-y-4">
                        <div className="w-[15rem] h-4 skeleton rounded" />
                        <div className="space-y-2">
                            <div className="w-full h-2 skeleton rounded" />
                            <div className="w-full h-2 skeleton rounded" />
                            <div className="w-full h-2 skeleton rounded" />
                            <div className="w-full h-2 skeleton rounded" />
                            <div className="w-full h-2 skeleton rounded" />
                            <div className="w-full h-2 skeleton rounded" />
                        </div>
                    </article>
                </section>

                <InstructorProfileAside
                    visibilityInfo={'hidden md:block'}
                />
            </section>
        </>
    );
};

const InstructorProfileAside = ({ visibilityInfo }) => {
    return (
        <aside className={`flex flex-col justify-start items-center gap-x-14 space-y-4 md:space-y-6 ${visibilityInfo} `}>
            <figure className="w-40 h-40 md:w-[12.5rem] md:h-[12.5rem]">
                <div className="w-full h-full rounded-full skeleton" />
            </figure>
            <ul className="flex md:block md:space-y-2 flex-wrap justify-center items-center gap-4">
                <div className="w-[10rem] md:w-full h-7 rounded skeleton" />
                <div className="w-[10rem] md:w-full h-7 rounded skeleton" />
                <div className="w-[10rem] md:w-full h-7 rounded skeleton" />
                <div className="w-[10rem] md:w-full h-7 rounded skeleton" />
                <div className="w-[10rem] md:w-full h-7 rounded skeleton" />
            </ul>
        </aside>
    )
}

export default InstructorProfileSkeleton;