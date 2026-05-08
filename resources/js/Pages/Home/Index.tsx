import StorefrontLayout from '@/Layouts/StorefrontLayout';
import type { ReactNode } from 'react';
import HomeMain from './Components/HomeMain';

export default function HomeIndex() {
  return <HomeMain />;
}

HomeIndex.layout = (page: ReactNode) => <StorefrontLayout title="Home Page">{page}</StorefrontLayout>;
