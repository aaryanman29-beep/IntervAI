export default function InterviewQuestion({ children }) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
        Behavioral question
      </p>
      <h2 className="font-display text-2xl font-bold leading-snug md:text-3xl">
        {children}
      </h2>
    </div>
  )
}
