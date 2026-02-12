import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: {
    default: 'Make K-Food | 한국 제철 식재료 레시피 블로그',
    template: '%s | Make K-Food',
  },
  description: 'Discover authentic Korean recipes using seasonal ingredients. 매일 업데이트되는 한국 제철 식재료 레시피 블로그. Fresh, healthy, and delicious Korean cooking for everyone.',
  keywords: ['Korean food', 'Korean recipes', 'seasonal ingredients', '제철 식재료', '한국 요리', 'K-food', 'Korean cooking', '레시피'],
  authors: [{ name: 'Make K-Food' }],
  creator: 'Make K-Food',
  openGraph: {
    title: 'Make K-Food | Korean Seasonal Recipe Blog',
    description: 'Discover authentic Korean recipes using seasonal ingredients. 매일 새로운 한국 제철 레시피.',
    url: 'https://tocook-kfood.vercel.app',
    siteName: 'Make K-Food',
    locale: 'ko_KR',
    alternateLocale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Make K-Food | Korean Seasonal Recipe Blog',
    description: 'Discover authentic Korean recipes using seasonal ingredients.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="google-adsense-account" content="ca-pub-3053267422296088" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3053267422296088"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
