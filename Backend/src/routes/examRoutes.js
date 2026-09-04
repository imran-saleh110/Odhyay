import express from "express";
import ExamAttempt from "../models/ExamAttempt.js";

const router = express.Router();

router.post("/start", async (req, res) => {
    const { type, questionCount, minutes, secondTime } = req.body;

    const endTime = new Date(Date.now() + (minutes || 10) * 60 * 1000);

    const attempt = await ExamAttempt.create({
        type, 
        questionCount,
        minutes,
        secondTime,
        endTime,

        answers: {},
        flagged: [],
    });

    res.json({
        attemptId: attempt._id,
        endTime: attempt.endTime,
    });
});

router.patch("/:attemptId/progress", async (req, res) => {
    const { answers, flagged, currentIndex  } = req.body;

    const attempt = await ExamAttempt.findById(req.params.attemptId);
    if (!attempt) 
        return res.status(404).json({ error: "Attempt not found" });

    attempt.answers = answers;
    attempt.flagged = flagged;
    attempt.currentIndex = currentIndex;
    await attempt.save();

    res.json({ ok: true, endTime: attempt.endTime });
});

router.get("/:attemptId", async (req, res) => {
    const attempt = await ExamAttempt.findById(req.params.attemptId);
    if (!attempt) 
        return res.status(404).json({ error: "Attempt not found" });

    res.json({
        answers: attempt.answers,
        flagged: attempt.flagged,
        currentIndex: attempt.currentIndex,
        secondTime: attempt.secondTime,
        endTime: attempt.endTime,
    })
});

export default router