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
    return (
        <div className='flex justify-center'>
            <div className={`card relative w-11/12 md:w-96 shadow-xl ${overlay && 'image-full'} ${seats == 0 && cardForClass && 'opacity-60'}`}>
                <figure className='h-[255px]  overflow-hidden bg-base-200'><img src={image || noImg} className="hover:scale-105 ease-linear duration-300 w-full h-full object-cover" alt={cardForClass ? 'classImg' : 'instructor-Img'} /></figure>
                {price && <span className='bg-base-300 px-3 py-1 rounded-lg text-center absolute right-2 top-3 z-30'>$ {price}</span>}
                <div className="card-body">
                    <h2 className="card-title">{name}</h2>
                    {instructorName && <span>Instructor: {instructorName}</span>}
                    {showStudent && <span>Students: {students}</span>}
                    {showSeats && !propularClass && <span className={`${seats == 0 && 'text-red-500'}`}>Available Seats: {seats}</span>}
                    {email && !cardForClass && <span className="text-gray-500">E-mail: {email}</span>}
                    {btn &&
                        <div className="card-actions justify-start">
                            <button onClick={() => selectClass(_id)} className="btn bg-blue-600 hover:bg-blue-700 text-white normal-case px-5" disabled={seats == 0 || hideSelectBtn}>Select</button>
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