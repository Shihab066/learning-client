import api from "./baseAPI"

export const getStudentReviews = async (studentId, limit) => {
    const res = await api.get(`review/my-reviews/${studentId}?limit=${limit}`);
    return res.data;
};

export const getPendingReviews = async (studentId, limit) => {
    const res = await api.get(`review/pending-reviews/${studentId}?limit=${limit}`);
    return res.data;
};

export const addReview = async (reviewData) => {
    const res = await api.post(`review/add`, reviewData);
    return res.data;
};

export const updateReview = async (reviewData) => {
    const res = await api.post(`review/update`, reviewData);
    return res.data;
};