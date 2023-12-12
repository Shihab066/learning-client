import { useForm } from "react-hook-form";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
const img_hosting_secret_key = import.meta.env.VITE_IMAGE_UPLOAD_TOKEN;

const AddClass = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting_secret_key}`;
    const [image, setImage] = useState('');
    console.log(image)
    const onSubmit = async (data) => {
        const { name, seats, price } = data;
        const { displayName, email } = user;
        const newClass = { name, image, instructorName: displayName, seats: parseFloat(seats), students: 0, price: parseFloat(price), email, status: 'pending',feedback:'' }
        console.log(newClass)
        axiosSecure.post('/classes', newClass)
            .then(res => {
                if (res.data.insertedId) {
                    setImage('');
                    reset();
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Class Added Successful',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    console.log(image)
                }
            })
    }

    const handleImage = async (event) => {
        const img = event.target.files;
        const formData = new FormData();
        formData.append('image', img[0])

        {
            img &&
                await fetch(img_hosting_url, {
                    method: 'POST',
                    body: formData
                    // mode: 'no-cors',
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            const imgURL = data.data.display_url;
                            setImage(imgURL)
                            // console.log(imgURL)
                        }
                        else {
                            setImage('')
                        }
                    })
        }
    }
    return (
        <div className="px-8 pb-10 w-10/12 mx-auto shadow-2xl rounded-lg h-[700px]">
            <h3 className="text-center py-5 font-bold text-4xl">Add Class</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/*Class Name */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Class Name</span>
                    </label>
                    <input type="text" placeholder="Classs Name" className="input input-info border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                        {...register('name', { required: true })}
                    />
                    {errors.name?.type === 'required' && <span className="text-red-600">Field is required</span>}
                </div>

                {/* image upload */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Image</span>
                    </label>
                    <input type="file" onChange={handleImage} className="file-input file-input-bordered border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                    // {...register('img', { required: false })}
                    />
                </div>

                {/* Instructor Name */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Instructor Name</span>
                    </label>
                    <input type="text" defaultValue={user?.displayName} disabled className="input input-info border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                    />
                </div>


                {/* Instructor E-mail  */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">E-mail</span>
                    </label>
                    <input type="email" defaultValue={user?.email} disabled className="input input-info border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                    />
                </div>

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
                <input type="submit" value="Add Class" className="mt-5 w-full btn bg-[#3b5fe2] text-white hover:bg-[#2a4ed1] normal-case" />
            </form>
        </div>
    );
};

export default AddClass;