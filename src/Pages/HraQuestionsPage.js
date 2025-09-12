import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Navbar from "./Navbar"; // Import Navbar
import Footer from "./Footer"; // Import Footer

const HraQuestionsPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // To store selected answers for each question
  const [staffId, setStaffId] = useState("6897188e4c8a74b47a017d9a"); // Example staffId, you can replace it as needed
  const [popupMessage, setPopupMessage] = useState(null); // State for storing the popup message
  const [popupDetails, setPopupDetails] = useState(null); // State for storing the popup details

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoryName = params.get("category");

  const navigate = useNavigate();

  useEffect(() => {
    if (categoryName) {
      setLoading(true);
      axios
        .get(`http://31.97.206.144:4051/api/admin/hra-questions?hraCategoryName=${categoryName}`)
        .then((response) => {
          if (response.data.hraQuestions) {
            setQuestions(response.data.hraQuestions);
          } else {
            setQuestions([]);
          }
          setLoading(false);
        })
        .catch((error) => {
          setError("No HRA questions");
          setLoading(false);
        });
    } else {
      setError("Category not found.");
      setLoading(false);
    }
  }, [categoryName]);

  const handleCheckboxChange = (questionId, optionId) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = () => {
    const formattedAnswers = Object.keys(answers).map((questionId) => ({
      questionId,
      selectedOption: answers[questionId],
    }));

    const payload = {
      staffId,
      answers: formattedAnswers,
    };

    // API call to submit answers
    axios
      .post("http://31.97.206.144:4051/api/staff/submit-hra-answers", payload)
      .then((response) => {
        // Set the popup message and details
        setPopupMessage(response.data.message);
        setPopupDetails({
          totalPoints: response.data.totalPoints,
          riskLevel: response.data.riskLevel,
          riskMessage: response.data.riskMessage,
        });
      })
      .catch((error) => {
        alert(`Error: ${error.response ? error.response.data.message : error.message}`);
      });
  };

  const renderQuestions = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    if (questions.length > 0) {
      return (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold">{question.question}</h3>
              <div className="mt-4">
                {question.options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`question-${question._id}-option-${option._id}`}
                      checked={answers[question._id] === option._id}
                      onChange={() => handleCheckboxChange(question._id, option._id)} // Use option._id
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <label
                      htmlFor={`question-${question._id}-option-${option._id}`}
                      className="text-gray-700"
                    >
                      {option.text}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700">Oops! No Questions Found</h3>
          <p className="mt-4 text-gray-600 text-center">
            No questions are available for this category right now. Please check back later.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          >
            Go Back
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Include the Navbar */}
      <Navbar />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-600">
          Questions for {categoryName}
        </h2>
        {renderQuestions()}

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
          >
            Submit Answers
          </button>
        </div>
      </div>

      {/* Popup Modal */}
      {popupMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-center">{popupMessage}</h3>
            <div className="mt-4 text-center">
              <p>Total Points: {popupDetails.totalPoints}</p>
              <p>Risk Level: {popupDetails.riskLevel}</p>
              <p>{popupDetails.riskMessage}</p>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setPopupMessage(null)} // Close the popup
                className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Include the Footer */}
      <Footer />
    </div>
  );
};

export default HraQuestionsPage;
