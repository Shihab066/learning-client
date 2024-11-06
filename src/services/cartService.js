import { toastSuccess } from '../utils/toastUtils';
import api from './baseAPI';

export const fetchCartItems = async (userId) => {
    const res = await api.get(`cart/get/${userId}`);
    return res.data;
};

export const addCourseToCart = async (userId, courseId, refetchCart) => {
    const res = await api.post(`cart/add`, { userId, courseId });
    if (res.data.insertedId) {
        toastSuccess('Course added to Cart');
        refetchCart();
    }
};

export const updateCartItemStatus = async (userId, courseId, savedForLater, refetchCart) => {
    const res = await api.patch(`cart/update/${userId}/${courseId}`, { savedForLater });
    if (res.data.modifiedCount) {
        refetchCart();
    }
}

export const removeCourseFromCart = async (userId, courseId, refetchCart) => {
    const res = await api.delete(`cart/delete/${userId}/${courseId}`);
    if (res.data.deletedCount) {
        refetchCart();
    }
};

export const fetchCartCourses = async (cartItems) => {
    const res = await api.post(`cart/courses`, { cartItems });
    return res.data;
};