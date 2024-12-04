import api from "./baseAPI";

export const getAllFeedback = () => {
    const res = api.get('feedback/getAll');
    return res.data;
};

export const getFeedbackById = (userId) => {
    const res = api.get(`feedback/get/:${userId}`);
    return res.data;
};

export const addFeedback = (feedback) => {
    const res = api.post(`feedback/add`, {feedback});
    return res.data;
};

export const updateFeedback = (updatedFeedback) => {
    const res = api.patch(`feedback/update`, {updatedFeedback});
    return res.data;
};

export const removeFeedback = (userId, feedbackId) => {
    const res = api.patch(`feedback/delete/:${userId}/:${feedbackId}`);
    return res.data;
};