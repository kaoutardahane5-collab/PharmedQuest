import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  getAdminStatus,
  setupFirstAdmin,
  loginAdmin,
  verifyAdminToken,
  getPublicContent,
  getAdminContent,
  addOrUpdateModule,
  deleteModule,
  addOrUpdateLesson,
  deleteLesson,
  addOrUpdateYear,
  addOrUpdateQuestion,
  softDeleteQuestion,
  restoreQuestion,
  permanentDeleteQuestion,
  duplicateQuestion,
  moveQuestion,
  addReport,
  resolveReport,
  addSuggestion,
  resolveSuggestion,
  updateSubscriptionConfig,
  updateAnnouncement,
  updateChecklist,
} from "./server/store";

dotenv.config();

const PORT = 3000;

// Lazy initialize Gemini client to avoid crashes if GEMINI_API_KEY is not set
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      name: "PharmedQuest API",
      timestamp: new Date().toISOString(),
    });
  });

  // --- Auth & First Admin Setup APIs ---

  // Check if first-time administrator setup is required
  app.get("/api/auth/status", (_req, res) => {
    try {
      const status = getAdminStatus();
      res.json(status);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Setup first administrator (one-time setup)
  app.post("/api/auth/setup-admin", (req, res) => {
    try {
      const { name, email, password } = req.body;
      const result = setupFirstAdmin(name, email, password);
      res.status(201).json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Admin login
  app.post("/api/auth/admin-login", (req, res) => {
    try {
      const { email, password } = req.body;
      const result = loginAdmin(email, password);
      res.json(result);
    } catch (e: any) {
      res.status(401).json({ error: e.message });
    }
  });

  // Verify admin session token
  app.get("/api/auth/verify-admin", (req, res) => {
    const token = req.headers["x-admin-token"] as string;
    const isValid = verifyAdminToken(token);
    if (isValid) {
      res.json({ valid: true });
    } else {
      res.status(401).json({ valid: false, error: "Session expirée ou non autorisée." });
    }
  });

  // --- Public Content APIs (Used by Students) ---

  // Get active public curriculum (only non-deleted, published QCMs)
  app.get("/api/content", (_req, res) => {
    try {
      const content = getPublicContent();
      res.json(content);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Student question report submission
  app.post("/api/reports", (req, res) => {
    try {
      const report = addReport(req.body);
      res.status(201).json(report);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Student question suggestion submission
  app.post("/api/suggestions", (req, res) => {
    try {
      const suggestion = addSuggestion(req.body);
      res.status(201).json(suggestion);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // --- Admin Middleware Helper ---
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers["x-admin-token"] as string;
    if (!verifyAdminToken(token)) {
      return res.status(403).json({ error: "Accès refusé. Autorisation administrateur requise." });
    }
    next();
  };

  // --- Admin Protected APIs ---

  // Get complete admin dashboard content and statistics
  app.get("/api/admin/content", requireAdmin, (_req, res) => {
    try {
      const data = getAdminContent();
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Academic Modules
  app.post("/api/admin/modules", requireAdmin, (req, res) => {
    try {
      const mod = addOrUpdateModule(req.body);
      res.json(mod);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/admin/modules/:id", requireAdmin, (req, res) => {
    try {
      const success = deleteModule(req.params.id);
      res.json({ success });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Academic Lessons
  app.post("/api/admin/lessons", requireAdmin, (req, res) => {
    try {
      const lesson = addOrUpdateLesson(req.body);
      res.json(lesson);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/admin/lessons/:id", requireAdmin, (req, res) => {
    try {
      const success = deleteLesson(req.params.id);
      res.json({ success });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Academic Years
  app.post("/api/admin/years", requireAdmin, (req, res) => {
    try {
      const year = addOrUpdateYear(req.body);
      res.json(year);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // MCQ Questions - Public & Quick Creation Route
  app.post("/api/questions/create", (req, res) => {
    try {
      const question = addOrUpdateQuestion(req.body);
      res.json(question);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // MCQ Questions CRUD (Admin)
  app.post("/api/admin/questions", requireAdmin, (req, res) => {
    try {
      const question = addOrUpdateQuestion(req.body);
      res.json(question);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/admin/questions/:id/soft-delete", requireAdmin, (req, res) => {
    try {
      const success = softDeleteQuestion(req.params.id);
      res.json({ success });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/admin/questions/:id/restore", requireAdmin, (req, res) => {
    try {
      const success = restoreQuestion(req.params.id);
      res.json({ success });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/admin/questions/:id", requireAdmin, (req, res) => {
    try {
      const success = permanentDeleteQuestion(req.params.id);
      res.json({ success });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/admin/questions/:id/duplicate", requireAdmin, (req, res) => {
    try {
      const copy = duplicateQuestion(req.params.id);
      res.json(copy);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/admin/questions/:id/move", requireAdmin, (req, res) => {
    try {
      const { newLessonId, newModuleId } = req.body;
      const moved = moveQuestion(req.params.id, newLessonId, newModuleId);
      res.json(moved);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Resolve Student Report
  app.post("/api/admin/reports/:id/resolve", requireAdmin, (req, res) => {
    try {
      const { action } = req.body;
      const success = resolveReport(req.params.id, action);
      res.json({ success });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Resolve Student Suggestion
  app.post("/api/admin/suggestions/:id/resolve", requireAdmin, (req, res) => {
    try {
      const { action } = req.body;
      const result = resolveSuggestion(req.params.id, action);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Subscription Pricing Configuration
  app.post(["/api/admin/subscription", "/api/admin/pricing"], requireAdmin, (req, res) => {
    try {
      const updated = updateSubscriptionConfig(req.body);
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Broadcast Announcement Banner
  app.post(["/api/admin/announcement", "/api/admin/announcements"], requireAdmin, (req, res) => {
    try {
      const text = req.body.text || req.body.announcement || "";
      const updated = updateAnnouncement(text);
      res.json({ text: updated, announcement: updated });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Admin Setup Checklist Check
  app.post("/api/admin/checklist", requireAdmin, (req, res) => {
    try {
      const { key, value } = req.body;
      const updated = updateChecklist(key, value);
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // AI MCQ Explanation
  app.post("/api/ai/explain", async (req, res) => {
    try {
      const {
        questionText,
        options,
        correctOptionIndexes,
        studentAnswerIndexes,
        module,
        lesson,
        language = "fr",
      } = req.body;

      const ai = getGeminiClient();

      if (!ai) {
        // Fallback intelligent response when API key isn't provided
        return res.json({
          source: "fallback",
          explanation:
            language === "fr"
              ? `**Analyse Pédagogique PharmedQuest :**\n\n- **Réponse(s) exacte(s)** : ${correctOptionIndexes
                  .map((idx: number) => `Option ${String.fromCharCode(65 + idx)}`)
                  .join(", ")}.\n- **Mécanisme clé** : Dans le cadre de **${lesson || module || "cette matière"}**, cette règle thérapeutique découle directement des consensus universitaires et des recommandations officielles de la faculté.\n- **Astuce mnémonique** : Retenez toujours les contre-indications absolues et les effets indésirables majeurs qui reviennent fréquemment aux examens de résidanat et aux EMD.\n- **Conseil pour l'examen** : Éliminez d'abord les propositions manifestement erronées.`
              : `**PharmedQuest Academic Breakdown:**\n\n- **Correct Answer(s)**: ${correctOptionIndexes
                  .map((idx: number) => `Option ${String.fromCharCode(65 + idx)}`)
                  .join(", ")}.\n- **Core Concept**: In the context of **${lesson || module || "this module"}**, this concept is aligned with standard university curriculum and residency examination guidelines.\n- **Clinical Pearl**: Always verify contraindications, dosage adjustments, and receptor selectivity on related exam questions.`,
        });
      }

      const prompt = `You are a distinguished Professor of Medicine and Pharmacy preparing students for university residency examinations (concours de résidanat) and module exams (EMD).
Language of answer: ${language === "fr" ? "French" : "English"}.

Question:
"${questionText}"

Options:
${options.map((opt: string, i: number) => `${String.fromCharCode(65 + i)}: ${opt}`).join("\n")}

Correct Answer(s): ${correctOptionIndexes.map((i: number) => String.fromCharCode(65 + i)).join(", ")}
Student Answer(s): ${
        studentAnswerIndexes && studentAnswerIndexes.length > 0
          ? studentAnswerIndexes.map((i: number) => String.fromCharCode(65 + i)).join(", ")
          : "None / Reviewing"
      }
Module/Subject: ${module || "Medical/Pharmacy"}
Chapter/Lesson: ${lesson || "General"}

Please provide a structured, high-yield explanation:
1. **Direct Rationale**: Why the correct choice(s) is/are clinically & theoretically correct.
2. **Analysis of Distractors**: Briefly explain why the other options are wrong or misleading.
3. **High-Yield Clinical Pearl / Mnemonic**: A memorable exam tip or mnemonic useful for university exams.
Keep the tone encouraging, rigorous, and academic.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      res.json({
        source: "gemini",
        explanation: response.text || "Explication générée avec succès.",
      });
    } catch (error: any) {
      console.error("AI Explain Error:", error);
      res.json({
        source: "fallback",
        explanation:
          req.body.language === "fr"
            ? "Explication clinique : La justification repose sur le mécanisme pharmacologique et physiopathologique standard enseigné dans les facultés algériennes de médecine et pharmacie."
            : "Clinical explanation: Based on standard pharmacological and medical curriculum for university examinations.",
      });
    }
  });

  // AI Educational Chat / Ask Questions
  app.post("/api/ai/ask", async (req, res) => {
    try {
      const { query, context, language = "fr" } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          source: "fallback",
          response:
            language === "fr"
              ? `Excellente question sur **${context?.subject || "le cours"}**. En révision médicale, concentrez-vous sur les mécanismes d'action, les posologies usuelles, les effets secondaires fréquents et les diagnostics différentiels.`
              : `Great question regarding **${context?.subject || "the lecture"}**. For medical exam preparation, focus on underlying mechanisms, contraindications, and classic differential diagnoses.`,
        });
      }

      const prompt = `You are PharmedQuest AI, an expert medical and pharmacology tutor assisting an Algerian medical/pharmacy university student.
Language: ${language === "fr" ? "French" : "English"}.
Context: ${JSON.stringify(context || {})}
Student Question: "${query}"

Provide an accurate, educational, clear, and encouraging explanation suitable for medical students preparing for university exams and residency.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      res.json({
        source: "gemini",
        response: response.text,
      });
    } catch (error: any) {
      console.error("AI Ask Error:", error);
      res.json({
        source: "fallback",
        response:
          req.body.language === "fr"
            ? "Pour approfondir ce point, consultez les fiches de synthèse du cours et comparez les cas cliniques similaires."
            : "Review the module lecture notes and practice related MCQs to solidify this topic.",
      });
    }
  });

  // AI Complementary Practice Question Generator
  app.post("/api/ai/generate-question", async (req, res) => {
    try {
      const { profession, year, module, lesson, language = "fr" } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          question:
            language === "fr"
              ? "Concernant les anti-inflammatoires non stéroïdiens (AINS), quelle est la proposition exacte ?"
              : "Regarding non-steroidal anti-inflammatory drugs (NSAIDs), which statement is correct?",
          options:
            language === "fr"
              ? [
                  "Ils inhibent sélectivement la phospholipase A2",
                  "Ils inhibent la cyclo-oxygénase (COX)",
                  "Ils sont indiqués au 3ème trimestre de la grossesse",
                  "Ils diminuent le risque d'ulcère gastrique",
                  "Ils n'ont aucun effet sur l'agrégation plaquettaire",
                ]
              : [
                  "They selectively inhibit phospholipase A2",
                  "They inhibit cyclooxygenase (COX)",
                  "They are indicated in the 3rd trimester of pregnancy",
                  "They decrease the risk of gastric ulceration",
                  "They have no effect on platelet aggregation",
                ],
          correctIndexes: [1],
          explanation:
            language === "fr"
              ? "Les AINS agissent principalement par inhibition des isoformes de la cyclo-oxygénase (COX-1 et COX-2)."
              : "NSAIDs primarily act by inhibiting cyclooxygenase (COX-1 and COX-2) enzymes.",
        });
      }

      const prompt = `Generate a single university-level medical/pharmacy multiple-choice question (MCQ) for students.
Profession: ${profession}
Academic Year: ${year}
Subject/Module: ${module}
Lesson: ${lesson}
Language: ${language === "fr" ? "French" : "English"}

Output strictly valid JSON with this format:
{
  "question": "string",
  "options": ["string", "string", "string", "string", "string"],
  "correctIndexes": [number],
  "explanation": "string"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err) {
      res.status(500).json({ error: "Failed to generate question" });
    }
  });

  // Setup Vite middleware for development or serve static in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PharmedQuest server running on http://localhost:${PORT}`);
  });
}

startServer();
