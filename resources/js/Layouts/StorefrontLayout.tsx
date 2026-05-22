import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import HomeAssets from '@/Pages/Frontend/Home/Components/HomeAssets';
import Footer from '@/Pages/Frontend/Home/Components/Footer';
import Header from '@/Pages/Frontend/Home/Components/Header';
import HeaderMenuMobile from '@/Pages/Frontend/Home/Components/HeaderMenuMobile';
import HeaderSearchForm from '@/Pages/Frontend/Home/Components/HeaderSearchForm';
import MiniCart from '@/Pages/Frontend/Home/Components/MiniCart';
import MiniCartOverlay from '@/Pages/Frontend/Home/Components/MiniCartOverlay';

type StorefrontLayoutProps = {
  title?: string;
  children: ReactNode;
};

export default function StorefrontLayout({ title = 'Home Page', children }: StorefrontLayoutProps) {
  return (
    <>
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
