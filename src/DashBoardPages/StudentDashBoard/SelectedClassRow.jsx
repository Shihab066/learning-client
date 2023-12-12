import useAxiosSecure from "../../hooks/useAxiosSecure";
import Payments from "../Payments/Payments";

const SelectedClassRow = ({ classData, refetch }) => {
    const { _id, image, name, instructorName, price } = classData;
    const [axiosSecure] = useAxiosSecure();
    const handleDelete = () => {
        axiosSecure.delete(`/selectedClass/${_id}`)
            .then(res => {
                if (res.data.deletedCount) {
                    refetch();
                }
            })
    }
    return (
        <tr>
            <td>
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
                {instructorName}
            </td>
            <td>
                ${price}
            </td>
            <th className="text-center">
                {/* The button to open modal */}
                <label htmlFor={`my-modal-${_id}-5`} className="btn btn-xs">
                    buy now
                </label>

                {/* Put this part before </body> tag */}
                <input type="checkbox" id={`my-modal-${_id}-5`} className="modal-toggle" />
                <div className="modal">
                    <div className="modal-box relative max-w-screen-md h-[350px]">
                        <label htmlFor={`my-modal-${_id}-5`} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                        <p className="text-lg">Procced Checkout</p>

                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Payments
                                price={price}
                                classData={classData}
                                refetch={() => refetch()}
                            ></Payments>
                        </div>

                    </div>
                </div>
            </th>
            <th>
                <button onClick={handleDelete} className='btn btn-xs'>delete</button>
            </th>
        </tr>
    );
};

export default SelectedClassRow;