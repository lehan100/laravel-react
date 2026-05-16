import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import HomeAssets from '@/Pages/Home/Components/HomeAssets';
import Footer from '@/Pages/Home/Components/Footer';
import Header from '@/Pages/Home/Components/Header';
import HeaderMenuMobile from '@/Pages/Home/Components/HeaderMenuMobile';
import HeaderSearchForm from '@/Pages/Home/Components/HeaderSearchForm';
import MiniCart from '@/Pages/Home/Components/MiniCart';
import MiniCartOverlay from '@/Pages/Home/Components/MiniCartOverlay';

type StorefrontLayoutProps = {
  title?: string;
  children: ReactNode;
};

export default function StorefrontLayout({ title = 'Home Page', children }: StorefrontLayoutProps) {
  return (
    <>
      <Head title={title} />
      <HomeAssets />
      <Header />
      <HeaderSearchForm />
      <HeaderMenuMobile />
      <MiniCart />
      <MiniCartOverlay />
      <div data-scroll-container>
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}
