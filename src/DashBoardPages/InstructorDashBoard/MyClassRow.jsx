import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useState } from "react";


const MyClassRow = ({ classData, refetch }) => {
    const { _id, name, image, price, students, seats, status, feedback } = classData;
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [axiosSecure] = useAxiosSecure();
    const [active, setActive] = useState(false);
    const onSubmit = data => {
        const { price, seats } = data;
        const updateClass = { price: parseFloat(price), seats: parseFloat(seats) };
        console.log(updateClass);
        axiosSecure.patch(`/classes/${_id}`, updateClass)
            .then(res => {
                if (res.data.modifiedCount) {
                    reset();
                    setActive(false)
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Class Update Successful',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    refetch()
                }
            })
    }

    const deleteClass = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/classes/${_id}`)
                    .then(res => {
                        if (res.data.deletedCount) {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Class Delete Successful',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            refetch();
                        }
                    })

            }
        })
    }
    return (
        <tr>
            <td >
                <div className="flex items-center space-x-3">
                    <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                            <img src={image} />
                        </div>
                    </div>
                    <div>
                        <div className="font-bold">{name}</div>
                    </div>
                </div>
            </td>
            <td>
                ${price}
            </td>
            <td>{students}</td>

            <td>{seats}</td>
            <td>


                {/* The button to open modal */}
                <label htmlFor={`my-modal-${_id}-1`} className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        {feedback && <span className="badge badge-xs badge-success indicator-item"></span>}
                    </div>
                </label>

                {/* Put this part before </body> tag */}
                <input type="checkbox" id={`my-modal-${_id}-1`} className="modal-toggle" />
                <div className="modal">
                    <div className="modal-box relative  w-11/12">
                        <label htmlFor={`my-modal-${_id}-1`} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                        <h3 className="text-lg font-bold">Feedback</h3>
                        <p className="py-4">{feedback}</p>
                    </div>
                </div>
            </td>

            <th className="text-center">
                <div className={`badge badge-md text-white text-[12px] p-3 ${status === 'pending' && 'bg-blue-600' || status === 'approved' && 'bg-green-600' || status === 'denied' && 'bg-red-600'} capitalize `}>{status}</div>
            </th>
            <th>

                {/* Put this part before </body> tag */}
                <input type="checkbox" id={`my-modal-${_id}`} className="modal-toggle" />
                <div className={`modal ${active ? 'visible' : 'hidden'}`}>
                    <div className="modal-box relative max-w-4xl">
                        <label htmlFor={`my-modal-${_id}`} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                        <h3 className="text-lg text-center font-bold">Update Class</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            {/* Set Seats */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Seats</span>
                                </label>
                                <input type="number" className={`input input-info border-base-300 ${errors.seats?.type === 'min' ? 'border-red-500' : 'focus:border-blue-500 '} active:border-0 focus:outline-0 ${errors.seats?.type === 'min' && 'text-red-500'}`}
                                    {...register('seats', { required: true, min: 0 })}
                                />
                                {errors.seats?.type === 'required' && <span className="text-red-600">Field is required</span>}
                                {errors.seats?.type === 'min' && <span className="text-red-600">seats number cannot be negative </span>}
                            </div>

                            {/* Set Price */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Price</span>
                                </label>
                                <input type="number" className={`input input-info border-base-300 ${errors.price?.type === 'min' ? 'border-red-500' : 'focus:border-blue-500 '} active:border-0 focus:outline-0 ${errors.price?.type === 'min' && 'text-red-500'}`}
                                    {...register('price', { required: true, min: 0 })}
                                />
                                {errors.price?.type === 'required' && <span className="text-red-600">Field is required</span>}
                                {errors.price?.type === 'min' && <span className="text-red-600">Price value cannot be negative </span>}
                            </div>

                            {/* Add Button */}
                            <input type="submit" value="Update Class" className="mt-5 w-full btn bg-[#3b5fe2] text-white hover:bg-[#2a4ed1] normal-case" />
                        </form>
                    </div>
                </div>
                <div className="flex gap-2">
                    <label onClick={() => setActive(true)} htmlFor={`my-modal-${_id}`} className="btn btn-primary btn-xs">Update</label>
                    <button onClick={deleteClass} className="btn btn-primary btn-xs">delete</button>
                </div>
            </th>

        </tr>
    );
};

export default MyClassRow;