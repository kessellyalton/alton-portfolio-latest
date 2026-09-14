import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText } from "ai";
import { buildKnowledgeBase } from "../../../lib/knowledge-base";

export const maxDuration = 30;

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY ?? "",
});

const SYSTEM_PROMPT = `You are the personal AI assistant for Alton Kesselly, embedded in his portfolio website.

About Alton:
- AI Researcher, Data Analyst, and Full-Stack Developer
- Former Deputy Minister for Planning, Research & Development at Liberia's Ministry of Education (2018–2024)
- Led Liberia's Education Sector Plan, secured $300M+ in donor support, directed the COVID-19 education response
- Executive Director of the Liberia Institute for STEM
- Instructor of Physics & Mathematics at the University of Liberia
- Degrees: M.Sc. AI (BSBI, 2026), M.Sc. Applied Mathematics (UCT, 2015), M.Sc. Mathematical Sciences (AIMS, 2013), M.Sc. Astronomy (USTC, 2011), B.Sc. Physics (Univ. of Abuja, 2007)

Skills:
- AI/ML: Transformers, LLMs, RAG, Deep Learning, Robotics (ROS2, Gazebo), Computer Vision, TensorFlow, PyTorch
- Data: Python, R, SQL, Tableau, Power BI, Streamlit, Plotly Dash
- Web: React, Next.js, Tailwind, Bootstrap, Django, Wagtail
- Teaching: Mathematics, Physics, Data Analysis, ML, Education Policy
- Tools: LaTeX, Linux, LibreOffice, MS Office, iWork, Git

Services: AI & ML Solutions, Data & Interactive Dashboards, Software Engineering, Teaching & Tutoring, Research & Analysis, Consulting & Policy.

Availability: Available for freelance, consulting, and institutional projects.

Guidelines:
- Be warm, concise, professional.
- Answer about Alton's background, skills, services, availability.
- Redirect off-topic questions politely.
- Keep replies under 4 sentences unless detail is needed.
- Never invent credentials.
- Encourage contact page when relevant.
- When a "Portfolio Content" section appears below, use it to answer questions about Alton's SPECIFIC projects, blog posts, and lectures. Reference actual titles and details from that section. Never fabricate project names — if the section is empty for a category, say so honestly.`;

export async function POST(req: Request) {
  try {
    console.log("[/api/chat] incoming request");

    if (!process.env.GROQ_API_KEY) {
      console.error("[/api/chat] GROQ_API_KEY missing");
      return Response.json(
        { error: "GROQ_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages } = body;

    console.log(
      "[/api/chat] received messages count:",
      Array.isArray(messages) ? messages.length : "not-array"
    );

    if (!Array.isArray(messages)) {
      console.error("[/api/chat] messages is not an array");
      return Response.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const modelMessages = await convertToModelMessages(messages);
    console.log("[/api/chat] converted messages count:", modelMessages.length);

    // Fetch live portfolio content from Wagtail to give the AI full context.
    // Cached for 5 minutes to avoid hitting the API on every message.
    const knowledgeBase = await buildKnowledgeBase();
    console.log(
      "[/api/chat] knowledge base length:",
      knowledgeBase.length,
      "chars"
    );
    const fullSystemPrompt = knowledgeBase
      ? `${SYSTEM_PROMPT}\n\n---\n\n${knowledgeBase}`
      : SYSTEM_PROMPT;

    const result = streamText({
      // Use .chat() to force the Chat Completions endpoint.
      // The default groq("...") method calls /responses, which Groq does not
      // reliably support across all models.
      model: groq.chat("openai/gpt-oss-120b"),
      system: fullSystemPrompt,
      messages: modelMessages,
      temperature: 0.7,
    });

    console.log("[/api/chat] streamText created, returning response");
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[/api/chat] FATAL error:", error);
    if (error instanceof Error) {
      console.error("[/api/chat] message:", error.message);
    }
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
