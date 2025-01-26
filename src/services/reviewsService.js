export const getStudentReviews = async (axiosSecure, studentId, limit) => {
    const res = await axiosSecure.get(`/review/my-reviews/${studentId}?limit=${limit}`);
    return res.data;
};

export const getPendingReviews = async (axiosSecure, studentId, limit) => {
    const res = await axiosSecure.get(`/review/pending-reviews/${studentId}?limit=${limit}`);
    return res.data;
};

export const addReview = async (axiosSecure, userId, reviewData) => {
    const res = await axiosSecure.post(`/review/add/${userId}`, reviewData);
    return res.data;
};

export const updateReview = async (axiosSecure, reviewData) => {
    const res = await axiosSecure.post(`/review/update`, reviewData);
    return res.data;
};