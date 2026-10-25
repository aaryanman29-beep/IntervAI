export default function Card({ children, className = "", hover = false }) {
  return (
    <section
      className={`rounded-xl border border-slate-200/90 bg-white p-6 card-shadow ${
        hover
          ? "transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
          : ""
      } ${className}`}
    >
      {children}
    </section>
  )
}
