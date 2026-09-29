import "../styles/StudentProfile.css";
import {
  Award,
  BookOpen,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import Chart from "../components/Chart.jsx";
import ProgressCard from "../components/ProgressCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "../services/axios.js";
import { useEffect, useState } from "react";

const StudentProfile = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [streakData, setStreakData] = useState(null);

  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");

  useEffect(() => {
    axios
      .get("/api/taxonomy/modules")
      .then((res) => {
        setModules(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedModuleId(res.data.data[0]._id);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedModuleId) return;
    axios
      .get("/api/exam/profile-stats", { params: { moduleId: selectedModuleId } })
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, [selectedModuleId]);

  useEffect(() => {
    axios
      .get("/api/exam/streak")
      .then((res) => setStreakData(res.data))
      .catch(() => {});
  }, []);

  const streak = streakData?.streak || 0;
  const bars = [];
  for (let i = 0; i < 7; i++) bars.push({ isActive: i < streak });

  if (loading) return <div className="user-container">লোড হচ্ছে...</div>;
  if (!user) return <div className="user-container">আপনি সাইন ইন করেননি</div>;

  return (
    <div className="user-container">
      <div className="user-details-card">
        <div className="profile-section">
          <div className="profile-img">
            {isAuthenticated ? Array.from(user.displayName)[0] : null}
          </div>
          <div className="name-email-section">
            <h3>{user.displayName}</h3>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="streak-section">
          <div className="heading">
            <p>ধারাবাহিকতা ট্র্যাকার (সাপ্তাহিক)</p>
            <span>
              {" "}
              <Zap size={15} /> সক্রিয়
            </span>
          </div>
          <div className="days-meter-section">
            <div className="days-card">
              <p>{streak}</p>
              <span>দিন</span>
            </div>
            <div className="streak-text-section">
              <h6>ধারাবাহিক স্ট্রিক</h6>
              <p>{streak > 0
                    ? "লক্ষ্য বজায় আছে"
                    : "আজ একটি পরীক্ষা দিন"}
              </p>
            </div>
            <div className="streak-meter">
              {bars.map((day, i) => (
                <div className="streak-bar-div" key={i}>
                  <div
                    className={
                      day.isActive ? "streak-bar" : "streak-bar not-filled"
                    }
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="more-details-card-container">
        <div className="more-details-card">
          <div className="more-det-card-heading">
            <p>সমাধান করা প্রশ্ন</p>
            <BookOpen size={16} color="#8a8890" />
          </div>

          <h3>{stats ? stats.questionsSolved : 0}</h3>
          <p>অনন্য জমাদান</p>
        </div>

        <div className="more-details-card">
          <div className="more-det-card-heading">
            <p>পরীক্ষার সংখ্যা </p>
            <Award size={16} color="#8a8890" />
          </div>

          <h3>{stats ? stats.completedExams : 0}</h3>
          <p>সম্পন্ন সেশন</p>
        </div>

        <div className="more-details-card">
          <div className="more-det-card-heading">
            <p>গড় স্কোর</p>
            <TrendingUp size={16} color="#8a8890" />
          </div>
          <h3>{stats?.avgScore || 0}%</h3>
          <p>সকল পরীক্ষার গড়</p>
        </div>

        <div className="more-details-card">
          <div className="more-det-card-heading">
            <p>সর্বোচ্চ স্কোর</p>
            <Target size={16} color="#8a8890" />
          </div>
          <h3>{stats?.bestScore || 0}%</h3>
          <p>সেরা ফলাফল</p>
        </div>
      </div>

      <div className="performance-container">
        <div className="graph-card">
          <Chart data={stats ? stats.scoreHistory : []} />
        </div>
        <div className="progress-card">
          <div className="module-tabs">
            {modules.map((mod) => (
              <button
                key={mod._id}
                type="button"
                className={
                  selectedModuleId === mod._id
                    ? "module-tab active"
                    : "module-tab not-active"
                }
                onClick={() => setSelectedModuleId(mod._id)}
              >
                {mod.name}
              </button>
            ))}
          </div>
          <div className="divider"></div>
          <ProgressCard subjects={stats ? stats.subjectProgress : []} />
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
