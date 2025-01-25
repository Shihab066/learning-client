import api from "./baseAPI";

export const getAllFeedback = async () => {
    const res = await api.get('/feedback/getAll');
    return res.data;
};

export const getFeedbackById = async (axiosSecure, userId) => {
    const res = await axiosSecure.get(`/feedback/get/${userId}`);
    return res.data;
};

export const addFeedback = async (axiosSecure, feedback) => {
    const res = await axiosSecure.post(`/feedback/add`, feedback);
    return res.data;
};

export const updateFeedback = async (axiosSecure, updatedFeedback) => {
    const res = await axiosSecure.patch(`/feedback/update`, updatedFeedback);
    return res.data;
};

export const removeFeedback = async (axiosSecure, userId) => {
    const res = await axiosSecure.delete(`/feedback/delete/${userId}`);
    return res.data;
};