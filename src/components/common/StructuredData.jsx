import { useEffect } from "react";

export default function StructuredData({ data }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(data);
    script.id = "intervai-jsonld";
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("intervai-jsonld");
      if (existing) {
        existing.remove();
      }
    };
  }, [data]);

  return null;
}
