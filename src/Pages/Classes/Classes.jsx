import axios from 'axios';
import ClassCard from '../../components/ClassCard/ClassCard';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import ScrollToTop from '../../components/ClassCard/scrollToTop';

function usePathQuery() {
    return new URLSearchParams(useLocation().search);
}

const Classes = () => {
    const { user } = useAuth();
    const email = user?.email;
    const [axiosSecure] = useAxiosSecure();
    const navigate = useNavigate();
    const location = useLocation();

    const query = usePathQuery();
    const limit = parseInt(query.get('limit')) || '';
    const page = parseInt(query.get('page')) || '';

    const [itemPerPage, setItemPerPage] = useState('');
    const [currentPage, setCurrentPage] = useState('');

    useEffect(() => {
        setItemPerPage(limit);
        setCurrentPage(page);
    }, [limit, page]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (itemPerPage) params.set('limit', itemPerPage);
        if (currentPage) params.set('page', currentPage);
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }, [itemPerPage, currentPage, navigate, location.pathname]);

    useEffect(() => {
        if (query.size === 0) {
            setCurrentPage('');
            setItemPerPage('');
        }
    }, [query.size])

    const { data, isLoading } = useQuery({
        queryKey: ['classes', itemPerPage, currentPage],
        queryFn: async () => {
            const res = await axios.get(`https://learning-info-bd.vercel.app/classes?limit=${itemPerPage || 6}&page=${currentPage || 1}`);
            return res.data;
        },
    });

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
                    navigate('/login');
                }
            });
        } else {
            axiosSecure.post(`https://learning-info-bd.vercel.app/selectClass/${id}`, { email: email })
                .then(res => {
                    if (res.data.insertedId) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: `Class Selected Successfully`,
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: `Class Already Selected`,
                            text: 'Multiple class selection is not possible',
                            showConfirmButton: false,
                            timer: 2000
                        });
                    }
                });
        }
    };

    const totalItems = data?.classesCount;
    const totalPages = Math.ceil(totalItems / (itemPerPage || 6));
    const [visiblePages, setVisiblePages] = useState([]);



    useEffect(() => {
        if (data?.classes.length === 0) {
            setCurrentPage(visiblePages[visiblePages.length - 1]);
        }
    }, [data?.classes.length, visiblePages]);    

    useEffect(() => {
        const totalPagesArr = Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage < 7) {
            setVisiblePages(totalPagesArr.slice(0, 7));
        } else if ((currentPage || 1) === visiblePages[visiblePages.length - 1] || ((currentPage || 1) === visiblePages[0] && !visiblePages.includes(totalPagesArr[2]))) {
            if (!visiblePages.includes(totalPagesArr[totalPagesArr.length - 1]) || (currentPage || 1) === visiblePages[0]) {
                setVisiblePages(totalPagesArr.slice((currentPage || 1) - 4, (currentPage || 1) + 3));
            }
        }
    }, [totalPages, currentPage]);

    const handleItemPerPageOptions = (event) => {
        setItemPerPage(parseInt(event.target.value));
    };

    return (
        <div>
            <ScrollToTop limit={itemPerPage} page={currentPage} />
            <Helmet>
                <title>Learning Point | Classes</title>
            </Helmet>
            <Header handlePageOptions={handleItemPerPageOptions} itemPerPage={itemPerPage} />
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <Content
                    data={data}
                    selectClass={selectClass}
                    currentPage={currentPage}
                    visiblePages={visiblePages}
                    setCurrentPage={setCurrentPage}
                />
            )}
        </div>
    );
};

const Header = ({ handlePageOptions, itemPerPage }) => (
    <div className='lg-container flex justify-between px-10 py-6'>
        <h2 className="text-lg font-medium">All Classes</h2>
        <div className='flex items-center gap-2'>
            <p className='font-medium'>Show:</p>
            <select value={itemPerPage} className='border rounded bg-base-200 px-1 focus:outline-none' onChange={handlePageOptions}>
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={18}>18</option>
            </select>
        </div>
    </div>
);

const LoadingSpinner = () => (
    <div className='flex justify-center items-center h-[700px]'>
        <span className="loading loading-spinner text-info loading-lg"></span>
    </div>
);

const Content = ({ data, selectClass, currentPage, visiblePages, setCurrentPage }) => (
    <div>
        <div className="lg-container grid grid-cols-2 md:grid-cols-3 gap-y-10">
            {data?.classes.map(classData => (
                <ClassCard
                    key={classData._id}
                    item={classData}
                    overlay={false}
                    btn={true}
                    cardForClass={true}
                    selectClass={selectClass}
                />
            ))}
        </div>
        <Pagination
            currentPage={currentPage}
            visiblePages={visiblePages}
            setCurrentPage={setCurrentPage}
        />
    </div>
);

const Pagination = ({ currentPage, visiblePages, setCurrentPage }) => (
    <div className='flex justify-center gap-2 mt-20'>
        {visiblePages.map((pageNo) => (
            <Link
                to={`/class/?page=${pageNo}`}
                type='button'
                key={pageNo}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${(currentPage || 1) === pageNo ? 'bg-blue-600 hover:bg-blue-700 text-white pointer-events-none' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 hover:underline'}`}
                onClick={() => setCurrentPage(pageNo)}
            >
                {pageNo}
            </Link>
        ))}
    </div>
);

export default Classes;
