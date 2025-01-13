import React, { useState } from "react";
import { Axios } from "axios"; // Updated import

const AdReview = ({ ad }) => {
  const [feedback, setFeedback] = useState("");
  const [reviewResult, setReviewResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleReviewSubmit = async () => {
    if (feedback.trim() === "") {
      alert("Please provide feedback!");
      return;
    }

    setLoading(true);

    try {
      // Send feedback and ad data to your AI service
      const response = await Axios.post("https://api.example.com/review", {
        adId: ad.id,
        feedback: feedback,
      });

      // Assume the AI response includes a 'result' (like analysis or approval)
      setReviewResult(response.data.result);
    } catch (error) {
      console.error("Error reviewing the ad:", error);
      setReviewResult("An error occurred while processing your review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ad-review">
      <h3>{ad.title}</h3>
      <img src={ad.image} alt={ad.title} />
      <p>{ad.description}</p>

      <textarea
        value={feedback}
        onChange={handleFeedbackChange}
        placeholder="Provide your review..."
      />

      <button onClick={handleReviewSubmit} disabled={loading}>
        {loading ? "Processing..." : "Submit Review"}
      </button>

      {reviewResult && <div className="review-result">{reviewResult}</div>}
    </div>
  );
};

export default AdReview;
