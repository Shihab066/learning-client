export const getEnrollmentCourses = async (axiosSecure, studentId) => {
    const res = await axiosSecure.get(`/course/studentCourses/${studentId}`);
    return res.data;
};

export const getEnrollmentCoursesId = async (axiosSecure, studentId) => {
    const res = await axiosSecure.get(`/course/enrolledCoursesId/${studentId}`);
    return res.data;
};

export const getEnrollmentCourseContents = async (axiosSecure, studentId, courseId) => {
    const res = await axiosSecure.get(`/course/content/${studentId}/${courseId}`);
    return res.data;
};

export const updateLearingProgress = async (axiosSecure, studentId, courseId, updateDoc) => {
    const res = await axiosSecure.patch(`/course/update/progress/${studentId}/${courseId}`, { ...updateDoc });
    return res.data;
};