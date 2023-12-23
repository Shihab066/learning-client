import axios from 'axios';
import ClassCard from '../../components/ClassCard/ClassCard';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';


const Classes = () => {
    const { user } = useAuth();
    const email = user?.email;
    const [axiosSecure] = useAxiosSecure();
    const navigate = useNavigate();  
    const { data: classes = [], isLoading } = useQuery({
        queryKey: ['classes'],
        queryFn: async () => {
            const res = await axios.get('https://learning-info-bd.vercel.app/classes')
            return res.data
        }
    })

    const selectClass = (id) => {
        if (!user) {
            Swal.fire({
                title: 'Login First',
                text: "To select class you need to login!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Login'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login')
                }
            })
        } else {
            axiosSecure.post(`https://learning-info-bd.vercel.app/selectClass/${id}`, { email: email })
                .then(res => {
                    if (res.data.insertedId) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: `Class Selected Successful`,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                    else {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: `Class Already Selected`,
                            text: 'multiple class selection not possible',
                            showConfirmButton: false,
                            timer: 2000
                        })
                    }
                })
        }
    }
    return (

        <div>
            <Helmet>
                <title>Learning Point_Classes</title>
            </Helmet>
            {isLoading ? <div className='flex justify-center items-center h-[700px] ' >
                <span className="loading loading-spinner text-info loading-lg"></span>
            </div > :
                <div>
                    <h2 className="mt-10 sm:mt-12 lg:mt-20 mb-10 text-center text-4xl font-semibold">All Classes</h2>
                    <div className="lg-container grid grid-cols-2 md:grid-cols-3 gap-y-10">
                        {classes.map(classData => <ClassCard
                            key={classData._id}
                            item={classData}
                            overlay={false}
                            btn={true}
                            cardForClass={true}
                            selectClass={selectClass}
                        ></ClassCard>)}
                    </div>
                </div>
            }

        </div>
    );
};

export default Classes;