import { useEffect } from "react";

/**
 * Hook to manage page title, description, canonical link, and Open Graph meta tags dynamically in React 19 / SPA.
 */
export function usePageMeta({
  title,
  description,
  canonicalPath = "",
  noIndex = false,
  ogType = "website",
  ogImage = "https://intervai.app/og-image.png",
}) {
  useEffect(() => {
    const originalTitle = document.title;
    const baseTitle = "IntervAI · AI Mock Interview Preparation";
    const fullTitle = title ? `${title} | IntervAI` : baseTitle;
    document.title = fullTitle;

    const baseDomain = "https://intervai.app";
    const canonicalUrl = `${baseDomain}${canonicalPath}`;

    // Helper to set or create meta tag
    const setMeta = (name, content, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Helper to set or create link tag
    const setLink = (rel, href) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", rel);
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, true);
      setMeta("twitter:description", description);
    }

    setMeta("og:title", fullTitle, true);
    setMeta("twitter:title", fullTitle);
    setMeta("og:type", ogType, true);
    setMeta("og:site_name", "IntervAI", true);
    setMeta("og:locale", "en_US", true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:image", ogImage, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:image", ogImage);

    if (noIndex) {
      setMeta("robots", "noindex, nofollow");
    } else {
      setMeta("robots", "index, follow");
      setLink("canonical", canonicalUrl);
    }

    return () => {
      document.title = originalTitle;
    };
  }, [title, description, canonicalPath, noIndex, ogType, ogImage]);
}
