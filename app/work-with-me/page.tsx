import type { Metadata } from "next";
import Link from "next/link";
import OpenChatButton from "../../components/open-chat-button";

export const metadata: Metadata = {
  title: "Work With Me",
  description:
    "AI systems, interactive dashboards, and strategic advisory for education, development, and institutions.",
};

const SERVICES = [
  {
    icon: "AI",
    accent: "text-gold-300",
    badge: "border-gold-400/40 bg-gold-400/10 text-gold-300",
    gradient: "from-gold-400 to-gold-600",
    title: "AI systems for education & data",
    description:
      "Transformers, LLMs, deep learning, and RAG systems that solve real problems in education and development.",
    deliverables: [
      "Custom LLM assistants trained on your content",
      "RAG pipelines over internal documents",
      "Predictive models for enrollment, literacy, and outcomes",
      "Computer vision for document processing",
      "Robotics simulation and prototyping",
    ],
  },
  {
    icon: "DATA",
    accent: "text-electric-300",
    badge: "border-electric-400/40 bg-electric-400/10 text-electric-300",
    gradient: "from-electric-400 to-electric-600",
    title: "Interactive dashboards & M&E systems",
    description:
      "Turn scattered data into decisions. Real-time dashboards for monitoring, evaluation, and strategy.",
    deliverables: [
      "KPI dashboards with Streamlit or Plotly Dash",
      "Power BI and Tableau reporting",
      "M&E systems for government and NGO programs",
      "Data cleaning, transformation, and pipelines",
      "SQL database design and optimization",
    ],
  },
  {
    icon: "ADV",
    accent: "text-emerald-300",
    badge: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
    gradient: "from-emerald-400 to-emerald-600",
    title: "Strategic advisory & policy",
    description:
      "Six years inside a national ministry. Strategic guidance for education, digital transformation, and donor relations.",
    deliverables: [
      "Education policy design and review",
      "Strategic planning for ministries and NGOs",
      "Donor proposal development and relations",
      "Digital transformation roadmaps",
      "Capacity building and training programs",
    ],
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Discovery",
    description:
      "A 30–60 minute call to understand the problem, the data, the stakeholders, and the outcome you need.",
  },
  {
    step: "02",
    title: "Proposal",
    description:
      "A written proposal with scope, timeline, deliverables, and fixed price or rate. No surprises.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "Weekly demos, transparent progress. You see the system working before it's finished.",
  },
  {
    step: "04",
    title: "Handover",
    description:
      "Documentation, training, and 30 days of post-delivery support. You own what I build.",
  },
];

const CASE_STUDIES = [
  {
    tag: "Government",
    tagColor: "border-gold-400/40 bg-gold-400/10 text-gold-300",
    title: "Liberia Education Sector Plan",
    outcome: "$300M+ in donor funding secured",
    detail:
      "Led design and donor coordination for Liberia's national education strategy. Digitized education data collection across all 15 counties.",
  },
  {
    tag: "Data & Dashboards",
    tagColor: "border-electric-400/40 bg-electric-400/10 text-electric-300",
    title: "Education KPI Dashboard",
    outcome: "Real-time visibility across 15 counties",
    detail:
      "Built a Streamlit dashboard tracking literacy, numeracy, teacher deployment, and resource allocation for the Ministry of Education.",
  },
  {
    tag: "AI & LLMs",
    tagColor: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
    title: "RAG Assistant for Policy Makers",
    outcome: "Answers policy questions from sector documents",
    detail:
      "Built a semantic-retrieval assistant over Liberia's Education Sector Plan using Upstash Vector and Groq.",
  },
];

const ENGAGEMENTS = [
  {
    title: "Hourly advisory",
    price: "By arrangement",
    description:
      "Short calls, reviews, second opinions. Best for teams that need an expert in the room.",
  },
  {
    title: "Fixed-scope project",
    price: "Scoped per engagement",
    description:
      "A clear deliverable — dashboard, model, system — with a fixed timeline and price agreed in advance.",
  },
  {
    title: "Monthly retainer",
    price: "Retainer basis",
    description:
      "Ongoing advisory, engineering, or training for teams that need sustained support.",
  },
];

export default function WorkWithMePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <section className="mb-20 max-w-3xl">
        <div className="mb-4 inline-block rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-sm font-medium text-gold-300">
          Work With Me
        </div>
        <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          I help institutions and teams build{" "}
          <span className="bg-gradient-to-r from-gold-400 via-gold-300 to-electric-400 bg-clip-text text-transparent">
            AI and data systems
          </span>{" "}
          that actually work.
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-ink-300 sm:text-xl">
          From national education policy to production RAG pipelines — I bring
          the rare combination of{" "}
          <span className="text-ink-100">six years inside government</span> and{" "}
          <span className="text-ink-100">
            hands-on AI and software engineering
          </span>
          .
        </p>
        <div className="flex flex-wrap gap-3">
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

      <section className="mb-24">
        <h2 className="mb-10 text-3xl font-bold tracking-tight sm:text-4xl">
          What I do
        </h2>

        <div className="grid gap-6 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="group flex flex-col rounded-2xl border border-navy-800 bg-navy-900/40 p-8 backdrop-blur transition-all hover:-translate-y-1 hover:border-gold-400/40 hover:bg-navy-900/70"
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${service.gradient} text-sm font-bold text-navy-950 shadow-lg`}
              >
                {service.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-ink-100">
                {service.title}
              </h3>
              <p className="mb-5 text-sm leading-relaxed text-ink-400">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-ink-300"
                  >
                    <span className={`mt-0.5 ${service.accent}`}>▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-24">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          How we work together
        </h2>
        <p className="mb-10 max-w-2xl text-lg text-ink-400">
          No mystery. Four clear steps from first call to delivered system.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p) => (
            <div
              key={p.step}
              className="rounded-2xl border border-navy-800 bg-navy-900/40 p-6 backdrop-blur"
            >
              <div className="mb-4 text-4xl font-bold text-gold-400/30">
                {p.step}
              </div>
              <h3 className="mb-2 text-lg font-bold text-ink-100">
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-400">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-24">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Selected engagements
        </h2>
        <p className="mb-10 max-w-2xl text-lg text-ink-400">
          Three examples of the work I do — each with a specific outcome.
        </p>

        <div className="grid gap-6 lg:grid-cols-3">
          {CASE_STUDIES.map((cs) => (
            <div
              key={cs.title}
              className="rounded-2xl border border-navy-800 bg-navy-900/40 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-gold-400/40"
            >
              <div className="mb-4">
                <span
                  className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${cs.tagColor}`}
                >
                  {cs.tag}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-ink-100">
                {cs.title}
              </h3>
              <div className="mb-3 text-sm font-medium text-gold-300">
                {cs.outcome}
              </div>
              <p className="text-sm leading-relaxed text-ink-400">
                {cs.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-24">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Ways to engage
        </h2>
        <p className="mb-10 max-w-2xl text-lg text-ink-400">
          Different teams need different shapes of engagement. Pick what fits.
        </p>

        <div className="grid gap-6 lg:grid-cols-3">
          {ENGAGEMENTS.map((e) => (
            <div
              key={e.title}
              className="flex flex-col rounded-2xl border border-navy-800 bg-navy-900/40 p-8 backdrop-blur"
            >
              <h3 className="mb-2 text-xl font-bold text-ink-100">
                {e.title}
              </h3>
              <div className="mb-4 text-2xl font-bold text-gold-400">
                {e.price}
              </div>
              <p className="text-sm leading-relaxed text-ink-400">
                {e.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-ink-500">
          Rates are tailored to project scope, timeline, and client context —
          government agencies, NGOs, private firms, and individual clients are
          all welcome. All engagements begin with a brief discovery call
          before a written proposal is issued. I work remotely and travel for
          on-site engagements in West Africa when needed.
        </p>
      </section>

      <section className="rounded-2xl border border-gold-400/20 bg-gradient-to-br from-navy-900/80 to-navy-950 p-8 text-center backdrop-blur sm:p-12">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
          Let&apos;s build something together
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-ink-300">
          Tell me about the problem. I&apos;ll tell you honestly whether I can
          help — and how.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-7 py-3.5 font-semibold text-navy-950 shadow-lg transition-all hover:from-gold-300 hover:to-gold-400 hover:shadow-xl hover:shadow-gold-400/30"
          >
            Start a conversation
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-900/60 px-7 py-3.5 font-semibold text-ink-100 transition-all hover:border-gold-400 hover:text-gold-300"
          >
            See my work →
          </Link>
        </div>
      </section>
    </div>
  );
}
