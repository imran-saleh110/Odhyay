import { useEffect, useState } from "react";
import axios from "../services/axios.js";
import '../styles/AdminQuestionForm.css'

const IMPORTANCE_LEVELS = ["low", "medium", "high"];

const loadOptions = (url, setData) => {
  axios
    .get(url)
    .then((res) => setData(res.data?.data || []))
    .catch(console.error);
};

const emptyOption = () => ({
  text: "",
  isCorrect: false,
  imageFile: null,
  existingImage: null,
});

const AdminQuestionForm = ({ question, onClose }) => {
  const isEditMode = question !== null;

  const [type, setType] = useState(question?.type ?? "mcq");
  const [moduleId, setModuleId] = useState(question?.moduleId ?? "");
  const [subjectId, setSubjectId] = useState(question?.subjectId ?? "");
  const [chapterId, setChapterId] = useState(question?.chapterId ?? "");
  const [topicId, setTopicId] = useState(question?.topicId ?? "");
  const [importance, setImportance] = useState(question?.importance ?? "");

  const [questionText, setQuestionText] = useState(
    question?.questionText ?? "",
  );
  const [questionImageFile, setQuestionImageFile] = useState(null);
  const [existingQuestionImage, setExistingQuestionImage] = useState(
    question?.questionImage ?? null,
  );

  const [options, setOptions] = useState(
    question?.options?.length
      ? question.options.map((o) => ({
          text: o.text ?? "",
          isCorrect: o.isCorrect ?? false,
          imageFile: null,
          existingImage: o.image ?? null,
        }))
      : [emptyOption(), emptyOption()],
  );

  const [answerText, setAnswerText] = useState(
    question?.answerOrExplanationText ?? "",
  );
  const [answerImageFile, setAnswerImageFile] = useState(null);
  const [existingAnswerImage, setExistingAnswerImage] = useState(
    question?.answerOrExplanationImage ?? null,
  );

  const [appearances, setAppearances] = useState(
    question?.appearances?.map((a) => ({
      university: a.university?._id ?? a.university ?? "",
      year: a.year ?? "",
    })) ?? [],
  );

  const [modules, setModules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);
  const [universities, setUniversities] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; 

  const validateImageFile = (file, setError) => {
    if (file && file.size > MAX_FILE_SIZE) {
      setError("ছবির সাইজ ২ মেগাবাইটের বেশি হতে পারবে না");
      return null;
    }
    return file;
  };

  useEffect(() => {
    loadOptions("/api/taxonomy/modules", setModules);
    loadOptions("/api/taxonomy/universities", setUniversities);
  }, []);

  useEffect(() => {
    if (!moduleId) {
      setSubjects([]);
      return;
    }
    loadOptions(`/api/taxonomy/subjects?moduleId=${moduleId}`, setSubjects);
  }, [moduleId]);

  useEffect(() => {
    if (!subjectId) {
      setChapters([]);
      return;
    }
    loadOptions(`/api/taxonomy/chapters?subjectId=${subjectId}`, setChapters);
  }, [subjectId]);

  useEffect(() => {
    if (!chapterId) {
      setTopics([]);
      return;
    }
    loadOptions(`/api/taxonomy/topics?chapterId=${chapterId}`, setTopics);
  }, [chapterId]);

  const handleModuleChange = (e) => {
    setModuleId(e.target.value);
    setSubjectId("");
    setChapterId("");
    setTopicId("");
  };

  const handleSubjectChange = (e) => {
    setSubjectId(e.target.value);
    setChapterId("");
    setTopicId("");
  };

  const handleChapterChange = (e) => {
    setChapterId(e.target.value);
    setTopicId("");
  };

  const updateOption = (index, patch) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, ...patch } : opt)),
    );
  };

  const setCorrectOption = (index) => {
    setOptions((prev) =>
      prev.map((opt, i) => ({ ...opt, isCorrect: i === index })),
    );
  };

  const addOption = () => setOptions((prev) => [...prev, emptyOption()]);
  const removeOption = (index) =>
    setOptions((prev) => prev.filter((_, i) => i !== index));

  const addAppearance = () =>
    setAppearances((prev) => [...prev, { university: "", year: "" }]);
  const updateAppearance = (index, patch) => {
    setAppearances((prev) =>
      prev.map((a, i) => (i === index ? { ...a, ...patch } : a)),
    );
  };
  const removeAppearance = (index) =>
    setAppearances((prev) => prev.filter((_, i) => i !== index));

  const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isEditMode) {
      const updates = {
        type,
        moduleId,
        subjectId,
        chapterId,
        topicId,
        questionText,
        answerOrExplanationText: answerText,
      };
      if (importance) updates.importance = importance;

      if (type === "mcq") {
        updates.options = await Promise.all(
          options.map(async (o) => ({
            text: o.text,
            isCorrect: o.isCorrect,
            image: o.imageFile
              ? await fileToDataUrl(o.imageFile)
              : (o.existingImage ?? null),
          })),
        );
      }

      updates.appearances = appearances
        .filter((a) => a.university)
        .map((a) => ({
          university: a.university,
          year: a.year ? Number(a.year) : undefined,
        }));

      if (questionImageFile) {
        updates.questionImage = await fileToDataUrl(questionImageFile);
      }
      if (answerImageFile) {
        updates.answerOrExplanationImage = await fileToDataUrl(answerImageFile);
      }

      await axios.patch(`/api/questions/${question._id}`, updates);
    } else {
      const body = new FormData();
      body.append("type", type);
      body.append("moduleId", moduleId);
      body.append("subjectId", subjectId);
      body.append("chapterId", chapterId);
      body.append("topicId", topicId);
      if (importance) body.append("importance", importance);
      body.append("questionText", questionText);
      body.append("answerOrExplanationText", answerText);

      if (type === "mcq") {
        body.append(
          "options",
          JSON.stringify(
            options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
          ),
        );
        options.forEach((o) => {
          body.append("optionsImage", o.imageFile ?? "");
        });
      }

      body.append(
        "appearances",
        JSON.stringify(
          appearances
            .filter((a) => a.university)
            .map((a) => ({
              university: a.university,
              year: a.year ? Number(a.year) : undefined,
            })),
        ),
      );

      if (questionImageFile) body.append("questionImage", questionImageFile);
      if (answerImageFile)
        body.append("answerOrExplanationImage", answerImageFile);

      await axios.post("/api/questions", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    onClose(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-form-overlay">
      <form className="admin-question-form" onSubmit={handleSubmit}>
        <div className="admin-form-header">
          <h3>{isEditMode ? "প্রশ্ন সম্পাদনা" : "নতুন প্রশ্ন যোগ করুন"}</h3>
          <button type="button" onClick={() => onClose(false)}>
            x
          </button>
        </div>

        <label>
          ধরণ
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="mcq">MCQ</option>
            <option value="written">লিখিত</option>
          </select>
        </label>

        <label>
          গুরুত্ব
          <select
            value={importance}
            onChange={(e) => setImportance(e.target.value)}
          >
            <option value="">নির্বাচন করুন</option>
            {IMPORTANCE_LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </label>

        <label>
          প্রস্তুতির ধরণ
          <select value={moduleId} onChange={handleModuleChange} required>
            <option value="">নির্বাচন করুন</option>
            {modules.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          বিষয়
          <select
            value={subjectId}
            onChange={handleSubjectChange}
            disabled={!moduleId}
            required
          >
            <option value="">নির্বাচন করুন</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          অধ্যায়
          <select
            value={chapterId}
            onChange={handleChapterChange}
            disabled={!subjectId}
            required
          >
            <option value="">নির্বাচন করুন</option>
            {chapters.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          টপিক
          <select
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            disabled={!chapterId}
            required
          >
            <option value="">নির্বাচন করুন</option>
            {topics.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          প্রশ্ন
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
          />
        </label>

        <label>
          প্রশ্নের ছবি
          {existingQuestionImage?.url && !questionImageFile && (
            <img
              className="admin-preview"
              src={existingQuestionImage.url}
              alt=""
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setQuestionImageFile(validateImageFile(e.target.files[0] ?? null, setError))}
          />
        </label>

        {type === "mcq" && (
          <div className="admin-options-editor">
            <div className="admin-options-editor-header">
              <span>অপশনসমূহ</span>
              <button type="button" onClick={addOption}>
                + অপশন যোগ করুন
              </button>
            </div>

            {options.map((opt, i) => (
              <div key={i} className="admin-option-row">
                <input
                  type="radio"
                  name="correctOption"
                  checked={opt.isCorrect}
                  onChange={() => setCorrectOption(i)}
                  title="সঠিক উত্তর"
                />
                <input
                  type="text"
                  value={opt.text}
                  placeholder={`অপশন ${i + 1}`}
                  onChange={(e) => updateOption(i, { text: e.target.value })}
                />
                {opt.existingImage?.url && !opt.imageFile && (
                  <img
                    className="admin-preview-small"
                    src={opt.existingImage.url}
                    alt=""
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = validateImageFile(e.target.files[0] ?? null, setError);
                    if (file !== null || !e.target.files[0]) updateOption(i, { imageFile: file });
                  }}
                />
                {options.length > 2 && (
                  <button type="button" onClick={() => removeOption(i)}>
                    মুছুন
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <label>
          ব্যাখ্যা / উত্তর
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
          />
        </label>

        <label>
          ব্যাখ্যার ছবি
          {existingAnswerImage?.url && !answerImageFile && (
            <img
              className="admin-preview"
              src={existingAnswerImage.url}
              alt=""
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>setAnswerImageFile(validateImageFile(e.target.files[0] ?? null, setError))}
          />
        </label>

        <div className="admin-appearances-editor">
          <div className="admin-options-editor-header">
            <span>পরীক্ষায় এসেছে</span>
            <button type="button" onClick={addAppearance}>
              + যোগ করুন
            </button>
          </div>

          {appearances.map((a, i) => (
            <div key={i} className="admin-appearance-row">
              <select
                value={a.university}
                onChange={(e) =>
                  updateAppearance(i, { university: e.target.value })
                }
              >
                <option value="">পরীক্ষা নির্বাচন করুন</option>
                {universities.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={a.year}
                placeholder="সাল"
                onChange={(e) => updateAppearance(i, { year: e.target.value })}
              />
              <button type="button" onClick={() => removeAppearance(i)}>
                মুছুন
              </button>
            </div>
          ))}
        </div>

          {error && <div className="admin-form-error">{error}</div>}
          
        <div className="admin-form-footer">
          <button
            type="button"
            onClick={() => onClose(false)}
            disabled={submitting}
          >
            বাতিল
          </button>
          <button type="submit" disabled={submitting}>
            {submitting
              ? "সংরক্ষণ হচ্ছে..."
              : isEditMode
                ? "আপডেট করুন"
                : "যোগ করুন"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminQuestionForm;
