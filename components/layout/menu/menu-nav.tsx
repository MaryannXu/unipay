import './menu.scss';
import { useContext } from 'react';
import { NavigationContext } from '../navigation/navigation';
import { useLenis } from '@studio-freight/react-lenis';
import { useRouter, usePathname } from 'next/navigation';

type NavItemProps = {
    index: number;
    name: string;
    href: string;
    soon: boolean;
};

type MenuNavProps = {
    items: NavItemProps[];
};

function MenuNavItem({ index, name, href, soon }: NavItemProps) {
    const lenis = useLenis();
    const { setIsMenuOpened } = useContext(NavigationContext);
    const router = useRouter();
    const pathname = usePathname();

    const handleClick = (event: React.MouseEvent) => {
        event.preventDefault();
        setIsMenuOpened(false);

        if (href.startsWith('#')) {
            if (pathname !== '/') {
                router.push('/' + href);
            } else {
                lenis.isStopped = false;
                lenis.scrollTo(href, { offset: 100 });
            }
        } else {
            router.push(href);
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

export default function MenuNav({ items }: MenuNavProps) {
    return (
        <nav className='menu__nav'>
            <ul className='menu__nav-list'>
                {items.map((el, i) => (
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
