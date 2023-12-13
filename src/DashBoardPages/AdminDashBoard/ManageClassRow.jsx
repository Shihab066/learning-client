
import { HiPencilAlt } from "react-icons/hi";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
const ManageClassRow = ({ classData, refetch }) => {
    const { _id, name, image, price, seats, status, instructorName } = classData;
    const { register, handleSubmit, reset } = useForm();       
    const [axiosSecure] = useAxiosSecure();
    const onSubmit = data => {
        const { feedback } = data
        const updateClass = { feedback: feedback }
        console.log(_id)
        axiosSecure.patch(`/feedback/${_id}`, updateClass)
            .then(res => {
                if (res.data.modifiedCount) {
                    reset();                   
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Feedback Send Successful',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
    }

    const handleApproved = () => {
        axiosSecure.patch(`/status/${_id}`, { status: 'approved' })
            .then(res => {
                if (res.data.modifiedCount) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Class Approved',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    refetch();
                }
            })
    }

    const handleDeny = () => {
        axiosSecure.patch(`/status/${_id}`, { status: 'denied' })
            .then(res => {
                if (res.data.modifiedCount) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Class Denied',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    refetch();
                }
            })
    }


    return (
        <tr>
            <td className="pl-1">
                <div className="flex items-center space-x-3">
                    <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                            <img src={image} />
                        </div>
                    </div>
                    <div>
                        <div className="font-bold pr-1">{name}</div>
                    </div>
                </div>
            </td>
            <td className="px-0">{instructorName}</td>
            {/* <td className="px-0">{email}</td> */}
            <td className="px-0">{seats}</td>
            <td className="text-right pl-0">${price}</td>
            <td className="px-2">
                <div className={`badge badge-md text-white text-[12px] p-3 ${status === 'pending' && 'bg-blue-600' || status === 'approved' && 'bg-green-600' || status === 'denied' && 'bg-red-600'} `}>{status}</div>
            </td>
            <td className="p-0">
                <div className="flex gap-2">
                    <button disabled={status === 'approved' || status === 'denied'} onClick={handleApproved} className="btn bg-green-500 hover:bg-green-600 btn-sm normal-case text-white">approve</button>
                    <button disabled={status === 'approved' || status === 'denied'} onClick={handleDeny} className="btn bg-red-500 hover:bg-red-600  btn-sm normal-case text-white">Deny</button>
                </div>
            </td>
            <th>

                {/* Put this part before </body> tag */}
                <input type="checkbox" id={`my-modal-${_id}`} className="modal-toggle" />
                <div className={`modal`}>
                    <div className="modal-box relative w-11/12">
                        <label htmlFor={`my-modal-${_id}`} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                        <h3 className="text-lg font-bold">Send Feedback</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-control">
                                <textarea type="text" placeholder="Feedback" className="textarea textarea-info border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                                    {...register('feedback', { required: true })}
                                />
                            </div>
                            <input type="submit" value="Send Feedback" className="mt-5 btn bg-[#3b5fe2] text-white hover:bg-[#2a4ed1] normal-case" />
                        </form>

                    </div>
                </div>
                <label htmlFor={`my-modal-${_id}`} title="send feedback" className="btn bg-blue-500 hover:bg-blue-600  btn-sm normal-case text-white">
                    <HiPencilAlt></HiPencilAlt>
                </label>
            </th>
        </tr>
    );
};

export default ManageClassRow;