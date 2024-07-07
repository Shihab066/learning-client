import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Profile = () => {
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    // console.log(user);

    const { data } = useQuery({
        queryKey: ['user', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`http://localhost:5000/user/${user?.email}`);
            return res.data;
        }
    })

    console.log(data);
    return (
        <div className="mt-10">
            <div className="lg-container bg-indigo-50 drop-shadow-md px-20 py-20 rounded-xl">
                {/* Profile general section*/}
                <h3 className="text-xl font-medium mb-3">My Profile</h3>
                <div className="grid grid-cols-2 gap-x-5 gap-y-8 mb-16">
                    {/* Name field */}
                    <div>
                        <label className="label">
                            Name
                        </label>
                        <input
                            type="text"
                            placeholder="Name"
                            className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                        // {...register('name', { required: false })}
                        />
                    </div>

                    {/* Email field */}
                    <div>
                        <label className="label">
                            Email
                        </label>
                        <input
                            type="email"
                            defaultValue={user?.email}
                            disabled
                            className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                        />
                    </div>

                    {/* image change */}
                    <div className="flex items-center gap-4">
                        <img
                            className="w-16 h-16 rounded-full object-cover"
                            src={user?.photoURL}
                            alt="profile picture"
                        />

                        <button className="btn btn-md capitalize text-white bg-blue-600 hover:bg-blue-700">
                            Change Profile Image
                        </button>
                    </div>

                    <button className="btn btn-md capitalize text-white bg-blue-600 hover:bg-blue-700 w-[150px] justify-self-end">
                        Save Changes
                    </button>
                </div>

                {/* Password change section */}
                <h3 className="text-xl font-medium mb-3">Password</h3>
                <div className="grid grid-cols-2 gap-x-5 gap-y-8">
                    <div className="col-span-2">
                        <label className="label">
                            Current Password
                        </label>
                        <input type="password" placeholder="Current Password" className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                        // {...register('name', { required: false })}
                        />
                    </div>

                    <div>
                        <label className="label">
                            New Password
                        </label>
                        <input type="text" placeholder="New Password" className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                        // {...register('name', { required: false })}
                        />
                    </div>

                    <div>
                        <label className="label">
                            Confirm New Password
                        </label>
                        <input type="password" placeholder="Confirm New Password" className="input input-info w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                        // {...register('name', { required: false })}
                        />
                    </div>

                    <button className="col-span-2 btn btn-md capitalize text-white bg-blue-600 hover:bg-blue-700 w-[150px] justify-self-end">
                        Save Changes
                    </button>
                </div>


            </div>
        </div>
    );
};

export default Profile;