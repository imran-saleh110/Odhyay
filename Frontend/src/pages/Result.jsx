import { replace, useNavigate, useParams } from 'react-router'
import { useEffect, useState } from "react";
import '../styles/Result.css'
import AnsCard from '../components/AnsCard'
import axios from "../services/axios.js";
const Result = () => {

  const navigate = useNavigate();
  const { type, attemptId } = useParams(); //ranked or unranked
  const [settings, setSettings] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!attemptId) 
        return;

    axios.get(`/api/exam/${attemptId}`)
      .then((res) => {
        setSettings({
          type: res.data.type,
          questionCount: res.data.questionCount,
          minutes: res.data.minutes,
          secondTime: res.data.secondTime,
        });
      })
      .catch(() => {});

      axios.get(`/api/exam/${attemptId}/result`)
        .then((res) => {
          setResult(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });

  }, [attemptId]);

  async function handleRetry() {
    if (!settings)
        return;

    const res = await axios.post("/api/exam/start", settings);

    navigate(`/exam/${settings.type}/${res.data.attemptId}`);
  }

  function handleNewExam() {
    navigate(type === "ranked" ? "/rankedtest" : "/modeltest");
  }

  if (loading) return <div className="load-error">লোড হচ্ছে...</div>;
  if (error) return <div className="load-error">ত্রুটি: {error}</div>;

  const { summary, details } = result;

  return (
      <div className="result-container">
         <div className="result-heading">
            <h2>পরীক্ষা সম্পন্ন হয়েছে!</h2>
            <p>আপনার পরীক্ষার সংকলিত ফলাফল নিচে তুলে ধরা হলো</p>
         </div>

        <div className="mark-section">
            <div className="mark-card overall-mark">
                <h4>{summary.obtainedMarks} / {summary.totalMarks}</h4>
                <p>চূড়ান্ত নম্বর ({summary.percentage}%)</p>
            </div>

            <div className="mark-card corrects">
                <h4>{summary.correctCount}</h4>
                <p>সঠিক উত্তর (+১)</p>
            </div>

            <div className="mark-card wrongs">
                <h4>{summary.wrongCount}</h4>
                <p>ভুল উত্তর (-০.২৫)</p>
            </div>

            <div className="mark-card not-ans">
                <h4>{summary.notAnsweredCount}</h4>
                <p>উত্তর দেওয়া হয়নি</p>
            </div>

        </div>

        <div className="mark-section-2">
            <div className="main-mark">
                <p>মূল নম্বর (সঠিক - ভুল × ০.২৫):</p>
                <span>{summary.obtainedMarks}</span>
            </div>
            <div className='total-mark'>
                <p>মোট অর্জিত নম্বর:</p>
                <span>{summary.obtainedMarks} / {summary.totalMarks}</span>
            </div>
        </div>
        
        <div className="ans-details">
            <p>প্রশ্নোত্তর ও বিস্তারিত ব্যাখ্যা</p>
            <AnsCard details={details}/>
        </div>

        <div className="result-nav">
          {
            type === 'ranked' ? (
              <button className='next-button' onClick={() => navigate("/rankedtest", { replace: true } )}>লিডারবোর্ড দেখুন</button>
            ) :
            (
              <div className='next-prev-div'>
                <button className='next-button' onClick={handleNewExam}>নতুন পরীক্ষা</button>
                <button className='prev-button' onClick={handleRetry} disabled={!settings}>আবার চেষ্টা করুন</button>
              </div>
            )
          }
            
        </div>
      </div>
    
  )
}

export default Result
