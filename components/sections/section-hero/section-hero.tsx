'use client';

import './section-hero.scss';
import SectionHeroHeading from './section-hero-heading';
import { useLenis } from '@studio-freight/react-lenis';
import dynamic from 'next/dynamic';
import {useRouter} from "next/navigation";

const LottieLoader = dynamic(() => import('@/components/utils/lottie-loader/lottie-loader'), { ssr: false });

export default function SectionHero() {
    const lenis = useLenis();

    const router = useRouter();

    return (
        <section className="section-hero">
            <div className="container section-hero__container">
                <div className="section-hero__text-container">
                    <SectionHeroHeading />
                    <div className="section-hero__subheading-layout">
                        <p className="section-hero__caption">
                            UniPay is a new way to finance your studies in the U.S—one where we care about your future
                            success.
                        </p>
                        <button className="section-hero__order-button"
                                onClick={() => router.push("/eligibility")}>Start Now
                        </button>
                    </div>
                </div>
                <div className="section-hero__slider-wrapper">
                    <h2 className="section-hero__filler">Community Driven Lending</h2>
                    <h2 className="section-hero__interest-rate">for interest rates as low as 7.5%</h2>
                    <span
                        onClick={() => lenis.scrollTo('.section-whyus__container', { offset: 0 })}
                        className="section-hero__slider-button"
                    >
                        Learn more
                    </span>
                    <div className="lottie-loader">
                        <LottieLoader lottieSrc="./lottie/UniPayHero.json" />
                    </div>
                </div>
            </div>
        </section>
    );
}
