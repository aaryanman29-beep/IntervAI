export const mockFeedback = {
  overall: 82,
  skills: [
    { name: "Communication", value: 90 },
    { name: "Technical Knowledge", value: 82 },
    { name: "Confidence", value: 76 },
    { name: "Clarity", value: 88 },
    { name: "Problem Solving", value: 84 },
  ],
  positives: [
    "Your answers were structured and easy to follow.",
    "Good use of technical examples.",
    "You maintained a confident, professional tone.",
  ],
  improvements: [
    "Try to provide more measurable results when describing projects.",
    "Reduce filler words during transitions.",
    "Explain technical tradeoffs before choosing a solution.",
  ],
  reviews: [
    {
      question: "Tell me about a challenging project you worked on.",
      answer:
        "I led a redesign of our checkout flow, aligning product and engineering around measurable goals. We shipped in phases and improved conversion by 14%.",
      feedback:
        "Strong STAR structure and a measurable outcome. Add one sentence about what you learned.",
      score: 88,
    },
    {
      question: "How would you design a scalable notification system?",
      answer:
        "I would use queues to separate event ingestion from delivery workers, then add retries, preference controls, and monitoring.",
      feedback:
        "Good high-level architecture. Clarify expected scale and delivery guarantees earlier.",
      score: 81,
    },
  ],
}
