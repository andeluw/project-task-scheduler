/**
 * @type {import('next-sitemap').IConfig}
 * @see https://github.com/iamvishnusankar/next-sitemap#readme
 */
module.exports = {
  // !SETUP Change the siteUrl
  /** Without additional '/' on the end, e.g. https://example.com */
  siteUrl: process.env.SITE_URL || 'https://example.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/sandbox' },
      { userAgent: '*', disallow: '/sandbox/*' },
    ],
  },
  exclude: ['/sandbox', '/sandbox/*'],
};
