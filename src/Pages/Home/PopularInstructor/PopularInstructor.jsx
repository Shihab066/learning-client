import axios from "axios";
import PopularInstructorSkeleton from "../../../components/PopularInstructorsSkeleton.jsx/PopularInstructorSkeleton";
import { useQuery } from "@tanstack/react-query";

const PopularInstructor = () => {  

    // Fetch popular instructor data
    const { data: instructors = [], isLoading } = useQuery({
        queryKey: ['popularInstructor'],
        queryFn: async () => {
            const res = await axios.get(`https://learning-info-bd.vercel.app/topinstructors`);            
            return res.data;
        },
    });

    return (
        <div className="lg-container">
            <h2 className="text-center font-semibold mt-16 lg:mt-20 xl:mt-32 mb-10 xs:text-xl md:text-2xl lg:text-3xl">
                Popular Instructors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 xl:gap-y-10 sm:px-2 2xl:px-0">
                {isLoading
                    ?
                    <PopularInstructorSkeleton />
                    :
                    instructors.length > 0
                        ?
                        instructors?.map((instructor) => (
                            <PopularInstructorCard key={instructor._id} item={instructor} />
                        ))
                        :
                        <p>No instructors found.</p>
                }
            </div>
        </div>
    );
};

const PopularInstructorCard = ({ item }) => {
    const { name, email, image } = item;

    return (
        <div className="flex justify-center">
            <div className="relative card w-[95%] xl:w-[90%] shadow-xl">
                {/* Instructor Image */}
                <figure className="overflow-hidden bg-base-200 h-[12.5rem] md:h-[15rem] lg:h-[12.5rem] xl:h-[15.938rem]">
                    <img
                        src={image}
                        alt={`${name}'s Profile`}
                        className="w-full h-full object-cover hover:scale-105 ease-linear duration-300"
                    />
                </figure>

                {/* Instructor Details */}
                <div className="px-4 py-6 lg:p-8 card-body">
                    {/* Instructor Name */}
                    <h2
                        className="font-semibold text-[.875rem] sm:text-base lg:text-xl truncate mb-auto"
                        title={name}
                    >
                        {name}
                    </h2>

                    {/* Instructor Email */}
                    <span
                        className="text-gray-500 text-[0.813rem] lg:text-sm xl:text-base truncate"
                        title={email}
                    >
                        E-mail: {email}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PopularInstructor;
