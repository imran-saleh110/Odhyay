import "../styles/HomeShowcase.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { ArrowRight, Bookmark, Play } from "lucide-react";
import axios from "../services/axios.js";
import McqQuestion from "./McqQuestion.jsx";
import { useAuth } from "../context/AuthContext";

const SURFACE_W = 1148;
const SURFACE_H = 590;
const PREVIEW_LIMIT = 1;

const TABS = [
  { id: "solve", label: "প্রশ্ন সমাধান", to: "/questionsolving" },
  { id: "saved", label: "সংরক্ষিত প্রশ্ন", to: "/savedquestions" },
  { id: "exam", label: "পরীক্ষা", to: "/modeltest" },
];

const loadOptions = (url, setData) => {
  axios
    .get(url)
    .then((res) => setData(res.data?.data || []))
    .catch(() => setData([]));
};

const HomeShowcase = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [tab, setTab] = useState("solve");
  const [scale, setScale] = useState(1);

  const [fluid, setFluid] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const onChange = (e) => setFluid(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const [modules, setModules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);

  const [moduleId, setModuleId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [topicId, setTopicId] = useState("");

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savingIds, setSavingIds] = useState(() => new Set());

  const [quesCount, setQuesCount] = useState("20");
  const [minutes, setMinutes] = useState("30");

  const frameRef = useRef(null);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / SURFACE_W);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    loadOptions("/api/taxonomy/modules", setModules);
  }, []);

  useEffect(() => {
    if (!moduleId) return;
    loadOptions(`/api/taxonomy/subjects?moduleId=${moduleId}`, setSubjects);
  }, [moduleId]);

  useEffect(() => {
    if (!subjectId) return;
    loadOptions(`/api/taxonomy/chapters?subjectId=${subjectId}`, setChapters);
  }, [subjectId]);

  useEffect(() => {
    if (!chapterId) return;
    loadOptions(`/api/taxonomy/topics?chapterId=${chapterId}`, setTopics);
  }, [chapterId]);

  const subjectOptions = moduleId ? subjects : [];
  const chapterOptions = subjectId ? chapters : [];
  const topicOptions = chapterId ? topics : [];

  const shouldFetch = tab === "solve" || (tab === "saved" && isAuthenticated);

  const limit = PREVIEW_LIMIT;

  useEffect(() => {
    if (!shouldFetch) return;

    let cancelled = false;
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/questions", {
          params: {
            ...(tab === "saved" ? { saved: true } : {}),
            moduleId,
            subject: subjectId,
            chapter: chapterId,
            topic: topicId,
            page: 1,
            limit,
          },
        });
        if (cancelled) return;
        setQuestions(res.data?.data?.questions ?? []);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setQuestions([]);
        setError(err.response?.data?.message || err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchQuestions();
    return () => {
      cancelled = true;
    };
  }, [shouldFetch, tab, limit, moduleId, subjectId, chapterId, topicId]);

  const handleToggleSave = useCallback(
    async (question) => {
      if (savingIds.has(question._id)) return;
      setSavingIds((prev) => new Set(prev).add(question._id));

      try {
        if (question.saved) {
          await axios.delete(`/api/questions/${question._id}/save`);
          setQuestions((prev) =>
            tab === "saved"
              ? prev.filter((q) => q._id !== question._id)
              : prev.map((q) => (q._id === question._id ? { ...q, saved: false } : q))
          );
        } else {
          await axios.post(`/api/questions/${question._id}/save`);
          setQuestions((prev) => prev.map((q) => (q._id === question._id ? { ...q, saved: true } : q)));
        }
      } catch (err) {
        if (err.response?.status === 401) navigate("/signin");
      } finally {
        setSavingIds((prev) => {
          const next = new Set(prev);
          next.delete(question._id);
          return next;
        });
      }
    },
    [navigate, savingIds, tab]
  );

  const resetBelow = (setter) => (value) => {
    setter(value);
    setSubjectId("");
    setChapterId("");
    setTopicId("");
  };

  const activeTab = TABS.find((t) => t.id === tab);

  const filterFields = (
    <>
      <label className="showcase-field">
        <span>বিভাগ</span>
        <select value={moduleId} onChange={(e) => resetBelow(setModuleId)(e.target.value)}>
          <option value="">সব বিভাগ</option>
          {modules.map((mod) => (
            <option key={mod._id} value={mod._id}>{mod.name}</option>
          ))}
        </select>
      </label>

      <label className="showcase-field">
        <span>বিষয়</span>
        <select value={subjectId} onChange={(e) => resetBelow(setSubjectId)(e.target.value)} disabled={!moduleId}>
          <option value="">সব বিষয়</option>
          {subjectOptions.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
      </label>

      <label className="showcase-field">
        <span>অধ্যায়</span>
        <select value={chapterId} onChange={(e) => resetBelow(setChapterId)(e.target.value)} disabled={!subjectId}>
          <option value="">সব অধ্যায়</option>
          {chapterOptions.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </label>

      <label className="showcase-field">
        <span>টপিক</span>
        <select value={topicId} onChange={(e) => setTopicId(e.target.value)} disabled={!chapterId}>
          <option value="">সব টপিক</option>
          {topicOptions.map((t) => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>
      </label>
    </>
  );

  const filterPanel = (title) => (
    <div className="showcase-filters">
      <div className="showcase-rail-title">{title}</div>
      <div className="showcase-filter-grid">{filterFields}</div>
    </div>
  );

  const questionList = (emptyMessage) => {
    if (loading) return <div className="showcase-note">লোড হচ্ছে…</div>;
    if (error) return <div className="showcase-note">{error}</div>;
    if (!questions.length) return <div className="showcase-note">{emptyMessage}</div>;

    return questions.map((question, index) => (
      <McqQuestion
        key={question._id}
        question={question}
        current={index + 1}
        total={questions.length}
        isSaved={!!question.saved}
        isSaving={savingIds.has(question._id)}
        onToggleSave={() => handleToggleSave(question)}
      />
    ));
  };

  const renderPanel = () => {
    if (tab === "exam") {
      return (
        <div className="showcase-exam">
          <div className="showcase-exam-copy">
            <h3>নিজের মতো করে পরীক্ষা সাজান</h3>
            <p>
              বিভাগ, বিষয়, অধ্যায় ও টপিক বেছে নিয়ে প্রশ্ন সংখ্যা আর সময় ঠিক করুন।
              রিয়েল-টাইম সময় ট্র্যাকিং, ফ্ল্যাগিং আর ব্যাখ্যাসহ বিস্তারিত ফলাফল — সব একসাথে।
            </p>
            <div className="showcase-exam-meta">
              <span>নেগেটিভ মার্কিং ০.২৫</span>
              <span>সেকেন্ড টাইম সুবিধা</span>
              <span>ফ্ল্যাগ ও রিভিউ</span>
            </div>
            <NavLink to="/modeltest" className="showcase-cta">
              <Play size={15} /> পরীক্ষা শুরু করুন
            </NavLink>
          </div>

          <div className="showcase-rail">
            <div className="showcase-rail-title">পরীক্ষার বিষয়বস্তু ও ব্যপ্তি</div>
            {filterFields}
            <div className="showcase-inline-fields">
              <label className="showcase-field">
                <span>প্রশ্ন সংখ্যা</span>
                <input type="number" min="1" max="200" value={quesCount} onChange={(e) => setQuesCount(e.target.value)} />
              </label>
              <label className="showcase-field">
                <span>সময় (মিনিট)</span>
                <input type="number" min="1" max="300" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
              </label>
            </div>
            <div className="showcase-summary">
              {modules.find((m) => m._id === moduleId)?.name || "সব বিভাগ"} · {quesCount || 0} টি প্রশ্ন · {minutes || 0} মিনিট
            </div>
          </div>
        </div>
      );
    }

    if (tab === "saved") {
      return (
        <div className="showcase-stack">
          {filterPanel("ফিল্টার ও অনুসন্ধান")}
          <div className="showcase-questions">
            {isAuthenticated ? (
              questionList("আপনি এখনো কোনো প্রশ্ন সংরক্ষণ করেননি")
            ) : (
              <div className="showcase-signin">
                <Bookmark size={28} />
                <h3>সংরক্ষিত প্রশ্ন</h3>
                <p>পছন্দের প্রশ্নগুলো এখানে জমা হবে। সাইন ইন করলেই আপনার সংরক্ষণ ফিরে পাবেন।</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="showcase-stack">
        {filterPanel("ফিল্টার ও অনুসন্ধান")}
        <div className="showcase-questions">{questionList("কোনো প্রশ্ন পাওয়া যায়নি")}</div>
      </div>
    );
  };

  return (
    <div
      className={`showcase-frame${fluid ? " fluid" : ""}`}
      ref={frameRef}
      style={fluid ? undefined : { height: SURFACE_H * scale }}
    >
      <div
        className="showcase-surface"
        style={
          fluid
            ? undefined
            : { width: SURFACE_W, height: SURFACE_H, transform: `scale(${scale})` }
        }
      >
        <div className="showcase-tabbar" role="tablist" aria-label="প্রিভিউ">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`showcase-tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls="showcase-panel"
              className={`showcase-tab${tab === t.id ? " active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
          <NavLink to={activeTab.to} className="showcase-open">
            পূর্ণ পাতা খুলুন <ArrowRight size={14} />
          </NavLink>
        </div>

        <div
          className="showcase-panel"
          id="showcase-panel"
          role="tabpanel"
          aria-labelledby={`showcase-tab-${tab}`}
        >
          {renderPanel()}
        </div>
      </div>
    </div>
  );
};

export default HomeShowcase;
