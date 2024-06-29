import axios from 'axios';
import ClassCard from '../../components/ClassCard/ClassCard';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';


const Classes = () => {
    const { user } = useAuth();
    const email = user?.email;
    const [axiosSecure] = useAxiosSecure();
    const navigate = useNavigate();
    const [itemPerPage, setItemPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading } = useQuery({
        queryKey: ['classes', itemPerPage, currentPage],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5000/classes?limit=${itemPerPage}&page=${currentPage}`)
            return res.data;
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
    const totalItems = data?.classesCount;
    let totalPages = Math.ceil(totalItems / itemPerPage);
    if (!isNaN(totalPages)) {
        totalPages = new Array(totalPages).fill(0);
    }
    const handlePageOptions = (event) => {
        setItemPerPage(parseInt(event.target.value));
    }
    return (

        <div>
            <Helmet>
                <title>Learning Point_Classes</title>
            </Helmet>
            <div className='lg-container flex justify-between px-10 py-6'>
                <h2 className="text-lg font-medium">All Classes</h2>
                <div className='flex items-center gap-2'>
                    <p className='font-medium'>Show:</p>
                    <select className='border rounded bg-base-200 px-1 focus:outline-none' onChange={handlePageOptions}>
                        <option value={6}>6</option>
                        <option value={9}>9</option>
                        <option value={18}>18</option>
                    </select>
                </div>
            </div>
            {isLoading ? <div className='flex justify-center items-center h-[700px] ' >
                <span className="loading loading-spinner text-info loading-lg"></span>
            </div > :
                <div>
                    <div className="lg-container grid grid-cols-2 md:grid-cols-3 gap-y-10">
                        {data?.classes.map(classData => <ClassCard
                            key={classData._id}
                            item={classData}
                            overlay={false}
                            btn={true}
                            cardForClass={true}
                            selectClass={selectClass}
                        ></ClassCard>)}
                    </div>

                    {/* pagination button */}
                    <div className='flex justify-center gap-2 mt-20'>
                        {
                            totalPages?.map((page, index) =>
                                <button
                                    key={index}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${currentPage === index + 1 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                                    onClick={() => setCurrentPage(index + 1)}>
                                    {index + 1}
                                </button>
                            )
                        }
                    </div>
                </div>
            }
        </div>
    );
};

export default Classes;