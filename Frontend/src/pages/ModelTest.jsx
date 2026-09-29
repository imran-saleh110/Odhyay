import "../styles/ModelTest.css";
import { Award, Play, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "../services/axios.js";

const ModelTest = () => {
  const navigate = useNavigate();

  const [quesCount, setQuesCount] = useState("");
  const [minutes, setMinutes] = useState("");
  const [secondTime, setSecondTime] = useState(false);

  const [modules, setModules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);

  const [modulesLoaded, setModulesLoaded] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [curriculumError, setCurriculumError] = useState(null);

  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");

  const [formError, setFormError] = useState("");

  useEffect(() => {
    axios
      .get("/api/taxonomy/modules")
      .then((res) => {
        setModules(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedModuleId(res.data.data[0]._id);
          setModulesLoaded(true);
        }
      })
      .catch(() => {setModulesLoaded(true)});
  }, []);

  useEffect(() => {
    if (!modulesLoaded) return; 
    if (!selectedModuleId) {
      setSubjects([]);
      setSubjectsLoading(false);
      return;
    }
    setSubjectsLoading(true);
    axios
      .get("/api/taxonomy/subjects", { params: { moduleId: selectedModuleId } })
      .then((res) => {
        setSubjects(res.data.data);
        setSubjectsLoading(false);
      })
      .catch((err) => {
        setCurriculumError(err.message);
        setSubjectsLoading(false);
      });
  }, [selectedModuleId, modulesLoaded]);

  useEffect(() => {
    if (!selectedSubjectId) {
      setChapters([]);
      return;
    }
    axios
      .get("/api/taxonomy/chapters", {
        params: { subjectId: selectedSubjectId },
      })
      .then((res) => setChapters(res.data.data))
      .catch((err) => setCurriculumError(err.message));
  }, [selectedSubjectId]);

  useEffect(() => {
    if (!selectedChapterId) {
      setTopics([]);
      return;
    }
    axios
      .get("/api/taxonomy/topics", { params: { chapterId: selectedChapterId } })
      .then((res) => setTopics(res.data.data))
      .catch((err) => setCurriculumError(err.message));
  }, [selectedChapterId]);

  function handleModuleChange(e) {
    setSelectedModuleId(e.target.value);
    setSelectedSubjectId("");
    setSelectedChapterId("");
    setSelectedTopicId("");
  }

  function handleSubjectChange(e) {
    setSelectedSubjectId(e.target.value);
    setSelectedChapterId("");
    setSelectedTopicId("");
  }

  function handleChapterChange(e) {
    setSelectedChapterId(e.target.value);
    setSelectedTopicId("");
  }

  function handleTopicChange(e) {
    setSelectedTopicId(e.target.value);
  }

  async function handleStart() {
    const count = Number(quesCount) || 10;
    const time = Number(minutes) || 10;

    if (count <= 0 || count >= 100) {
      setFormError("প্রশ্ন সংখ্যা ১ থেকে ৯৯ এর মধ্যে হতে হবে");
      return;
    }

    if (time <= 0 || time >= 100) {
      setFormError("পরীক্ষার সময় ১ থেকে ৯৯ মিনিটের মধ্যে হতে হবে");
      return;
    }
    setFormError("");

    try {
      const res = await axios.post("/api/exam/start", {
        type: "unranked",
        questionCount: count,
        minutes: time,
        secondTime,
        moduleId: selectedModuleId || undefined,
        subjectId: selectedSubjectId || undefined,
        chapterId: selectedChapterId || undefined,
        topicId: selectedTopicId || undefined,
      });

      navigate(`/exam/unranked/${res.data.attemptId}`, { replace: true });
    } catch (err) {
      setFormError(err.response?.data?.error || "পরীক্ষা শুরু করা যায়নি");
    }
  }

  if (subjectsLoading) return <div className="load-error">লোড হচ্ছে...</div>;
  if (curriculumError)
    return <div className="load-error">ত্রুটি: {curriculumError}</div>;

  return (
    <div>
      <div className="simulator-container">
        <div className="simulator-heading">
          <h3>
            <Award size={20} /> মডেল টেস্ট পরীক্ষা
          </h3>
          <p>
            আপনার সুবিধামতো বিষয়, অধ্যায় ও টপিক সিলেক্ট করে কাস্টম পরীক্ষা
            তৈরি করুন। রিয়েল-টাইম সময় ট্র্যাকিং, ফ্ল্যাগিং এবং বিস্তারিত
            ব্যাখ্যাসহ নিখুঁত ফলাফল দেখুন।
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
                  <select
                    id="exam"
                    value={selectedModuleId}
                    onChange={handleModuleChange}
                  >
                    {modules.map((mod) => (
                      <option key={mod._id} value={mod._id}>
                        {mod.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-container">
                  <label htmlFor="subject">বিষয়</label>
                  <select
                    id="subject"
                    value={selectedSubjectId}
                    onChange={handleSubjectChange}
                  >
                    <option value="">সকল বিষয়</option>
                    {subjects.map((subject) => (
                      <option key={subject._id} value={subject._id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="input-line">
                <div className="input-container">
                  <label htmlFor="chapter">অধ্যায়</label>
                  <select
                    id="chapter"
                    value={selectedChapterId}
                    onChange={handleChapterChange}
                    disabled={!selectedSubjectId}
                  >
                    <option value="">সকল অধ্যায়</option>
                    {chapters.map((chapter) => (
                      <option key={chapter._id} value={chapter._id}>
                        {chapter.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-container">
                  <label htmlFor="topic">টপিক</label>
                  <select
                    id="topic"
                    value={selectedTopicId}
                    onChange={handleTopicChange}
                    disabled={!selectedChapterId}
                  >
                    <option value="">সকল টপিক</option>
                    {topics.map((topic) => (
                      <option key={topic._id} value={topic._id}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="exam-description">
            <h4 style={{ color: "#D4A017" }}>
              {" "}
              <TriangleAlert size={20} /> পরীক্ষার্থীদের প্রতি নির্দেশাবলী:
            </h4>
            <ul>
              <li>
                তুমি তোমার প্রস্তুতি অনুযায়ী উপরের ফিল্টারের মাধ্যমে প্রশ্নের
                ধরন সিলেক্ট করবে এবং নিচের বক্সে প্রশ্ন সংখ্যা ও পরীক্ষার সময়
                লিখে শুরু করি বাটনে ক্লিক করলে পরীক্ষা শুরু হয়ে যাবে।
              </li>
              <li>
                প্রতিটি ভুল উত্তরের জন্য নেগেটিভ মার্কিং ০.২৫ থাকবে। আর তুমি যদি
                মেডিকেল ভর্তি পরীক্ষার্থী হও, তাহলে সেকেন্ড টাইম অপশনে ক্লিক
                করলে ফলাফলে মোট নম্বরের ৫% কেটে দেখাবে।
              </li>
              <li>
                লক্ষাধিক প্রশ্নের ডাটাবেজ থেকে র‍্যান্ডমভাবে প্রতি সেটে তোমার
                নির্দিষ্ট সংখ্যক প্রশ্ন দেখানো হবে।
              </li>
              <li>
                তুমি যত পরীক্ষা দিবে, সব পরীক্ষার উত্তরপত্র সেভ হয়ে থাকবে।
                নিচের Exam Performance অপশনে ক্লিক করে তুমি সব পরীক্ষার
                উত্তরপত্র দেখতে পারবে।
              </li>
            </ul>
          </div>

          <div className="steps">
            <div className="step-heading">
              <p>পরীক্ষার সেটিংস ও সময় নির্ধারণ</p>
            </div>

            <div className="settings-container">
              <div className="quantity-container">
                <p>প্রশ্ন সংখ্যা</p>
                <input
                  type="number"
                  placeholder="১০"
                  value={quesCount}
                  onChange={(e) => setQuesCount(e.target.value)}
                />
              </div>
              <div className="quantity-container">
                <p>পরীক্ষার সময় (মিনিট)</p>
                <input
                  type="number"
                  placeholder="১০"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                />
              </div>
            </div>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="second-time"
                checked={secondTime}
                onChange={(e) => setSecondTime(e.target.checked)}
              />
              <label htmlFor="second-time">
                সেকেন্ড টাইম অপশন (৫% নম্বর কর্তন হবে)
              </label>
            </div>
            {formError && <p className="form-error">{formError}</p>}
            <button onClick={handleStart} className="start-button">
              <Play size={20} />
              পরীক্ষা শুরু করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelTest;
