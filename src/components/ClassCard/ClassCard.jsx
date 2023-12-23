import noImg from '../../assets/img/image.png';
import useUserRole from '../../hooks/useUserRole';

const ClassCard = ({ item, overlay, btn, cardForClass, selectClass, propularClass }) => {
    const { _id, image, name, email, instructorName, price, students, seats } = item;
    const [userRole] = useUserRole();
    // const seats = 0;
    // const students = 0;
    const showSeats = cardForClass && seats >= 0;
    const showStudent = students !== null && students >= 0;
    const hideSelectBtn = userRole === 'admin' || userRole === 'instructor';   
    const modifiedName = name.slice(0, 40) + '...';    
    return (
        <div className='flex justify-center'>
            <div className={`card relative w-[90%] xl:w-96 ${cardForClass && !overlay && 'lg:h-[480px] xl:h-[526px]'} shadow-xl ${overlay && 'image-full'} ${seats == 0 && cardForClass && 'opacity-60'}`}>
                <figure className='xs:h-[130px] sm:h-[200px] md:h-[180px] lg:h-[200px] xl:h-[255px] overflow-hidden bg-base-200'><img src={image || noImg} className="hover:scale-105 ease-linear duration-300 w-full h-full object-cover" alt={cardForClass ? 'classImg' : 'instructor-Img'} /></figure>
                {price && <span className='bg-white xs:px-[3px] sm:px-2 lg:px-3 xs:py-[2px] sm:py-1 xs:text-sm sm:text-base rounded-lg text-center absolute right-2 top-3 z-30'>$ {price}</span>}
                <div className="card-body xs:p-4 sm:p-6 lg:p-8 ">
                    <h2 className={`card-title ${!overlay && 'mb-auto'} xs:text-xs sm:text-base lg:text-xl`}>{name.length > 40 ? modifiedName : name}</h2>
                    {instructorName && <span className='xs:text-[11px] sm:text-sm lg:text-base'>Instructor: {instructorName}</span>}
                    {showStudent && <span className='xs:text-[11px] sm:text-sm lg:text-base'>Students: {students}</span>}
                    {showSeats && !propularClass && <span className={`${seats == 0 && 'text-red-500'} xs:text-[11px] sm:text-sm lg:text-base`}>Available Seats: {seats}</span>}
                    {email && !cardForClass && <span className="text-gray-500 xs:text-[13px] lg:text-sm xl:text-base truncate">E-mail: {email}</span>}
                    {btn &&
                        <div className="card-actions justify-start">
                            <button onClick={() => selectClass(_id)} className="btn btn-sm md:btn-md bg-blue-600 hover:bg-blue-700 text-white normal-case px-3 sm:px-5" disabled={seats == 0 || hideSelectBtn}>Select</button>
                        </div>
                    }
                </div>
                {seats == 0 && cardForClass &&
                    <div className='absolute top-0 h-[100%] w-full flex justify-center items-center'>
                        <span className='text-xl font-semibold text-red-700 pt-10'>Seats Not Available</span>
                    </div>
                }
            </div>
        </div>
    );
};

export default ClassCard;