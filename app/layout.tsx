import '@/node_modules/normalize.css';
import '@/styles/globals.scss';
import Footer from '@/components/layout/footer/footer';
import Stripes from '@/components/layout/stripes/stripes';
import { Manrope } from 'next/font/google';
import SmoothScrolling from '@/components/utils/smooth-scrolling/smooth-scrolling';
import Navigation from '@/components/layout/navigation/navigation';
import PopupContextProvider from '@/components/layout/popup-form/popup-context';
import PopupForm from '@/components/layout/popup-form/popup-form';
import ThemeContextProvider from '@/components/utils/theme-context/theme-context';
import { Analytics } from '@vercel/analytics/react';

const manrope = Manrope({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    style: 'normal',
});

export const metadata = {
    title: 'UniPay',
    description: 'UniPay',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='ru' className={manrope.className}>
            <body>
                <ThemeContextProvider>
                    <PopupContextProvider>
                        <SmoothScrolling>
                            <Navigation />
                            <main>{children}</main>
                            <Footer />
                            <Stripes />
                            <PopupForm />
                        </SmoothScrolling>
                    </PopupContextProvider>
                </ThemeContextProvider>
                <Analytics />
            </body>
        </html>
    );
}

{
    /* <Script strategy='beforeInteractive' id='apply-theme'>
{`if (typeof window !== 'undefined' && window.matchMedia) {
    const currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.classList.add(currentTheme);
}`}
</Script> */
}
