import { Metadata } from 'next';
import Banner from '@/components/home/hero';
import Companies from '@/components/home/companies';
import Work from '@/components/home/work';
import Table from '@/components/home/table';
import Features from '@/components/home/features';
import Simple from '@/components/home/simple';
import Trade from '@/components/home/trade';
import Faq from '@/components/home/faq';
import ContactForm from '@/components/ContactForm';
import Aoscompo from '@/lib/utils/aos';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Buy & Sell Crypto Instantly | Crypto App',
  description: 'Secure crypto trading platform a fast, secure, and user-friendly platform to trade digital assets. Join millions embracing the future of finance.',
  openGraph: {
    title: 'Crypto App - Buy & Sell Crypto Instantly',
    description: 'Trade crypto securely and easily.',
    images: ['/images/og-image.png'],
    type: 'website',
  },
};

export default function Home() {
  return (
    <main>
      <Aoscompo>
        <Banner />
      </Aoscompo>
      <Companies />
      <Work />
      <Table />
      <Features />
      <Simple />
      <Trade />
      <Faq />
      <ContactForm />
    </main>
  );
}
