import { NavLink, Outlet } from "react-router-dom";
import Title from "../../../components/Title/Title";

const MyReviews = () => {
    return (
        <>
            <Title title={'My Reviews'}/>
            <section className="w-full overflow-hidden lg:px-2 xl:px-0">
                <div>
                    <h2 className="text-xl font-medium">
                        My Reviews
                    </h2>
                </div>

                <div className="my-6 pb-3 border-b flex justify-start gap-x-6">
                    <NavLink to='pending-reviews' className='group text-gray-500 font-medium'>
                        {({ isActive }) => (
                            <>
                                To Be Reviewed
                                <div className={`${isActive ? 'w-full' : 'w-0'} group-hover:w-full h-[2px] duration-300 bg-black`}></div>
                            </>
                        )}
                    </NavLink>

                    <NavLink to='reviews-history' className='group text-gray-500 font-medium'>
                        {({ isActive }) => (
                            <>
                                History
                                <div className={`${isActive ? 'w-full' : 'w-0'} group-hover:w-full h-[2px] duration-300 bg-black`}></div>
                            </>
                        )}
                    </NavLink>
                </div>

                <Outlet />
            </section>
        </>
    );
};

export default MyReviews;