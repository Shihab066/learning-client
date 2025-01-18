import api from "./baseAPI";

export const getAllFeedback = async () => {
    const res = await api.get('/feedback/getAll');
    return res.data;
};

export const getFeedbackById = async (userId) => {
    const res = await api.get(`/feedback/get/${userId}`);
    return res.data;
};

export const addFeedback = async (feedback) => {
    const res = await api.post(`/feedback/add`, feedback);
    return res.data;
};

export const updateFeedback = async (updatedFeedback) => {
    const res = await api.patch(`/feedback/update`, updatedFeedback);
    return res.data;
};

export const removeFeedback = async (userId) => {
    const res = await api.delete(`/feedback/delete/${userId}`);
    return res.data;
};