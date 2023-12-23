import axios from 'axios';
import ClassCard from '../../components/ClassCard/ClassCard';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';

const Instructors = () => {
    const { data: instructors = [], isLoading } = useQuery({
        queryKey: ['instructor'],
        queryFn: async () => {
            const res = await axios.get('https://learning-info-bd.vercel.app/instructors')
            return res.data
        }
    })
    return (
        <div>
            <Helmet>
                <title>Learning Point_instructors</title>
            </Helmet>
            {isLoading ? <div className='flex justify-center items-center h-[700px] ' >
                <span className="loading loading-spinner text-info loading-lg"></span>
            </div > :
                <div>
                    <h2 className="mt-10 sm:mt-12 lg:mt-20 mb-10 text-center text-4xl font-semibold">Instructors</h2>
                    <div className="lg-container grid grid-cols-2 md:grid-cols-3 gap-y-10">
                        {instructors.map(instructorData => <ClassCard
                            key={instructorData._id}
                            item={instructorData}
                            overlay={false}
                            cardForClass={false}
                        ></ClassCard>)}
                    </div>
                </div>
            }
        </div>
    );
};

export default Instructors;