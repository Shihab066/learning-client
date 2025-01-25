import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { addFeedback, getFeedbackById, removeFeedback, updateFeedback } from "../../../services/feedbackService";
import { removeAlert, toastSuccess } from "../../../utils/toastUtils";
import { useEffect, useState } from "react";
import EditIcon from "../../../components/Icons/EditIcon";
import DeleteIcon from "../../../components/Icons/DeleteIcon";
import Loading from "../../../components/Loading/Loading";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Feedback = () => {
    const { user } = useAuth(); // Retrieve the authenticated user
    const [axiosSecure] = useAxiosSecure();
    const { data: feedback, isLoading } = useQuery({
        queryKey: ["my-feedback"],
        enabled: !!user, // Enable the query only if a user exists
        queryFn: async () => {
            const res = await getFeedbackById(axiosSecure, user.uid);
            return res;
        },
    });

    return (
        <section>
            {/* Header Section */}
            <header>
                <h2 className="mb-2 text-xl font-medium">Feedback</h2>
                <hr />
            </header>

            {/* Content Section */}
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    {/* Show feedback if data exists, otherwise render the feedback form */}
                    {feedback ? (
                        <MyFeedback user={user} data={feedback} />
                    ) : (
                        <FeedbackForm user={user} />
                    )}
                </>
            )}
        </section>
    );
};

const FeedbackForm = ({ user }) => {
    const [axiosSecure] = useAxiosSecure();
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        // Extract form values
        const headline = form.headline.value.trim();
        const feedback = form.feedback.value.trim();

        // Prepare feedback data
        const feedbackData = {
            userId: user.uid,
            name: user.displayName,
            profileImage: user.photoURL,
            headline,
            feedback,
        };

        // Submit feedback
        const res = await addFeedback(axiosSecure, feedbackData);
        if (res.insertedId) {
            toastSuccess('Your feedback has been submitted.');
            form.reset(); // Reset form fields
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Headline Input */}
            <div className="flex flex-col space-y-2">
                <label htmlFor="headline" className="font-medium">
                    Headline
                </label>
                <input
                    name="headline"
                    id="headline"
                    type="text"
                    placeholder="Engineer/Designer etc."
                    className="border border-black py-2 px-4 placeholder-gray-500 focus:outline-none"
                />
            </div>

            {/* Feedback Input */}
            <div className="flex flex-col space-y-2">
                <label htmlFor="feedback" className="font-medium">
                    Share Your Thoughts
                </label>
                <textarea
                    name="feedback"
                    id="feedback"
                    rows="10"
                    placeholder="Your suggestions help us grow!"
                    className="border border-black resize-none p-4 placeholder-gray-500 focus:outline-none"
                />
            </div>

            {/* Submit Button */}
            <input
                type="submit"
                value="Submit"
                className="px-3 py-2.5 w-fit text-sm font-medium text-white bg-black rounded cursor-pointer"
            />
        </form>
    );
};

const MyFeedback = ({ user, data }) => {
    const [axiosSecure] = useAxiosSecure();
    const { headline, feedback } = data;

    // Prepare feedback data for edit form
    const feedbackData = {
        userId: user.uid,
        headline,
        feedback,
    };

    const [isEditEnable, setIsEditEnable] = useState(false); // Toggle edit mode
    const queryClient = useQueryClient(); // React Query client for refetching data

    // Handle feedback removal
    const handleRemoveFeedback = () => {
        removeAlert().then(async (result) => {
            if (result.isConfirmed) {
                const res = await removeFeedback(axiosSecure, user.uid);
                if (res.deletedCount) {
                    toastSuccess('Your feedback has been removed');
                    queryClient.refetchQueries(['my-feedback']); // Refetch feedback data
                }
            }
        });
    };

    return (
        <>
            {isEditEnable ? (
                <FeedbackUpdateForm
                    feedbackData={feedbackData}
                    setIsEditEnable={setIsEditEnable}
                />
            ) : (
                <div className="mt-4 border rounded-xl px-4 py-4">
                    <div className="relative">
                        {/* Feedback Header */}
                        <h2 className="mb-2 font-medium">Your Feedback</h2>

                        {/* Action Buttons */}
                        <div className="absolute top-0 right-0 flex items-center gap-x-3">
                            {/* Remove Feedback */}
                            <span onClick={handleRemoveFeedback} className="cursor-pointer">
                                <DeleteIcon />
                            </span>

                            {/* Edit Feedback */}
                            <span
                                onClick={() => setIsEditEnable(true)}
                                className="cursor-pointer"
                                title="Edit"
                            >
                                <EditIcon />
                            </span>
                        </div>
                    </div>

                    {/* Feedback Content */}
                    <p>{feedback}</p>
                </div>
            )}
        </>
    );
};

const FeedbackUpdateForm = ({ feedbackData, setIsEditEnable }) => {
    const [formData, setFormData] = useState(feedbackData); // Manage form state
    const { headline, feedback } = formData; // Destructure current form values
    const [isUpdateBtnDisable, setIsUpdateBtnDisable] = useState(true); // Track button state
    const queryClient = useQueryClient(); // React Query client for data refetching
    const [axiosSecure] = useAxiosSecure();

    // Handle input field changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await updateFeedback(axiosSecure, formData);
        if (res.modifiedCount) {
            toastSuccess('Feedback updated successfully');
            setIsEditEnable(false);
            queryClient.refetchQueries(['my-feedback']); // Refetch feedback data
        }
    };

    // Watch for form data changes to enable/disable the update button
    useEffect(() => {
        const hasChanges = JSON.stringify(formData) !== JSON.stringify(feedbackData);
        setIsUpdateBtnDisable(!hasChanges);
    }, [formData, feedbackData]);

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {/* Headline Field */}
                <div className="flex flex-col space-y-2">
                    <label htmlFor="headline" className="font-medium">
                        Headline
                    </label>
                    <input
                        name="headline"
                        id="headline"
                        type="text"
                        value={headline}
                        onChange={handleInputChange}
                        placeholder="Engineer/Designer etc."
                        className="border border-black px-4 py-2 placeholder-gray-500 focus:outline-none"
                    />
                </div>

                {/* Feedback Field */}
                <div className="flex flex-col space-y-2">
                    <label htmlFor="feedback" className="font-medium">
                        Share Your Thoughts
                    </label>
                    <textarea
                        name="feedback"
                        id="feedback"
                        rows="10"
                        value={feedback}
                        onChange={handleInputChange}
                        placeholder="Your suggestions help us grow!"
                        className="border border-black p-4 placeholder-gray-500 resize-none focus:outline-none"
                        required
                    />
                </div>

                {/* Submit Button */}
                <input
                    type="submit"
                    value="Save"
                    className={`w-fit rounded px-4 py-2.5 text-sm font-medium text-white bg-black cursor-pointer ${isUpdateBtnDisable ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''
                        }`}
                />
            </form>

            {/* Back Button */}
            <div className="absolute top-0 right-0">
                <button
                    onClick={() => setIsEditEnable(false)}
                    className="flex items-center text-blue-800 font-medium"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeMiterlimit={10}
                            strokeWidth={1.5}
                            d="m10 16l-4-4m0 0l4-4m-4 4h12"
                        />
                    </svg>
                    <span>Back</span>
                </button>
            </div>
        </div>
    );
};

export default Feedback;