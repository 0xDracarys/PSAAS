/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://shubhambhasker.vercel.app",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["/admin/*", "/api/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
  },
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: path === "/" ? "daily" : "weekly",
      priority: path === "/" ? 1.0 : 0.7,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
}
