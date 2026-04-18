import siteConfig from '../config/site';
import prisma from '@/lib/prisma';

export default async function sitemap() {
  const baseUrl = siteConfig.baseUrl;

  // 1. Fetch data from DB
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where: { isVisible: true }, select: { id: true, createdAt: true } }),
    prisma.category.findMany({ include: { subCategories: true } })
  ]);

  // 2. Base routes
  const routes = ['', '/about-us', '/contact-us'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  // 3. Collection routes
  const collectionRoutes = categories.map((cat) => ({
    url: `${baseUrl}/collections/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // 4. Category/Subcategory routes
  const subCategoryRoutes = [];
  categories.forEach((cat) => {
    cat.subCategories.forEach((sub) => {
      subCategoryRoutes.push({
        url: `${baseUrl}/category/${cat.slug}/${sub.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  // 5. Product routes
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: product.createdAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...routes, ...collectionRoutes, ...subCategoryRoutes, ...productRoutes];
}
