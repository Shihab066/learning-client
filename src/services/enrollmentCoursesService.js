import api from "./baseAPI"

export const getEnrollmentCourses = async (studentId) => {
    const res = await api.get(`course/studentCourses/${studentId}`);
    return res.data;
}

export const getEnrollmentCoursesId = async (axiosSecure, studentId) => {
    const res = await axiosSecure.get(`/course/enrolledCoursesId/${studentId}`);
    return res.data;
}

export const getEnrollmentCourseContents = async (studentId, courseId) => {
    const res = await api.get(`/course/content/${studentId}/${courseId}`);
    return res.data;
}

export const updateLearingProgress = async (studentId, courseId, updateDoc) => {
    const res = await api.patch(`/course/update/progress/${studentId}/${courseId}`, {...updateDoc});
    return res.data;
}