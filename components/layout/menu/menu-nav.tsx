import './menu.scss';
import { useContext } from 'react';
import { NavigationContext } from '../navigation/navigation';
import { useLenis } from '@studio-freight/react-lenis';
import { useRouter } from "next/navigation";

type NavItemProps = {
    index: number;
    name: string;
    href: string;
    soon: boolean;
};

const ITEMS = [
    { name: 'Home', href: '#home', soon: false },
    { name: 'About', href: '#whyus', soon: false },
    { name: 'FAQ', href: '#faq', soon: false },
    { name: 'Student Eligibility Form', href: '/eligibility', soon: false },
    { name: 'Investor Eligibility Form', href: '/investor-eligibility', soon: false },
];

function MenuNavItem({ index, name, href, soon }: NavItemProps) {
    const lenis = useLenis();
    const { setIsMenuOpened } = useContext(NavigationContext);
    const router = useRouter();

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        setIsMenuOpened(false);

        if (href === '/eligibility') {
            // Navigate using the router for eligibility forms
            router.push('/eligibility');
        } else if (href === '/investor-eligibility'){
            router.push('/investor-eligibility');
        } else {
            // Perform scrolling for other navigation items
            lenis.isStopped = false;
            lenis.scrollTo(href, { offset: 100 });
        }
    };

    return (
        <li onClick={handleClick} className='menu__nav-item'>
            <small className='menu__nav-item-num'>{'0' + index}</small>
            <a
                href={href}
                tabIndex={soon ? -1 : 0}
                className={soon ? 'menu__nav-item-text soon' : 'menu__nav-item-text'}
            >
                {name}
            </a>
        </li>
    );
}

export default function MenuNav() {
    return (
        <nav className='menu__nav'>
            <ul className='menu__nav-list'>
                {ITEMS.map((el, i) => (
                    <MenuNavItem
                        key={`${el.name}-${i}`}
                        index={i + 1}
                        name={el.name}
                        href={el.href}
                        soon={el.soon}
                    />
                ))}
            </ul>
        </nav>
    );
}
