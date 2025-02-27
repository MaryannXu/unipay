"use client";

import './section-join.scss';
import Image from 'next/image';
import { useRouter } from "next/navigation";

const SectionJoin = () => {
    const router = useRouter();

    return (
        <section id='join' className='section-join'>
            <div className='container section-join__container'>
                <div className='section-join__image-wrapper'>
                    <Image src={'/img/unipaygradient.png'} alt='Join us' fill={true} sizes='30vw' />
                </div>
                <div className='section-join__content-wrapper'>
                    <div className='section-join__heading-wrapper'>
                        <small className='section-join__top-caption'>Turn ambition into opportunity</small>
                        <h2 className='section-join__heading'>Join us in supporting financial growth. </h2>
                    </div>
                    <button className='section-join__cta-button' onClick={() => router.push("/investor-eligibility")}>
                        Join UniPay
                    </button>
                </div>
            </div>
        </section>
    );
}

export default SectionJoin;
