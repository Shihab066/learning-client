import { toastSuccess } from '../utils/toastUtils';

export const fetchWishlist = async (axiosSecure, userId) => {
    const res = await axiosSecure.get(`/wishlist/get/${userId}`);
    return res.data;
};

export const addCourseToWishList = async (axiosSecure, userId, courseId, refetchWishlist) => {
    const res = await axiosSecure.post(`/wishlist/add`, { userId, courseId });
    if (res.data.insertedId) {
        toastSuccess('Course added to wishlist');
        refetchWishlist();
    }
};

export const removeCourseFromWishList = async (axiosSecure, userId, courseId, refetchWishlist) => {
    const res = await axiosSecure.delete(`/wishlist/delete/${userId}/${courseId}`);
    if (res.data.deletedCount) {
        refetchWishlist();
    }
};

export const fetchWishlistCourses = async (axiosSecure, wishlist) => {
    const res = await axiosSecure.post(`/wishlist/courses`, { wishlist });
    return res.data;
};