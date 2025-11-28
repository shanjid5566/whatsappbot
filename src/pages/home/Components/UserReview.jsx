import { Star } from "lucide-react";
import { useState } from "react";
import { post } from "../../../service/apiService";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useProfile } from "../../../context/ProfileContext";

const UserReview = () => {
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  

  const { profile } = useProfile();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    if (!newRating || newRating < 1) {
      setErrorMessage("Please provide a rating.");
      return;
    }

    if (!newComment || newComment.trim().length < 3) {
      setErrorMessage("Please write a comment (at least 3 characters).");
      return;
    }

    const payload = {
      rating: newRating,
      comment: newComment.trim(),
      user: {
        fullName: profile?.fullName || "Anonymous",
      },
    };

    try {
  await post("/api/reviews/add", payload);
      await Swal.fire({ icon: "success", title: "Thank you!", text: "Your review has been submitted." });
      // reset form
      setNewComment("");
      setNewRating(0);
      setHoverRating(0);
      setErrorMessage("");
      // notify other components (same-tab and other tabs) to refetch reviews
      try {
        // same-tab listeners
        window.dispatchEvent(new Event("reviews:updated"));
        // cross-tab listeners (storage event)
        localStorage.setItem("reviews_updated_at", Date.now().toString());
      } catch {
        // ignore if window/localStorage not available in the environment
      }
    } catch (err) {
      const msg = err?.message || "Failed to submit review";
      await Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };

  return (
    <section className="bg-[#F5F2EC] py-10 xl:pb-20 xl:pt-14">
      <div className="container paddingContainer">
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
            Your Review
          </h2>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4 text-sm">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star Rating Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((starValue) => (
                  <Star
                    key={starValue}
                    className="w-7 h-7 cursor-pointer transition-colors duration-150"
                    fill={
                      (hoverRating || newRating) >= starValue
                        ? "currentColor"
                        : "none"
                    }
                    strokeWidth={1.5}
                    color={
                      (hoverRating || newRating) >= starValue
                        ? "#f59e0b" // Tailwind yellow-500
                        : "#9ca3af" // Tailwind gray-400
                    }
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setNewRating(starValue)}
                  />
                ))}
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Comment
              </label>
              <textarea
                id="comment"
                rows="4"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
                placeholder="Write your review here..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className=" bg-blue-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserReview;
