import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import notFoundIcon from '../../assets/icon/error1.png';
import GenerateDynamicStar from '../../components/GenerateDynamicStar/GenerateDynamicStar';
import CoursesLoadingSkeleton from './CoursesLoadingSkeleton';

// Custom hook to get query parameters
function usePathQuery() {
    return new URLSearchParams(useLocation().search);
}

const Courses = () => {
    const { user } = useAuth();
    const email = user?.email;
    const [axiosSecure] = useAxiosSecure();
    const navigate = useNavigate();
    const location = useLocation();
    const query = usePathQuery();
    const [reFetchCourse, setRefetchCourse] = useState(false);

    // Get query parameters
    const limit = parseInt(query.get('limit')) || '';
    const page = parseInt(query.get('page')) || '';
    const sort = query.get('sort') || '';
    const search = query.get('search') || '';

    // State variables
    const [itemPerPage, setItemPerPage] = useState('');
    const [currentPage, setCurrentPage] = useState('');
    const [sortValue, setSortValue] = useState(0);
    const [searchValue, setSearchValue] = useState('');

    const activePage = currentPage || 1;
    const searchingValue = location?.state?.search || '';

    // Update state based on query parameters
    useEffect(() => {
        setItemPerPage(limit);
        setCurrentPage(page);
        setSortValue(sort.toLowerCase() === 'price.asc' ? 1 : sort.toLowerCase() === 'price.desc' ? -1 : 0);
        setSearchValue(search || searchingValue);
        setRefetchCourse(!reFetchCourse);
    }, [limit, page, sort, search, searchingValue]);

    // Update URL based on state changes
    useEffect(() => {
        const params = new URLSearchParams();
        if (itemPerPage) params.set('limit', itemPerPage);
        if (currentPage) params.set('page', currentPage);
        if (sortValue) params.set('sort', sortValue === 1 ? 'price.ASC' : sortValue === -1 ? 'price.DESC' : '');
        if (searchValue) params.set('search', searchValue);
        navigate(`/courses?${params.toString()}`, { replace: true });
    }, [itemPerPage, currentPage, sortValue, searchValue]);

    // Fetch courses data
    const { data, isLoading = true } = useQuery({
        queryKey: ['courses', reFetchCourse],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5000/api/v1/course/all?limit=${itemPerPage || 6}&page=${activePage}&sort=${sortValue}&search=${searchValue}`);
            return res.data;
        },
    });

    // Handle class selection
    const selectClass = (id) => {
        if (!user) {
            Swal.fire({
                title: 'Login First',
                text: "To select a class you need to login!",
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
            axiosSecure.post(`https://learning-info-bd.vercel.app/selectClass/${id}`, { email })
                .then(res => {
                    if (res.data.insertedId) {
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Class Selected Successfully',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    } else {
                        Swal.fire({
                            position: 'center',
                            icon: 'error',
                            title: 'Class Already Selected',
                            text: 'Multiple class selection is not possible',
                            showConfirmButton: false,
                            timer: 2000
                        });
                    }
                });
        }
    };

    const totalItems = data?.coursesCount;
    const totalPages = Math.ceil(totalItems / (itemPerPage || 6));
    const [visiblePages, setVisiblePages] = useState([]);

    // Update visible pages for pagination
    useEffect(() => {
        const totalPagesArr = Array.from({ length: totalPages }, (_, i) => i + 1);
        if (activePage < 7) {
            setVisiblePages(totalPagesArr.slice(0, 7));
        } else if (activePage === visiblePages[visiblePages.length - 1] || activePage === visiblePages[0]) {
            if (!visiblePages.includes(totalPagesArr[totalPagesArr.length - 1]) || activePage === visiblePages[0]) {
                setVisiblePages(totalPagesArr.slice(activePage - 4, activePage + 3));
            }
        }
    }, [totalPages, activePage]);

    // Handle case when no courses are found
    useEffect(() => {
        if (data?.courses.length === 0) {
            setTimeout(() => {
                setCurrentPage(visiblePages[visiblePages.length - 1]);
            }, 100);
        }
    }, [data?.courses.length, visiblePages]);

    // Handlers for item per page and sort options
    const handleItemPerPageOptions = (event) => {
        setItemPerPage(parseInt(event.target.value));
        navigate(`/class?limit=${parseInt(event.target.value)}`)
    };

    const handleSortOptions = (event) => {
        const sort = parseInt(event.target.value);
        setSortValue(sort);
        navigate(`/class/?sort=${sort === 1 ? 'price.ASC' : sort === -1 ? 'price.DESC' : ''}`)
    };

    return (
        <div>
            <ScrollToTop limit={itemPerPage} page={currentPage} />
            <Helmet>
                <title>Learning Point | Courses</title>
            </Helmet>
            <Header
                handlePageOptions={handleItemPerPageOptions}
                handleSortOptions={handleSortOptions}
                itemPerPage={itemPerPage}
                sortValue={sortValue}
                visiblePages={visiblePages}
            />
            {
                <Content
                    data={data}
                    selectClass={selectClass}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    activePage={activePage}
                    visiblePages={visiblePages}
                    notFoundIcon={notFoundIcon}
                    isCoursesLoading={isLoading}
                />
            }
        </div>
    );
};

// Header component with options for items per page and sorting
const Header = ({ handlePageOptions, handleSortOptions, itemPerPage, sortValue, visiblePages }) => (
    <div className='lg-container flex flex-col sm:flex-row justify-between px-2 sm:px-4 md:px-5 py-6 gap-y-4'>
        <h2 className="text-lg font-medium">Courses</h2>
        <div className={`flex items-center gap-4 text-sm ${!visiblePages.length && 'hidden'}`}>
            {/* Select item per page */}
            <div className='flex items-center gap-2'>
                <p className='font-medium'>Show:</p>
                <select value={itemPerPage} className='text-base border rounded bg-base-200 ps-1 focus:outline-none' onChange={handlePageOptions}>
                    <option value={6}>6</option>
                    <option value={9}>9</option>
                    <option value={18}>18</option>
                </select>
            </div>

            {/* Sorting order */}
            <div className='flex items-center gap-2'>
                <p className='font-medium'>Sort By:</p>
                <select value={sortValue} className='w-[115px] text-base border rounded bg-base-200 ps-1 focus:outline-none' onChange={handleSortOptions}>
                    <option value={0}>Default</option>
                    <option value={1}>Price(Low {'>'} High)</option>
                    <option value={-1}>Price(High {'>'} Low)</option>
                </select>
            </div>
        </div>
    </div>
);

// Content component displaying courses and pagination
const Content = ({ data, selectClass, currentPage, setCurrentPage, activePage, visiblePages, notFoundIcon, isCoursesLoading }) => (
    <div className='lg-container'>
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 place-items-center px-2 xl:px-4 gap-x-4">
                {isCoursesLoading
                    ?
                    <CoursesLoadingSkeleton />
                    :
                    data?.courses.map(courseData => (
                        <CourseCard
                            key={courseData._id}
                            item={courseData}
                            selectClass={selectClass}
                        />
                    ))}
            </div>
            {
                !isCoursesLoading &&
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    activePage={activePage}
                    visiblePages={visiblePages}
                    data={data}
                />
            }
        </>

        {!isCoursesLoading && data.courses.length === 0 &&
            <ItemNotFound notFoundIcon={notFoundIcon} />
        }
    </div>
);

// Courses Card Component
const CourseCard = ({ item }) => {
    const { _id, instructorName, courseName, courseThumbnail, level, rating, totalReviews, totalModules, price, discount } = item;
    const modifiedCourseName = courseName?.length > 50 ? courseName.slice(0, 50) + '...' : courseName;
    return (
        <div className="w-full h-fit bg-white rounded-2xl border border-[#E2E8F0] text-gray-700 mx-1 sm:mx-0 xl:hover:shadow-lg duration-300">
            <Link to={`/course/${_id}`}>
                <img
                    className="w-full h-48 object-cover object-top rounded-t-lg"
                    src={courseThumbnail}
                    alt="course thumbnail"
                />
                <div className='p-3 lg:p-4 space-y-2'>
                    <h3 className="h-14 md:h-fit lg:h-14 lg:text-lg font-medium" title={courseName}>
                        {modifiedCourseName}
                    </h3>
                    <p className="truncate">
                        By {instructorName}
                    </p>
                    <div className="w-fit rounded-full px-3 py-[.2rem] text-xs bg-yellow-400 text-gray-700 font-medium">{level}</div>
                    <div className="flex flex-wrap items-center gap-x-2">
                        {rating > 0 && <span className='font-medium'>{rating}</span>}
                        <GenerateDynamicStar rating={rating} />
                        <span>
                            ({totalReviews} Ratings)
                        </span>
                    </div>
                    <p>{22} Total Hours. {totalModules} Modules.</p>
                    <div>
                        {discount > 0
                            ? (
                                <div className="flex justify-start items-start gap-x-3">
                                    <p className="text-gray-900 text-2xl leading-[1.625rem] font-medium">${(price - (price * (discount / 100))).toFixed(1)}</p>
                                    <p className="text-[#94A3B8] text-lg"><del>${price}</del></p>
                                    <p className="text-green-600 text-xl font-medium">{discount}% Off</p>
                                </div>
                            ) : (
                                <p className="text-gray-900 text-2xl font-medium">${price}</p>
                            )
                        }
                    </div>
                </div>
            </Link>

            <div
                onClick={(e) => e.stopPropagation()}
                className="px-3 pb-3 lg:px-4 lg:pb-4 space-y-2">
                <button className="btn bg-black hover:bg-black text-white w-full capitalize rounded-lg hover:shadow-lg duration-300">
                    Add To Cart
                </button>
                <button className="btn bg-white hover:bg-white text-black outline outline-1 w-full capitalize rounded-lg hover:shadow-lg duration-300">
                    Buy Now
                </button>
            </div>
        </div>
    );
};

// Item not found component
const ItemNotFound = ({ notFoundIcon }) => (
    <div className='h-[650px] pt-[250px] text-center'>
        <img className='w-[80px] mx-auto ' src={notFoundIcon} alt="" />
        <p className='font-medium mt-4'>Sorry! No Courses Found</p>
        <p className='mt-2'>Please try searching for something else</p>
    </div>
);

// Pagination component
const Pagination = ({ currentPage, setCurrentPage, activePage, visiblePages, data }) => (
    <div className={`flex justify-center items-center gap-2 mt-20 ${!data?.courses?.length && 'hidden'}`}>
        {/* Previous button */}
        <Link
            to={`/courses/?page=${currentPage - 1}`}
            className={`text-sm font-medium hover:bg-blue-700 hover:text-white hover:underline hover: px-3 py-2 rounded-lg  transition-colors duration-300 ${activePage === visiblePages[0] ? 'text-gray-400 pointer-events-none' : 'text-gray-700'}`}
        >
            PREV
        </Link>

        {/* Visible page numbers */}
        {visiblePages.map((pageNo) => (
            <Link
                to={`/courses/?page=${pageNo}`}
                key={pageNo}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${activePage === pageNo ? 'bg-blue-600 text-white pointer-events-none' : 'bg-gray-200 hover:bg-blue-700 text-gray-700 hover:text-white hover:underline'}`}
                onClick={() => setCurrentPage(pageNo)}
            >
                {pageNo}
            </Link>
        ))}

        {/* Next button */}
        <Link
            to={`/courses/?page=${(currentPage || 1) + 1}`}
            className={`text-sm font-medium hover:bg-blue-700 hover:text-white hover:underline hover: px-3 py-2 rounded-lg  transition-colors duration-300 ${activePage === visiblePages[visiblePages.length - 1] ? 'text-gray-400 pointer-events-none' : 'text-gray-700'}`}
        >
            NEXT
        </Link>
    </div>
);

export default Courses;
