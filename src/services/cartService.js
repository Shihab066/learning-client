import { toastSuccess } from '../utils/toastUtils';

export const fetchCartItems = async (axiosSecure, userId) => {
    const res = await axiosSecure.get(`/cart/get/${userId}`);
    return res.data;
};

export const fetchCartCourses = async (axiosSecure, cartItems) => {
    const res = await axiosSecure.post(`/cart/courses`, { cartItems });
    return res.data;
};

export const addCourseToCart = async (axiosSecure, userId, courseId, _instructorId, refetchCart) => {
    const res = await axiosSecure.post(`/cart/add`, { userId, courseId, _instructorId });
    if (res.data.insertedId) {
        toastSuccess('Course added to Cart');
        refetchCart();
    }
};

export const updateCartItemStatus = async (axiosSecure, userId, courseId, savedForLater, refetchCart) => {
    const res = await axiosSecure.patch(`/cart/update/${userId}/${courseId}`, { savedForLater });
    if (res.data.modifiedCount) {
        refetchCart();
    }
};

export const removeCourseFromCart = async (axiosSecure, userId, courseId, refetchCart) => {
    const res = await axiosSecure.delete(`/cart/delete/${userId}/${courseId}`);
    if (res.data.deletedCount) {
        refetchCart();
    }
};
