

const PaymentHistroyRow = ({paymentData}) => {
    const { name, price, transactionId, image, date,email } = paymentData;
    const enrolledDate = date.split('T')[0]
    const enrolledTime = date.split('T')[1].split('.')[0]
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
                {email}
            </td>
            <td>
                ${price}
            </td>
            <td>
                {transactionId}
            </td>
            <th className="text-center">
                {enrolledDate}
            </th>
            <th className="text-center">
                {enrolledTime}
            </th>
        </tr>
    );
};

export default PaymentHistroyRow;