import type { Metadata } from "next";
import Link from "next/link";
import OpenChatButton from "@/components/open-chat-button";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI development, data analysis, interactive dashboards, software engineering, and consulting services by Alton Kesselly.",
};

const SERVICES = [
  {
    id: "ai-ml",
    icon: "AI",
    title: "AI & Machine Learning",
    tagline: "From transformers to robotics — I build intelligent systems that solve real problems.",
    color: "from-gold-400 to-gold-600",
    accent: "text-gold-300",
    border: "hover:border-gold-400/60",
    offerings: [
      "Transformer models and fine-tuning",
      "LLM applications with RAG (retrieval-augmented generation)",
      "Deep learning for vision, NLP, and tabular data",
      "Robotics with ROS2 and Gazebo simulation",
      "Computer vision pipelines",
      "Custom AI model development and deployment",
    ],
    useCases: [
      "Chatbots and AI assistants",
      "Document analysis and summarization",
      "Predictive modeling",
      "Autonomous navigation systems",
    ],
  },
  {
    id: "data-dashboards",
    icon: "DATA",
    title: "Data & Interactive Dashboards",
    tagline: "Turn raw data into decisions with beautiful, interactive dashboards.",
    color: "from-electric-400 to-electric-600",
    accent: "text-electric-300",
    border: "hover:border-electric-400/60",
    offerings: [
      "KPI dashboards for monitoring and evaluation (M&E)",
      "Real-time dashboards with Streamlit and Plotly Dash",
      "Tableau and Microsoft Power BI reports",
      "Data cleaning, transformation, and analysis",
      "SQL database design and query optimization",
      "Custom Python data pipelines",
    ],
    useCases: [
      "Government and NGO M&E systems",
      "Business intelligence and reporting",
      "Education sector analytics",
      "Research data visualization",
    ],
  },
  {
    id: "software",
    icon: "WEB",
    title: "Software Engineering",
    tagline: "Modern, fast, and maintainable web applications and APIs.",
    color: "from-emerald-400 to-emerald-600",
    accent: "text-emerald-300",
    border: "hover:border-emerald-400/60",
    offerings: [
      "Full-stack apps with React, Next.js, and Tailwind CSS",
      "Django and Django REST Framework backends",
      "Wagtail CMS for content-driven sites",
      "REST API design and integration",
      "Responsive UI with Bootstrap and Tailwind",
      "Deployment and DevOps basics",
    ],
    useCases: [
      "Personal and business websites",
      "Internal tools and admin panels",
      "Headless CMS setups",
      "Custom API development",
    ],
  },
  {
    id: "teaching",
    icon: "EDU",
    title: "Teaching & Tutoring",
    tagline: "Math, Physics, AI, and productivity tools — taught clearly and patiently.",
    color: "from-gold-300 to-gold-500",
    accent: "text-gold-300",
    border: "hover:border-gold-400/60",
    offerings: [
      "Mathematics (calculus, linear algebra, statistics)",
      "Physics (mechanics, electromagnetism, quantum)",
      "AI and machine learning fundamentals",
      "Spreadsheets (Excel, LibreOffice, Apple Numbers)",
      "Presentation tools (PowerPoint, Keynote, LibreOffice Impress)",
      "Linux and LaTeX for academic writing",
    ],
    useCases: [
      "High school and university tutoring",
      "Professional upskilling",
      "Thesis and dissertation support",
      "Corporate training",
    ],
  },
  {
    id: "research",
    icon: "RES",
    title: "Research & Data Analysis",
    tagline: "Rigorous analysis and clear reporting for evidence-based decisions.",
    color: "from-electric-300 to-electric-500",
    accent: "text-electric-300",
    border: "hover:border-electric-400/60",
    offerings: [
      "Exploratory data analysis (EDA)",
      "Statistical modeling and hypothesis testing",
      "Predictive modeling and forecasting",
      "Survey design and analysis",
      "Literature reviews and synthesis",
      "Technical report writing",
    ],
    useCases: [
      "Policy research and evaluation",
      "Market and social research",
      "Academic research support",
      "Impact assessments",
    ],
  },
  {
    id: "consulting",
    icon: "POL",
    title: "Consulting & Policy",
    tagline: "Strategic guidance for education, development, and technology initiatives.",
    color: "from-gold-400 to-gold-500",
    accent: "text-gold-300",
    border: "hover:border-gold-400/60",
    offerings: [
      "Education policy design and review",
      "Strategic planning for ministries and NGOs",
      "Donor relations and proposal development",
      "STEM education program design",
      "Digital transformation strategies",
      "Capacity building and training",
    ],
    useCases: [
      "Government education programs",
      "NGO and development agency projects",
      "STEM initiatives",
      "Digital strategy for institutions",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-16 max-w-3xl">
        <div className="mb-4 inline-block rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-sm font-medium text-gold-300">
          Services
        </div>
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
          What I{" "}
          <span className="bg-gradient-to-r from-gold-400 via-gold-300 to-electric-400 bg-clip-text text-transparent">
            do
          </span>
        </h1>
        <p className="text-lg leading-relaxed text-ink-300">
          I offer a unique combination of AI expertise, data science, software
          engineering, and policy experience — helping individuals,
          institutions, and organizations build tools and systems that matter.
        </p>
      </div>

      <div className="space-y-8">
        {SERVICES.map((service, i) => (
          <div
            key={service.id}
            id={service.id}
            className={`scroll-mt-24 rounded-2xl border border-navy-800 bg-navy-900/40 p-8 backdrop-blur transition-all hover:bg-navy-900/60 sm:p-10 ${service.border}`}
          >
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="mb-4 flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} text-sm font-bold text-navy-950 shadow-lg`}
                  >
                    {service.icon}
                  </div>
                  <div>
                    <div className="text-xs font-medium uppercase tracking-wider text-ink-500">
                      Service {String(i + 1).padStart(2, "0")}
                    </div>
                    <h2 className="text-2xl font-bold text-ink-100 sm:text-3xl">
                      {service.title}
                    </h2>
                  </div>
                </div>

                <p
                  className={`mb-6 text-base leading-relaxed ${service.accent}`}
                >
                  {service.tagline}
                </p>

                <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-500">
                  What I offer
                </div>
                <ul className="space-y-2">
                  {service.offerings.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-ink-300"
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-xs ${service.accent}`}
                      >
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-1">
                <div className="rounded-xl border border-navy-800 bg-navy-950/60 p-6">
                  <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-500">
                    Common use cases
                  </div>
                  <ul className="space-y-3">
                    {service.useCases.map((useCase) => (
                      <li
                        key={useCase}
                        className="flex items-start gap-2 text-sm text-ink-300"
                      >
                        <span className={service.accent}>▸</span>
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-20 rounded-2xl border border-gold-400/20 bg-gradient-to-br from-navy-900/80 to-navy-950 p-8 text-center backdrop-blur sm:p-12">
        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
          Not sure what you need?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-ink-300">
          Tell me about your project and I&apos;ll recommend the right
          approach — whether it&apos;s AI, a dashboard, a web app, or a
          combination.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-3 font-semibold text-navy-950 shadow-lg transition-all hover:from-gold-300 hover:to-gold-400 hover:shadow-xl hover:shadow-gold-400/30"
          >
            Start a conversation
          </Link>
          <OpenChatButton className="inline-flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-900/60 px-6 py-3 font-semibold text-ink-100 transition-all hover:border-electric-400 hover:text-electric-300">
            Ask my AI assistant
          </OpenChatButton>
        </div>
      </section>
    </div>
  );
}
