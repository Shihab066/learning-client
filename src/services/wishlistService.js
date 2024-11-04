import { toastSuccess } from '../utils/toastUtils';
import api from './baseAPI';

export const fetchWishlist = async (userId) => {
    const res = await api.get(`wishlist/get/${userId}`);
    return res.data;
};

export const addCourseToWishList = async (userId, courseId, refetchWishlist) => {
    const res = await api.post(`wishlist/add`, { userId, courseId });
    if (res.data.insertedId) {
        toastSuccess('Course added to wishlist');
        refetchWishlist();
    }
};

export const removeCourseFromWishList = async (userId, courseId, refetchWishlist) => {
    const res = await api.delete(`wishlist/delete/${userId}/${courseId}`);
    if (res.data.deletedCount) {        
        refetchWishlist();
    }
};

export const fetchWishlistCourses = async (wishlist) => {
    const res = await api.post(`wishlist/courses`, { wishlist });
    return res.data;
}