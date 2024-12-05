import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { addFeedback, getFeedbackById, removeFeedback, updateFeedback } from "../../../services/feedbackService";
import { removeAlert, toastSuccess } from "../../../utils/toastUtils";
import { useEffect, useState } from "react";
import EditIcon from "../../../components/Icons/EditIcon";
import DeleteIcon from "../../../components/Icons/DeleteIcon";

const Feedback = () => {
    const { user } = useAuth();
    const { data = null, isLoading } = useQuery({
        queryKey: ['my-feedback'],
        enabled: !!user,
        queryFn: async () => {
            const res = await getFeedbackById(user.uid);
            return res;
        }
    });

    console.log(data)
    return (
        <section>
            <div>
                <h2 className="text-xl font-medium mb-2">
                    Feedback
                </h2>
                <hr />
            </div>

            {
                data
                    ?
                    <MyFeedBack
                        user={user}
                        data={data}
                    />
                    :
                    <FeedbackForm
                        user={user}
                    />
            }

        </section>
    );
};

const FeedbackForm = ({ user }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const headline = form.headline.value;
        const feedback = form.feedback.value;

        const feedbackData = {
            userId: user.uid,
            name: user.displayName,
            profileImage: user.photoURL,
            headline,
            feedback,
        };

        const res = await addFeedback(feedbackData);
        if (res.insertedId) {
            toastSuccess('Your feedback has been submitted.')
            e.target.reset();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="flex flex-col space-y-2">
                <label htmlFor="headline" className="font-medium">Headline</label>
                <input
                    name="headline"
                    id="headline"
                    type="text"
                    className="focus:outline-none border border-black py-2 px-4 placeholder-gray-500"
                    placeholder="Engnieer/Designer etc."
                />
            </div>

            <div className="flex flex-col space-y-2">
                <label htmlFor="feedback" className="font-medium">Share Your Thoughts</label>
                <textarea
                    name="feedback"
                    id="feedback"
                    rows="10"
                    placeholder="Your suggestions help us grow!"
                    className="focus:outline-none border border-black resize-none p-4 placeholder-gray-500 "
                />
            </div>

            <input
                type="submit"
                className={`w-fit text-sm font-medium text-white bg-black px-3 py-2.5 rounded cursor-pointer`}
                value='Submit'
            />
        </form>
    )
};

const MyFeedBack = ({ user, data }) => {
    const { headline, feedback } = data;
    const feedbackData = {
        userId: user.uid,
        headline,
        feedback
    };

    const [isEditEnable, setIsEditEnable] = useState(false);
    const queryClient = useQueryClient();

    const handleRemoveFeedback = () => {
        removeAlert()
            .then(async (result) => {
                if (result.isConfirmed) {
                    const res = await removeFeedback(user.uid);
                    if (res.deletedCount) {
                        toastSuccess('Your feedback has been removed');
                        queryClient.refetchQueries(['my-feedback']);
                    }
                }
            })
    };

    return (
        <>
            {
                isEditEnable
                    ?
                    <FeedbackUpdateForm
                        feedbackData={feedbackData}
                        setIsEditEnable={setIsEditEnable}
                    />
                    :
                    <div className="py-4 px-4 border rounded-xl mt-4">
                        <div className="relative">
                            <h2 className="font-medium mb-2">
                                Your feedback
                            </h2>

                            <div className="absolute top-0 right-0 flex items-center gap-x-3">
                                <span
                                    onClick={handleRemoveFeedback}
                                    className="cursor-pointer"
                                >
                                    <DeleteIcon />
                                </span>

                                <span
                                    className="cursor-pointer"
                                    onClick={() => setIsEditEnable(true)}
                                    title="edit"
                                >
                                    <EditIcon />
                                </span>
                            </div>
                        </div>
                        <p>
                            {feedback}
                        </p>
                    </div>
            }
        </>
    )
};

const FeedbackUpdateForm = ({ feedbackData, setIsEditEnable }) => {
    const [formData, setFormData] = useState(feedbackData);
    const { headline, feedback } = formData;
    const [isUpdateBtnDisable, setIsUpdateBtnDisable] = useState(true);
    const queryClient = useQueryClient();

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await updateFeedback(formData);
        if (res.modifiedCount) {
            toastSuccess('feedback update successfully')
            setIsEditEnable(false);
            queryClient.refetchQueries(['my-feedback']);
        }
    };

    useEffect(() => {
        const hasChanges = JSON.stringify(formData) !== JSON.stringify(feedbackData);
        setIsUpdateBtnDisable(!hasChanges);
    }, [formData]);

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="flex flex-col space-y-2">
                    <label htmlFor="headline" className="font-medium">Headline</label>
                    <input
                        onChange={(e) => handleInputChange(e)}
                        name="headline"
                        id="headline"
                        type="text"
                        className="focus:outline-none border border-black py-2 px-4 placeholder-gray-500"
                        placeholder="Engnieer/Designer etc."
                        value={headline}
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <label htmlFor="feedback" className="font-medium">Share Your Thoughts</label>
                    <textarea
                        onChange={(e) => handleInputChange(e)}
                        name="feedback"
                        id="feedback"
                        rows="10"
                        placeholder="Your suggestions help us grow!"
                        value={feedback}
                        className="focus:outline-none border border-black resize-none p-4 placeholder-gray-500 "
                        required
                    />
                </div>

                <input
                    type="submit"
                    className={`w-fit text-sm font-medium text-white bg-black px-4 py-2.5 rounded cursor-pointer ${isUpdateBtnDisable ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''}`}
                    value='Save'
                />
            </form>

            <div className="absolute top-0 right-0">
                <button
                    onClick={() => setIsEditEnable(false)}
                    className="font-medium flex items-center text-blue-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10} strokeWidth={1.5} d="m10 16l-4-4m0 0l4-4m-4 4h12"></path></svg>
                    <span>
                        Back
                    </span>
                </button>
            </div>
        </div>
    )
};
export default Feedback;