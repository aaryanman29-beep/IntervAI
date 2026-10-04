export default function Card({ children, className = "", hover = false }) {
  return (
    <section
      className={`rounded-2xl border border-line bg-white p-5 card-shadow ${
        hover
          ? "transition-all hover:-translate-y-1 hover:border-primary/20"
          : ""
      } ${className}`}
    >
      {children}
    </section>
  )
}
