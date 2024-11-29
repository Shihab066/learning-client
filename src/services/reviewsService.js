import api from "./baseAPI"

export const getStudentReviews = async (studentId) => {
    const res = await api.get(`review/my-reviews/${studentId}`);
    return res.data;
};

export const getPendingReviews = async (studentId) => {
    const res = await api.get(`review/pending-reviews/${studentId}`);
    return res.data;
};

export const addReview = async (reviewData) => {
    const res = await api.post(`review/add`, reviewData);
    return res.data;
};