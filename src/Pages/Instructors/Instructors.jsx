import axios from 'axios';
import ClassCard from '../../components/ClassCard/ClassCard';
import { useQuery } from '@tanstack/react-query';

const Instructors = () => {
    const { data: instructors = [], isLoading } = useQuery({
        queryKey: ['instructor'],
        queryFn: async () => {
            const res = await axios.get('https://summer-camp-school-server-zeta.vercel.app/instructors')
            return res.data
        }
    })
    return (
        <div>
            {isLoading ? <div className='flex justify-center items-center h-[700px] ' >
                <span className="loading loading-spinner text-info loading-lg"></span>
            </div > :
                <div>
                    <h2 className="mt-20 mb-10 text-center text-4xl font-semibold">Instructors</h2>
                    <div className="lg-container grid md:grid-cols-3 gap-y-10">
                        {instructors.map(instructorData => <ClassCard
                            key={instructorData._id}
                            item={instructorData}
                            overlay={false}
                        ></ClassCard>)}
                    </div>
                </div>
            }
        </div>
    );
};

export default Instructors;