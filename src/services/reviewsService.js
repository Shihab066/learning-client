import api from "./baseAPI"

export const getStudentReviews = async (studentId) => {
    const res = await api.get(`review/my-reviews/${studentId}`);
    return res.data
}