import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import GenerateStar from '../../components/GenerateStar/GenerateStar';
import InstructorsLoadingSkeleton from './InstructorsLoadingSkeleton';
import generateImageLink from '../../utils/generateImageLink';
import api from '../../services/baseAPI';
import Title from '../../components/Title/Title';

const Instructors = () => {
    const { data: instructors = [], isLoading } = useQuery({
        queryKey: ['instructor'],
        queryFn: async () => {
            const res = await api.get('/instructor/all')
            return res.data
        }
    })
    return (
        <div>
            <Title title={'Instructors'}/>
            {
                <div className='lg-container'>
                    <h2 className="text-left text-lg font-semibold px-4 py-6 ">Instructors</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-x-6 px-3 md:px-4">
                        {isLoading
                            ?
                            <InstructorsLoadingSkeleton />
                            :
                            instructors.map((instructorData, index) =>
                                <InstructorCard
                                    key={index}
                                    instructorData={instructorData}
                                />
                            )
                        }
                    </div>
                </div>
            }
        </div>
    );
};

const InstructorCard = ({ instructorData }) => {
    const { _id, name, image, headline, rating } = instructorData;
    return (
        <Link to={`/instructor/${_id}`}>
            <div
                className={`w-full h-[19rem] rounded-lg overflow-hidden duration-300 border hover:shadow-md`}
            >
                {/* Instructor Image */}
                <figure className="w-full">
                    <img
                        src={generateImageLink({ imageId: image, width: 400 })}
                        alt="instructor"
                        className={`w-full h-48 object-cover object-top mx-auto`}
                    />
                </figure>

                {/* Instructor Details */}
                <article className={`p-4 space-y-1`}>
                    {/* Instructor Name */}
                    <h2 className="text-gray-700 font-medium truncate">
                        {name}
                    </h2>

                    {/* Instructor Headline */}
                    <p className="truncate">{headline}</p>

                    {/* Instructor Rating */}
                    <p className="flex items-center gap-2 font-medium">
                        {rating ? rating : <span className='font-normal'>Not rated yet</span>}
                        <GenerateStar fill={'#FEC84B'} />
                    </p>
                </article>
            </div>
        </Link>
    );
};
export default Instructors;