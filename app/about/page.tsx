import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Alton Kesselly — AI Researcher, Data Analyst, and Full-Stack Developer. Former Deputy Minister of Education in Liberia.",
};

const EDUCATION = [
  {
    year: "2026",
    degree: "M.Sc. Artificial Intelligence",
    school: "Berlin School of Business & Innovation",
    country: "Germany",
    note: "Awaiting graduation in December 2026",
  },
  {
    year: "2015",
    degree: "M.Sc. Applied Mathematics",
    school: "University of Cape Town",
    country: "South Africa",
  },
  {
    year: "2013",
    degree: "M.Sc. Mathematical Sciences",
    school: "AIMS, Stellenbosch University",
    country: "South Africa",
  },
  {
    year: "2011",
    degree: "M.Sc. Astronomy",
    school: "University of Science & Technology of China",
    country: "China",
  },
  {
    year: "2007",
    degree: "B.Sc. Physics",
    school: "University of Abuja",
    country: "Nigeria",
  },
];

const EXPERIENCE = [
  {
    period: "2018 – 2024",
    role: "Deputy Minister for Planning, Research & Development",
    org: "Ministry of Education, Liberia",
    description:
      "Led development of Liberia's Education Sector Plan, secured $300M+ in donor support, digitized education data collection, launched national literacy and numeracy assessments, and directed COVID-19 education response.",
  },
  {
    period: "Recent",
    role: "Executive Director",
    org: "Liberia Institute for STEM",
    description:
      "Promoted STEM education, fostered partnerships, promoted research and innovation, organized training and awareness campaigns nationwide.",
  },
  {
    period: "Earlier",
    role: "Disaster Risk Analyst & STEM Specialist",
    org: "Ministry of Education, Liberia",
    description:
      "Developed education-in-emergency strategies and promoted STEM education planning.",
  },
  {
    period: "Earlier",
    role: "Instructor of Physics & Mathematics",
    org: "University of Liberia",
    description:
      "Taught undergraduate Physics and Mathematics, supervised research, mentored students.",
  },
  {
    period: "Earlier",
    role: "Teacher, Physics & Mathematics",
    org: "Firestone High School",
    description:
      "Prepared lessons, taught high school students, evaluated performance.",
  },
  {
    period: "Earlier",
    role: "Marketing Officer",
    org: "Based Brothers Inc, Nigeria",
    description:
      "Client acquisition, product marketing, relationship management.",
  },
];

const SKILL_GROUPS = [
  {
    category: "AI & Machine Learning",
    icon: "🤖",
    color: "from-gold-400 to-gold-600",
    skills: [
      "Transformers",
      "LLMs & RAG",
      "Deep Learning",
      "Robotics (ROS2, Gazebo)",
      "Computer Vision",
      "TensorFlow",
      "PyTorch",
    ],
  },
  {
    category: "Data & Dashboards",
    icon: "📊",
    color: "from-electric-400 to-electric-600",
    skills: [
      "Python (Pandas)",
      "R",
      "SQL",
      "Tableau",
      "Power BI",
      "Streamlit",
      "Plotly Dash",
    ],
  },
  {
    category: "Web & Software",
    icon: "💻",
    color: "from-emerald-400 to-emerald-600",
    skills: [
      "HTML / CSS / JavaScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Bootstrap",
      "Django",
      "Wagtail CMS",
    ],
  },
  {
    category: "Teaching & Research",
    icon: "🎓",
    color: "from-gold-300 to-gold-500",
    skills: [
      "Mathematics",
      "Physics",
      "Data Analysis",
      "Machine Learning",
      "Education Policy",
      "Strategic Planning",
      "Research Methods",
    ],
  },
  {
    category: "Productivity & Tools",
    icon: "🛠️",
    color: "from-electric-300 to-electric-500",
    skills: [
      "LaTeX",
      "Linux",
      "LibreOffice",
      "Microsoft Office",
      "Apple iWork",
      "Git & GitHub",
      "Jupyter",
    ],
  },
];

const LANGUAGES = [
  { name: "English", level: "Fluent", percent: 100 },
  { name: "Chinese (Mandarin)", level: "Basic", percent: 30 },
];

const CERTIFICATIONS = [
  "Git",
  "HTML & CSS",
  "JavaScript",
  "ReactJS",
  "Python",
  "Django",
  "Machine Learning",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      {/* ═══ Header ═══ */}
      <div className="mb-16 max-w-3xl">
        <div className="mb-4 inline-block rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-1.5 text-sm font-medium text-gold-300">
          About Me
        </div>
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Educator,{" "}
          <span className="bg-gradient-to-r from-gold-400 via-gold-300 to-electric-400 bg-clip-text text-transparent">
            Data Analyst
          </span>
          , and AI Researcher
        </h1>
        <p className="text-lg leading-relaxed text-ink-300">
          Over 8 years of experience in data-driven policy design, deep
          learning, and strategic planning for national education systems.
          I hold degrees in Physics, Astronomy, Mathematical Sciences, Applied
          Mathematics, and Artificial Intelligence — with a passion for
          building tools that create real-world impact.
        </p>
      </div>

      {/* ═══ Education ═══ */}
      <section className="mb-20">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-lg">
            🎓
          </div>
          <h2 className="text-2xl font-bold sm:text-3xl">Education</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {EDUCATION.map((edu) => (
            <div
              key={edu.degree}
              className="group relative overflow-hidden rounded-xl border border-navy-800 bg-navy-900/40 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-gold-400/40 hover:bg-navy-900/70"
            >
              <div className="mb-3 inline-block rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 text-xs font-medium text-gold-300">
                {edu.year}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-ink-100">
                {edu.degree}
              </h3>
              <p className="mb-1 text-sm text-ink-300">{edu.school}</p>
              <p className="text-xs text-ink-500">{edu.country}</p>
              {edu.note && (
                <p className="mt-3 text-xs italic text-electric-300">
                  {edu.note}
                </p>
              )}
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400/0 to-transparent transition-all group-hover:via-gold-400/60" />
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Experience ═══ */}
      <section className="mb-20">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-electric-400 to-electric-600 text-lg">
            💼
          </div>
          <h2 className="text-2xl font-bold sm:text-3xl">Experience</h2>
        </div>

        <div className="relative space-y-6 border-l border-navy-800 pl-8">
          {EXPERIENCE.map((exp) => (
            <div key={exp.role} className="relative">
              <div className="absolute -left-[37px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-gold-400 bg-navy-950">
                <div className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              </div>
              <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-6 backdrop-blur transition-all hover:border-electric-400/40">
                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-gold-300">
                  {exp.period}
                </div>
                <h3 className="mb-1 text-lg font-semibold text-ink-100">
                  {exp.role}
                </h3>
                <p className="mb-3 text-sm font-medium text-electric-300">
                  {exp.org}
                </p>
                <p className="text-sm leading-relaxed text-ink-300">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Skills ═══ */}
      <section className="mb-20">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-lg">
            ⚡
          </div>
          <h2 className="text-2xl font-bold sm:text-3xl">Skills</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SKILL_GROUPS.map((group) => (
            <div
              key={group.category}
              className="rounded-xl border border-navy-800 bg-navy-900/40 p-6 backdrop-blur"
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${group.color} text-base`}
                >
                  {group.icon}
                </div>
                <h3 className="text-base font-semibold text-ink-100">
                  {group.category}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-navy-700 bg-navy-800/60 px-2.5 py-1 text-xs font-medium text-ink-300 transition-colors hover:border-gold-400/40 hover:text-gold-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Languages + Certifications ═══ */}
      <section className="mb-20 grid gap-8 lg:grid-cols-2">
        {/* Languages */}
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-electric-400 to-electric-600 text-lg">
              🌍
            </div>
            <h2 className="text-2xl font-bold">Languages</h2>
          </div>
          <div className="space-y-4 rounded-xl border border-navy-800 bg-navy-900/40 p-6 backdrop-blur">
            {LANGUAGES.map((lang) => (
              <div key={lang.name}>
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="font-medium text-ink-100">{lang.name}</span>
                  <span className="text-xs text-ink-400">{lang.level}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-navy-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-500"
                    style={{ width: `${lang.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-lg">
              📜
            </div>
            <h2 className="text-2xl font-bold">Certifications</h2>
          </div>
          <div className="rounded-xl border border-navy-800 bg-navy-900/40 p-6 backdrop-blur">
            <div className="flex flex-wrap gap-2">
              {CERTIFICATIONS.map((cert) => (
                <span
                  key={cert}
                  className="rounded-md border border-gold-400/30 bg-gold-400/10 px-3 py-1.5 text-xs font-medium text-gold-300"
                >
                  ✓ {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="rounded-2xl border border-gold-400/20 bg-gradient-to-br from-navy-900/80 to-navy-950 p-8 text-center backdrop-blur sm:p-12">
        <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
          Let&apos;s build something together
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-ink-300">
          Available for freelance, consulting, and institutional projects in
          AI, data, and full-stack development.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-3 font-semibold text-navy-950 shadow-lg transition-all hover:from-gold-300 hover:to-gold-400 hover:shadow-xl hover:shadow-gold-400/30"
          >
            Get in touch
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg border border-navy-700 bg-navy-900/60 px-6 py-3 font-semibold text-ink-100 transition-all hover:border-gold-400 hover:text-gold-300"
          >
            See my work
          </Link>
        </div>
      </section>
    </div>
  );
}