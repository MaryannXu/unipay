'use client';

import './footer.scss';
import Icon_logo from '../../icons/black_inline_unilogo.png';
import Icon_socials from '@/components/icons/Icon-socials';
import { useLenis } from '@studio-freight/react-lenis';
import Image from "next/image";
import { usePathname } from 'next/navigation';

type FooterNavItemProps = {
    name: string;
    href: string;
};

const ITEMS = [
    { name: 'Why us', href: '#whyus' },
    { name: 'Process', href: '#process' },
    { name: 'Innovations', href: '#innovations' },
    { name: 'Join', href: '#join' },
    { name: 'FAQ', href: '#faq' },
    // { name: 'FAQ', href: '#faq' },
];

function FooterNavItem({ name, href }: FooterNavItemProps) {
    const lenis = useLenis();

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        lenis.scrollTo(href, { offset: 100 });
    };

    return (
        <li onClick={handleClick} className='footer__navigation-item'>
            <a href={href}>{name}</a>
        </li>
    );
}

export default function Footer() {
    const lenis = useLenis();
    const pathname = usePathname(); // Get current pathname

    // Define paths where the footer should NOT be displayed
    const excludedPaths = ['/dashboard', '/applications'];

    const shouldExclude = excludedPaths.some((path) => {
        // Ensure that '/applications' excludes all nested routes
        if (path === '/applications') {
            return pathname === path || pathname.startsWith(`${path}/`);
        }
        // For other paths like '/dashboard', exclude exact matches only
        return pathname === path;
    });

    // If current pathname is in excludedPaths, do not render the footer
    if (shouldExclude) {
        return null;
    }

    return (
        <footer className='footer'>
            <div className='container footer__container'>
                <div className='footer__contacts-wrapper'>
                    <div className='footer__logo-wrapper'>
                        <div className='footer__logo'>
                            <Image src={Icon_logo} alt='UNIPAY'/>
                        </div>
                        <p className='footer__logo-text'>
                            Borderless Student Financing</p>
                    </div>
                    <small className='footer__contacts-subheading'>
                        <a href='mailto:contact@lvng.io' className='footer__email'>
                            unipay@gmail.com
                        </a>
                    </small>
                    <ul className='footer__socials-list'>
                        <li className='footer__socials-item'>
                            <a href='https://discord.gg/65B4TFfmNB'>
                                <Icon_socials icon='discord' />
                            </a>
                        </li>
                        <li className='footer__socials-item'>
                            <a href='https://medium.com/lvnghome'>
                                <Icon_socials icon='medium' />
                            </a>
                        </li>
                        <li className='footer__socials-item'>
                            <a href='https://linkedin.com/company/lvng-io'>
                                <Icon_socials icon='linkedin' />
                            </a>
                        </li>
                        <li className='footer__socials-item'>
                            <a href='https://t.me/lvnghome'>
                                <Icon_socials icon='telegram' />
                            </a>
                        </li>
                    </ul>
                </div>
                <div className='footer__navigation-wrapper'>
                    <small className='footer__navigation-subheading'>navigation</small>
                    <ul className='footer__navigation-list'>
                        {ITEMS.map(({ name, href }, i) => (
                            <FooterNavItem key={i} name={name} href={href} />
                        ))}
                    </ul>
                </div>
                <div className='footer__projects-wrapper'>
                    <small className='footer__projects-subheading'>Products</small>
                    <ul className='footer__projects-list'>
                        <li onClick={() => lenis.scrollTo('#whyus', { offset: 100 })} className='footer__projects-item'>
                            Student Loan Financing
                        </li>
                        <li className='footer__projects-item soon'>Student Refinancing</li>
                        <li className='footer__projects-item soon'>Undergraduate Student Loans</li>
                    </ul>
                </div>
                <div className='footer__copyright-wrapper'>
                    <small className='footer__copyright'>2024</small>
                    {/* <a href='#' className='footer__policy'>
                        Legal regulations
                    </a> */}
                    <small className='footer__copyright'>UniPay</small>
                </div>
            </div>
        </footer>
    );
}
