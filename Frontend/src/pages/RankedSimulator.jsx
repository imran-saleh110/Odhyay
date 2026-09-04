import "../styles/RankedSimulator.css";
import { BarChart3, Hourglass, Users } from "lucide-react";
import Footer from "../components/Footer";
import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
const RankedSimulator = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("full");

  const EXAM_MODES = {
    full: { label: "পূর্ণাঙ্গ সিলেবাস", quesCount: 10, minutes: 4 },
    chapter: { label: "অধ্যায়ভিত্তি", quesCount: 5, minutes: 2 },
  };

  async function handleStartRank() {
    const { quesCount, minutes } = EXAM_MODES[mode];
    
    const res = await axios.post("/api/exam/start", {
      type: "ranked",
      questionCount: quesCount,
      minutes,
    });

    navigate("/exam/ranked", {
      state: { attemptId: res.data.attemptId, mode },
    });
}

  return (
    <div>
      <div className="ranked-simulator-container">
        <div className="rank-header-container">
          <div className="ranked-heading">
            <h3>
              {" "}
              <BarChart3 /> প্রস্তুতি যাচাই পরীক্ষা (Timed)
            </h3>
            <p>
              নির্দিষ্ট সময়সীমায় নিজের মেধা যাচাই করুন এবং লিডারবোর্ডে শীর্ষে
              থাকার প্রতিযোগিতা করুন।
            </p>
          </div>

          <div className="rank-header-card">
            <div className="rank-header-card-item">
              <p>সর্বোত্তম নম্বর</p>
              <p className="r-h-c-v">৮৪</p>
            </div>
            <div className="vertical-divider"></div>
            <div className="rank-header-card-item">
              <p>সম্পন্ন পরীক্ষা</p>
              <p className="r-h-c-v">৮</p>
            </div>
          </div>
        </div>

        <div className="ranked-cards-section">
          <div className="exam-start-card">
            <p>
              {" "}
              <Hourglass size={15} /> পরীক্ষার ধরন নির্ধারণ করুন
            </p>
            <div className="divider"></div>
            <p>পরীক্ষার ব্যাপ্তি</p>
            <div className="selection-card-container">
              <div
                className={`selection-card c1 ${mode === "full" ? "active" : ""}`}
                onClick={() => setMode("full")}
              >
                <h5>পূর্ণাঙ্গ সিলেবাস</h5>
                <p>১০টি প্রশ্ন • ৪ মিনিট</p>
              </div>
              <div
                className={`selection-card c1 ${mode === "chapter" ? "active" : ""}`}
                onClick={() => setMode("chapter")}
              >
                <h5>অধ্যায়ভিত্তি</h5>
                <p>৫টি প্রশ্ন • ২ মিনিট</p>
              </div>
            </div>

            <div className="selection-card">
              <h5>গুরুত্বপূর্ণ নিয়মাবলি</h5>
              <p>
                পরীক্ষা শুরু হলে নির্ধারিত সময়ের মধ্যে সব উত্তর প্রদান করতে হবে।
                সময় শেষ হলে স্বয়ংক্রিয়ভাবে উত্তরপত্র জমা হয়ে যাবে।
              </p>
            </div>
            <button onClick={handleStartRank} className="start-button">
              পরীক্ষায় অংশ নিন
            </button>
          </div>
          <div className="leaderboard-card">
            <p>
              {" "}
              <Users size={15} /> গ্লোবাল লিডারবোর্ড
            </p>
            <div className="top-names">
              <div className="name-card">
                <div className="name-rank">
                  <span>#1</span>
                  <p>Rock Johnson</p>
                </div>

                <div className="percentage">100%</div>
              </div>

              <div className="name-card">
                <div className="name-rank">
                  <span>#2</span>
                  <p>Brad Pit</p>
                </div>

                <div className="percentage">97%</div>
              </div>

              <div className="name-card">
                <div className="name-rank">
                  <span>#3</span>
                  <p>Imran Eistein</p>
                </div>

                <div className="percentage">67%</div>
              </div>

              <div className="name-card">
                <div className="name-rank">
                  <span>#4</span>
                  <p>Chirlie kirk</p>
                </div>

                <div className="percentage">60%</div>
              </div>

              <div className="name-card">
                <div className="name-rank">
                  <span>#5</span>
                  <p>Chill guy</p>
                </div>

                <div className="percentage">33%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RankedSimulator;
