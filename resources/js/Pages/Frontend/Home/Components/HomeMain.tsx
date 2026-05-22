import AboutGlobalSection from './AboutGlobalSection';
import CropSolutionsSection from './CropSolutionsSection';
import FeaturedProductsSection from './FeaturedProductsSection';
import HomeHeroSection from './HomeHeroSection';
import NewsSection from './NewsSection';
import ProductCategoriesSection from './ProductCategoriesSection';
import ProductSaleSection from './ProductSaleSection';
import TodayDealsSection from './TodayDealsSection';

export default function HomeMain() {
  return (
    <>
      <HomeHeroSection />
      <CropSolutionsSection />
      <TodayDealsSection />
      <FeaturedProductsSection />
      <ProductCategoriesSection />
      <ProductSaleSection />
      <NewsSection />
      <AboutGlobalSection />
    </>
  );
}
