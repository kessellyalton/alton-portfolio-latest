const TECH_ITEMS = [
  { label: "Python", icon: "🐍" },
  { label: "PyTorch", icon: "🔥" },
  { label: "TensorFlow", icon: "🧠" },
  { label: "ROS2", icon: "🤖" },
  { label: "Gazebo", icon: "🌐" },
  { label: "React", icon: "⚛️" },
  { label: "Next.js", icon: "▲" },
  { label: "Django", icon: "🎯" },
  { label: "Wagtail", icon: "🦅" },
  { label: "Tailwind CSS", icon: "💨" },
  { label: "Bootstrap", icon: "🅱️" },
  { label: "Tableau", icon: "📊" },
  { label: "Power BI", icon: "📈" },
  { label: "Streamlit", icon: "🎈" },
  { label: "Plotly Dash", icon: "📉" },
  { label: "SQL", icon: "🗄️" },
  { label: "R", icon: "📐" },
  { label: "LaTeX", icon: "📝" },
  { label: "Linux", icon: "🐧" },
  { label: "Machine Learning", icon: "🧬" },
  { label: "Deep Learning", icon: "🔬" },
  { label: "Transformers", icon: "⚡" },
  { label: "LLMs & RAG", icon: "💬" },
  { label: "Computer Vision", icon: "👁️" },
  { label: "Mathematics", icon: "∑" },
  { label: "Physics", icon: "⚛️" },
  { label: "Data Analysis", icon: "📊" },
  { label: "Education Policy", icon: "🎓" },
  { label: "Strategic Planning", icon: "🎯" },
  { label: "Research", icon: "🔍" },
];

export default function TechMarquee() {
  return (
    <section className="relative overflow-hidden border-y border-navy-800/60 bg-navy-900/40 py-6 backdrop-blur">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-navy-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-navy-950 to-transparent" />

      {/* Row 1 — scrolling left */}
      <div className="flex gap-8 overflow-hidden">
        <div className="flex shrink-0 animate-marquee gap-8">
          {[...TECH_ITEMS, ...TECH_ITEMS].map((item, i) => (
            <div
              key={`${item.label}-${i}`}
              className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-ink-300"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              <span className="ml-6 text-gold-400/40">•</span>
            </div>
          ))}
        </div>
        <div className="flex shrink-0 animate-marquee gap-8" aria-hidden="true">
          {[...TECH_ITEMS, ...TECH_ITEMS].map((item, i) => (
            <div
              key={`${item.label}-b-${i}`}
              className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-ink-300"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              <span className="ml-6 text-gold-400/40">•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}