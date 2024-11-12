import api from "./baseAPI"

export const getEnrollmentCourses = async (studentId) => {
    const res = await api.get(`course/studentCourses/${studentId}`);
    return res.data;
}