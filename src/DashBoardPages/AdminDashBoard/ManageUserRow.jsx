
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ManageUserRow = ({ user, refetch, userEmail }) => {
    const { _id, name, image, email, role } = user;
    const [axiosSecure] = useAxiosSecure();

    const handleMakeAdmin = () => {        
        Swal.fire({
            title: 'Are you sure?',
            text: "Want to make this user Admin?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, make admin'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.patch(`/users/${_id}`, { role: 'admin' })
                    .then(res => {
                        if (res.data.modifiedCount) {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: `${name} is upgrade to Admin`,
                                showConfirmButton: false,
                                timer: 1500
                            })
                            refetch();
                        }
                    })

            }
        })
    }

    const handleMakeInstructor = () => {
        if (userEmail === email) {
            throw new Error('Operation failed')
        }
        Swal.fire({
            title: 'Are you sure?',
            text: "Want to make this user Instructor?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, make instructor'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.patch(`/users/${_id}`, { role: 'instructor' })
                    .then(res => {
                        if (res.data.modifiedCount) {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: `${name} is upgrade to Instructor`,
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
            <td className="w-4/12">
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
            <td>
                {email}
            </td>
            <td><div className="badge badge-outline">{role}</div></td>
            <th className='px-0'>
                <div className='flex gap-1 justify-center'>
                    <button disabled={role === 'instructor' || userEmail === email} onClick={handleMakeInstructor} className='btn btn-xs normal-case bg-blue-500 hover:bg-blue-600 text-white'>Make Instructor</button>
                    <button disabled={role === 'admin'} onClick={handleMakeAdmin} className='btn btn-xs normal-case bg-red-500 hover:bg-red-600 text-white'>Make Admin</button>
                </div>
            </th>
        </tr>
    );
};

export default ManageUserRow;