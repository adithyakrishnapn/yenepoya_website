import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: absoluteUrl("/sitemap.xml"),
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/programs", "/courses", "/admissions", "/blog", "/contact"],
        disallow: ["/admin", "/admin/*", "/api", "/api/*", "/private", "/private/*"]
      }
    ]
  };
}
