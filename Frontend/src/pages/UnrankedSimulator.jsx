import "../styles/UnrankedSimulator.css";
import { Award, Play, TriangleAlert } from "lucide-react";
import Footer from "../components/Footer";
import { useState } from 'react'
import { useNavigate } from 'react-router'
import axios from "axios";
const UnrankedSimulator = () => {
  const navigate = useNavigate();
  const [quesCount, setQuesCount] = useState("");
  const [minutes, setMinutes] = useState("");
  const [secondTime, setSecondTime] = useState(false);

  async function handleStart() {
    const res = await axios.post("/api/exam/start", {
      type: "unranked",
      questionCount: Number(quesCount) || 10,
      minutes: Number(minutes) || 10,
      secondTime,
    })

    navigate("/exam/unranked", {
      state: { attemptId: res.data.attemptId },
    });
  }

  return (
    <div>
      <div className="simulator-container">
      <div className="simulator-heading">
        <h3>
          <Award size={20} /> মডেল টেস্ট পরীক্ষা
        </h3>
        <p>
          আপনার সুবিধামতো বিষয়, অধ্যায় ও টপিক সিলেক্ট করে কাস্টম পরীক্ষা তৈরি
          করুন। রিয়েল-টাইম সময় ট্র্যাকিং, ফ্ল্যাগিং এবং বিস্তারিত ব্যাখ্যাসহ
          নিখুঁত ফলাফল দেখুন।
        </p>
      </div>
      <div className="simulator-card">
        <div className="steps">
          <div className="step-heading">
            <p>পরীক্ষার বিষয়বস্তু ও ব্যপ্তি নির্বাচন</p>
          </div>
          <div className="step-inputs">
            <div className="input-line">
              <div className="input-container">
                <label htmlFor="exam">পরীক্ষার বিভাগ</label>
                <select id="exam">
                  <option>Engineering University Preparation</option>
                  <option>Medical Preparation</option>
                  <option>Varsity Preparation</option>
                </select>
              </div>

              <div className="input-container">
                <label htmlFor="subject">বিষয়</label>
                <select id="subject">
                  <option>সকল বিষয়</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                </select>
              </div>
            </div>

            <div className="input-line">
              <div className="input-container">
                <label htmlFor="chapter">অধ্যায়</label>
                <select id="chapter">
                  <option>সকল অধ্যায়</option>
                  <option>Chapter 2</option>
                  <option>Chapter 3</option>
                </select>
              </div>

              <div className="input-container">
                <label htmlFor="topic">টপিক</label>
                <select id="topic">
                  <option>সকল টপিক</option>
                  <option>Topic 2</option>
                  <option>Topic 3</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="exam-description">
          <h4 style={{color : '#D4A017'}}> <TriangleAlert size={20} /> পরীক্ষার্থীদের প্রতি নির্দেশাবলী:</h4>
          <ul>
            <li>তুমি তোমার প্রস্তুতি অনুযায়ী উপরের ফিল্টারের মাধ্যমে প্রশ্নের ধরন সিলেক্ট করবে এবং নিচের বক্সে প্রশ্ন সংখ্যা ও পরীক্ষার সময় লিখে শুরু করি বাটনে ক্লিক করলে পরীক্ষা শুরু হয়ে যাবে।</li>
            <li>প্রতিটি ভুল উত্তরের জন্য নেগেটিভ মার্কিং ০.২৫ থাকবে। আর তুমি যদি মেডিকেল ভর্তি পরীক্ষার্থী হও, তাহলে সেকেন্ড টাইম অপশনে ক্লিক করলে ফলাফলে মোট নম্বরের ৫% কেটে দেখাবে।</li>
            <li>লক্ষাধিক প্রশ্নের ডাটাবেজ থেকে র‍্যান্ডমভাবে প্রতি সেটে তোমার নির্দিষ্ট সংখ্যক প্রশ্ন দেখানো হবে।</li>
            <li>তুমি যত পরীক্ষা দিবে, সব পরীক্ষার উত্তরপত্র সেভ হয়ে থাকবে। নিচের Exam Performance অপশনে ক্লিক করে তুমি সব পরীক্ষার উত্তরপত্র দেখতে পারবে।</li>
          </ul>
        </div>

        <div className="steps">
          <div className="step-heading">
            <p>পরীক্ষার সেটিংস ও সময় নির্ধারণ</p>
          </div>
          
          <div className="settings-container">
            <div className="quantity-container">
              <p>প্রশ্ন সংখ্যা</p>
              <input type="number" placeholder="১০" value={quesCount} onChange={(e) => setQuesCount(e.target.value)} />
            </div>
            <div className="quantity-container">
              <p>পরীক্ষার সময় (মিনিট)</p>
              <input type="number" placeholder="১০" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
            </div>
          </div>
          <div className="checkbox-container">
            <input type="checkbox" id="second-time" checked={secondTime} onChange={(e) => setSecondTime(e.target.checked)}/>
            <label htmlFor="second-time">সেকেন্ড টাইম অপশন (৫% নম্বর কর্তন হবে)</label>
          </div>
          
        
          <button onClick={handleStart} className="start-button">
            <Play size={20} />
            পরীক্ষা শুরু করুন
          </button>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default UnrankedSimulator;
