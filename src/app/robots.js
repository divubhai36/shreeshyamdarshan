import siteConfig from '../config/site';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
    sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
  };
}
