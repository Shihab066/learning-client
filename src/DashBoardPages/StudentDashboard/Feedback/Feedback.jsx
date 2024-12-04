import useAuth from "../../../hooks/useAuth";
import { addFeedback } from "../../../services/feedbackService";
import { toastSuccess } from "../../../utils/toastUtils";

const Feedback = () => {
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const heading = form.headline.value;
        const feedback = form.headline.value;

        const feedbackData = {
            userId: user.uid,
            name: user.displayName,
            profileImage: user.photoURL,
            heading,
            feedback,
        };

        const res = await addFeedback(feedbackData);
        if (res.insertedId) {
            toastSuccess('Your feedback has been submitted.')
            e.target.reset();
        }
    };
    return (
        <section>
            <div>
                <h2 className="text-xl font-medium mb-2">
                    Feedback
                </h2>
                <hr />
            </div>

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
        </section>
    );
};

export default Feedback;