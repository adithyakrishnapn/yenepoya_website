function firstNonEmpty(...values: Array<string | undefined>) {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return "https://www.yenepoyamudipu.in";
}

export const siteConfig = {
  name: "Yenepoya University Mudipu",
  shortName: "Yenepoya Mudipu",
  domain: firstNonEmpty(
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    "https://www.yenepoyamudipu.in"
  ),
  description:
    "Yenepoya admissions support portal with program discovery, counselling, and SEO-focused academic content.",
  keywords: [
    "Yenepoya University Mudipu",
    "Mudipu college",
    "higher education in Mudipu",
    "university admissions",
    "student campus life",
    "degree programs",
    "research and innovation"
  ],
  contactEmail: "admissions@yenepoyauniversity.online",
  phone: "+91 88480 46116",
  ogImage: "/assets/hero_campus_banner.png"
};

export function absoluteUrl(pathname: string) {
  const base = siteConfig.domain.replace(/\/$/, "");
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${normalizedPath}`;
}
