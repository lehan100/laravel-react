import StorefrontLayout from '@/Layouts/StorefrontLayout';
import type { ReactNode } from 'react';
import HomeMain from './Components/HomeMain';
import SeoMeta from '@/Components/Frontend/SeoMeta';

export default function HomeIndex({ seo }: { seo?: any }) {
  return (
    <>
      <SeoMeta seo={seo} />
      <HomeMain />
    </>
  );
}

HomeIndex.layout = (page: ReactNode) => <StorefrontLayout>{page}</StorefrontLayout>;
