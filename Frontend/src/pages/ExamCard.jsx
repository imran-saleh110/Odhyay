import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import "../styles/ExamCard.css";
import { ArrowLeft, ArrowRight, Clock, Flag, Send } from "lucide-react";
import axios from "axios";
import Countdown from "react-countdown";
const ExamCard = () => {
  const navigate = useNavigate();
  const { type } = useParams(); //ranked or unranked
  const location = useLocation();

  const { attemptId } = location.state || {};

  useEffect(() => {
  if (!attemptId) 
    navigate(type === "ranked" ? "/rankedexam" : "/unrankedexam", { replace: true });
  }, []);

  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attemptLoaded, setAttemptLoaded] = useState(false);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const loading = !attemptLoaded || !questionsLoaded;
  
  useEffect(() => {
  if (!attemptId) return;

  axios.get(`/api/exam/${attemptId}`)
    .then((res) => {
      setAnswers(res.data.answers || {});
      setFlagged(res.data.flagged || []);
      setCurrentIndex(res.data.currentIndex || 0);
      setEndTime(res.data.endTime);
      setAttemptLoaded(true);
    })
    .catch((err) => { 
      setError(err.message); 
      setAttemptLoaded(true);
    });
  }, [attemptId]);

  function handleNext() {
    setCurrentIndex((prev) => prev + 1);
  }

  function handlePrev() {
    setCurrentIndex((prev) => prev - 1);
  }

  const [flagged, setFlagged] = useState([]);
  const [answers, setAnswers] = useState({});
  const [endTime, setEndTime] = useState(null);

  function toggleFlag(quesId) {
    if (flagged.includes(quesId)) {
      const newFlagged = flagged.filter((id) => id !== quesId);
      setFlagged(newFlagged);
    } else {
      const newFlagged = flagged.slice();
      newFlagged.push(quesId);
      setFlagged(newFlagged);
    }
  }

  function selectOption(questId, optId) {
    const newAnswers = {};
    for (const key in answers) {
      newAnswers[key] = answers[key];
    }

    newAnswers[questId] = optId;
    setAnswers(newAnswers);
  }

  useEffect(() => {
  if (!attemptId || loading) 
    return;

  const timeoutId = setTimeout(() => {
    axios.patch(`/api/exam/${attemptId}/progress`, { answers, flagged, currentIndex })
      .catch(() => {});
  }, 600);
  return () => clearTimeout(timeoutId);
}, [answers, flagged, currentIndex, attemptId, loading]);


  useEffect(() => {
    axios
      .get("/api/questions")
      .then((res) => {
        // const sliced = res.data.slice(0, Number(quesCount) || 10);
        // setQuestions(sliced);
        setQuestions(res.data);
        setQuestionsLoaded(true);
      })
      .catch((err) => {
        setError(err.message);
        setQuestionsLoaded(true);
      });
  }, []);

  function handleFinish() {
    navigate(`/result/${type}`);
  }

  if (loading) return <div className="load-error">লোড হচ্ছে...</div>;
  if (error) return <div className="load-error">ত্রুটি: {error}</div>;

  const currentQuestion = questions[currentIndex];

  return (
    <div className="exam-container">
      <div className="question-navigation">
        <div className="header-container">
          <span>একনজরে</span>
          <div className="timer-container">
            <Clock size={20} color="#c0c1ff" />
            <Countdown
              date={endTime}
              onComplete={() => handleFinish()}
              renderer={({ minutes, seconds }) => (
                <span>
                  {String(minutes).padStart(2, "0")}:
                  {String(seconds).padStart(2, "0")}
                </span>
              )}
            />
          </div>
        </div>
        <div className="navigation-container">
          {questions.map((ques, index) => {
            let status = "notAnswered";
            if (flagged.includes(ques._id)) status = "flagged";
            if (answers[ques._id] !== undefined) status = "answered";

            let activeClass = "";
            if (index === currentIndex) activeClass = "active";

            return (
              <div
                className={`ques-num ${status} ${activeClass}`}
                key={ques._id}
                onClick={() => setCurrentIndex(index)}
              >
                {index + 1}
              </div>
            );
          })}
        </div>
        <div className="details-container">
          <div className="details-line">
            <div className="det-circle circle1"></div>
            উত্তর দেওয়া হয়নি
          </div>

          <div className="details-line">
            <div className="det-circle circle2"></div>
            উত্তর দেওয়া হয়েছে
          </div>

          <div className="details-line">
            <div className="det-circle circle3"></div>
            ফ্ল্যাগ করা হয়েছে
          </div>
        </div>
        <div className="finish-exam">
          <button onClick={handleFinish}>
            {" "}
            <Send size={17} /> পরীক্ষা শেষ করুন
          </button>
        </div>
      </div>

      <div className="question-card-container">
        <div className="question-cardd">
          <div className="card-header">
            <div className="tag-section">
              <span>
                প্রশ্ন {currentIndex + 1}/{questions.length}
              </span>
              <div className="tag">
                {currentQuestion.type === "mcq" ? "এমসিকিউ" : "লিখিত"}
              </div>
            </div>
            <button
              className={
                flagged.includes(currentQuestion._id) ? "active-flag" : "flag"
              }
              onClick={() => toggleFlag(currentQuestion._id)}
            >
              <Flag size={15} />
              {flagged.includes(currentQuestion._id)
                ? "ফ্ল্যাগ সরান"
                : "ফ্ল্যাগ করুন"}
            </button>
          </div>

          <div className="ques-section">
            <div className="ques">
              <h3>{currentQuestion.questionText}</h3>
              {currentQuestion.questionImage ? (
                <img src={currentQuestion.questionImage} />
              ) : null}
            </div>
            <div className="option-section">
              {currentQuestion.type === "mcq" ? (
                currentQuestion.options.map((opt, index) => {
                  const isSelected = answers[currentQuestion._id] === opt.id;
                  return (
                    <div
                      className={isSelected ? "selected-option" : "option"}
                      key={opt.id}
                      onClick={() => selectOption(currentQuestion._id, opt.id)}
                    >
                      <div className={isSelected ? "selected-option-num" : "option-num"}>{index + 1}</div>
                      {opt.text}
                      {opt.image ? <img src={opt.image} alt="" /> : null}
                    </div>
                  );
                })
              ) : (
                <div className="written-answer-section">
                  <textarea placeholder="তোমার উত্তর লিখো..." />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="next-prev-ques">
          <button
            className="prev-button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ArrowLeft size={15} /> পূর্ববর্তী প্রশ্ন
          </button>

          <button
            className="next-button"
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
          >
            পরবর্তী প্রশ্ন <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
