import productData from '../data/products.json';
import navigationData from '../data/navigation.json';
import siteConfig from '../config/site';

export default function sitemap() {
  const baseUrl = siteConfig.baseUrl;

  // Base routes
  const routes = ['', '/about-us', '/contact-us'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Collection routes
  const collectionRoutes = navigationData.map((cat) => ({
    url: `${baseUrl}/collections/${cat.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Dynamic Category/Subcategory routes
  const subCategoryRoutes = [];
  navigationData.forEach((cat) => {
    cat.subCategories.forEach((sub) => {
      subCategoryRoutes.push({
        url: `${baseUrl}/category/${cat.id}/${sub.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  // Product routes
  const productRoutes = productData.products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...routes, ...collectionRoutes, ...subCategoryRoutes, ...productRoutes];
}
