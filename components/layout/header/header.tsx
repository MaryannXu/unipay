import './header.scss';
import Icon_logo from '../../icons/gradient_inline_unilogo.png';
import Icon_menu from '../../icons/icon-menu';
import React, { useContext } from 'react';
import { NavigationContext } from '../navigation/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import AuthButton from "@/components/AuthButton";
import { useRouter } from "next/navigation";

const HeaderLights = dynamic(() => import('./header-lights'), { ssr: false });

function HeaderLightsPlacehoder() {
    return <div style={{ width: '7.75rem', height: '1rem' }}></div>;
}

export default function Header() {
    const { isMenuOpened, setIsMenuOpened } = useContext(NavigationContext);

    const handleClickMenu = () => setIsMenuOpened((prev) => !prev);

    const router = useRouter();

    // @ts-ignore
    return (
        <header className='header'>
            <nav className='header__nav'>
                <span className='header__logo'>
                    <button
                        className='header__nav-button'
                        onClick={() => router.push("/")}
                    >
                        <Image src={Icon_logo} alt='UNIPAY'/>
                    </button>
                </span>
                <ul className='header__nav-list'>
                    <li className="header__nav-item">
                        <span className='header__nav-button'>
                            <AuthButton/>
                        </span>
                    </li>
                    <li className="divider"></li>
                    <li className='header__nav-item'>
                        <button onClick={handleClickMenu} className='header__nav-button'>
                            <span className='header__nav-text'>Menu</span>
                            <span className='header__nav-icon'>
                                <Icon_menu type={isMenuOpened ? 'close' : 'open'}/>
                            </span>
                        </button>
                    </li>
                    <li className='divider'></li>
                    <HeaderLights/>
                </ul>
            </nav>
        </header>
    );
}



