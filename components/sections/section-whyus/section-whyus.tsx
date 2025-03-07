'use client';

import './section-whyus.scss';
import Image from 'next/image';
import Icon_arrow from '@/components/icons/icon-arrow';
import { useState } from 'react';

export default function SectionWhyus() {
    const [currentBullet, setCurrentBullet] = useState(1);

    return (
        <section id='whyus' className='section-whyus'>
            <div className='container section-whyus__container'>
                <div className='section-whyus__banner'>
                    <div className='section-whyus__banner-image'>
                        <Image src={'/img/unipaygradient.png'} alt='background'  fill={true} sizes='75vw' priority />
                    </div>
                    <div className='section-whyus__banner-text'>
                        <small className='section-whyus__top-caption'>Why UniPay?</small>
                        <h2 className='section-whyus__banner-heading'>We leverage technology so you can thrive</h2>
                    </div>
                </div>

                <div className='section-whyus__bullets-picker'>
                    <small className='section-whyus__bullets-caption'>What we offer</small>
                    <ul className='section-whyus__bullets-list'>
                        <li
                            onMouseEnter={() => setCurrentBullet(1)}
                            className={currentBullet === 1 ? 'section-whyus__bullets-item active' : 'section-whyus__bullets-item'}>
                            <span className='section-whyus__bullets-item-text'>Financial Products</span>
                            <span className='section-whyus__bullets-item-icon'>
                                <Icon_arrow direction='right' />
                            </span>
                        </li>
                        <li
                            onMouseEnter={() => setCurrentBullet(2)}
                            className={currentBullet === 2 ? 'section-whyus__bullets-item active' : 'section-whyus__bullets-item'}>
                            <span className='section-whyus__bullets-item-text'>Credit Evaluation</span>
                            <span className='section-whyus__bullets-item-icon'>
                                <Icon_arrow direction='right' />
                            </span>
                        </li>
                        <li
                            onMouseEnter={() => setCurrentBullet(3)}
                            className={currentBullet === 3 ? 'section-whyus__bullets-item active' : 'section-whyus__bullets-item'}>
                            <span className='section-whyus__bullets-item-text'>Financial Recomendations</span>
                            <span className='section-whyus__bullets-item-icon'>
                                <Icon_arrow direction='right' />
                            </span>
                        </li>
                        <li
                            onMouseEnter={() => setCurrentBullet(4)}
                            className={currentBullet === 4 ? 'section-whyus__bullets-item active' : 'section-whyus__bullets-item'}>
                            <span className='section-whyus__bullets-item-text'>Credit Access Solutions</span>
                            <span className='section-whyus__bullets-item-icon'>
                                <Icon_arrow direction='right' />
                            </span>
                        </li>
                    </ul>
                </div>

                <div className='section-whyus__bullets-description'>
                    <div className={currentBullet === 1 ? 'section-whyus__bullets-slide active' : 'section-whyus__bullets-slide'}>
                        <h3 className='section-whyus__bullets-heading'>
                            Financial <br /> Products
                        </h3>
                        <p className='section-whyus__bullets-text'>
                            Our mission is to financially support you and for us that means
                            saving you money. Access catered credit, banking and lending services specific to your needs.
                        </p>
                    </div>

                    <div className={currentBullet === 2 ? 'section-whyus__bullets-slide active' : 'section-whyus__bullets-slide'}>
                        <h3 className='section-whyus__bullets-heading'>
                            Credit <br /> Evaluation
                        </h3>
                        <p className='section-whyus__bullets-text'>
                            When assessing your eligibility, we don’t just look at your
                            credit. We look at the whole pie. By assessing data points that
                            tell your story, we can better
                            suit your needs.
                        </p>
                    </div>

                    <div className={currentBullet === 3 ? 'section-whyus__bullets-slide active' : 'section-whyus__bullets-slide'}>
                        <h3 className='section-whyus__bullets-heading'>
                            Financial <br /> Reccomendations
                        </h3>
                        <p className='section-whyus__bullets-text'>
                            It can be hard navigating the U.S financial system. We're here to support
                            you with any qestions you have along the way.
                        </p>
                    </div>

                    <div className={currentBullet === 4 ? 'section-whyus__bullets-slide active' : 'section-whyus__bullets-slide'}>
                        <h3 className='section-whyus__bullets-heading'>
                            Credit <br /> Access Solutions
                        </h3>
                        <p className='section-whyus__bullets-text'>
                            We present you with the best products that suit your needs.
                            Access financing, credit and banking in one application.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
