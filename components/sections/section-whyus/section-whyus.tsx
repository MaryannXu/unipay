'use client';

import './section-whyus.scss';
import Image from 'next/image';
import Icon_arrow from '../../icons/icon-arrow';
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
                        <h2 className='section-whyus__banner-heading'>We invest in students who invest in their education.</h2>
                    </div>
                </div>

                <div className='section-whyus__bullets-picker'>
                    <small className='section-whyus__bullets-caption'>What we offer</small>
                    <ul className='section-whyus__bullets-list'>
                        <li
                            onMouseEnter={() => setCurrentBullet(1)}
                            className={currentBullet === 1 ? 'section-whyus__bullets-item active' : 'section-whyus__bullets-item'}>
                            <span className='section-whyus__bullets-item-text'>Reduced Rates</span>
                            <span className='section-whyus__bullets-item-icon'>
                                <Icon_arrow direction='right' />
                            </span>
                        </li>
                        <li
                            onMouseEnter={() => setCurrentBullet(2)}
                            className={currentBullet === 2 ? 'section-whyus__bullets-item active' : 'section-whyus__bullets-item'}>
                            <span className='section-whyus__bullets-item-text'>Loan Application</span>
                            <span className='section-whyus__bullets-item-icon'>
                                <Icon_arrow direction='right' />
                            </span>
                        </li>
                        <li
                            onMouseEnter={() => setCurrentBullet(3)}
                            className={currentBullet === 3 ? 'section-whyus__bullets-item active' : 'section-whyus__bullets-item'}>
                            <span className='section-whyus__bullets-item-text'>Financial Support</span>
                            <span className='section-whyus__bullets-item-icon'>
                                <Icon_arrow direction='right' />
                            </span>
                        </li>
                        <li
                            onMouseEnter={() => setCurrentBullet(4)}
                            className={currentBullet === 4 ? 'section-whyus__bullets-item active' : 'section-whyus__bullets-item'}>
                            <span className='section-whyus__bullets-item-text'>Alumni Support</span>
                            <span className='section-whyus__bullets-item-icon'>
                                <Icon_arrow direction='right' />
                            </span>
                        </li>
                    </ul>
                </div>

                <div className='section-whyus__bullets-description'>
                    <div className={currentBullet === 1 ? 'section-whyus__bullets-slide active' : 'section-whyus__bullets-slide'}>
                        <h3 className='section-whyus__bullets-heading'>
                            Reduced <br /> Rates
                        </h3>
                        <p className='section-whyus__bullets-text'>
                            Our mission is to financially support you and for us that means
                            saving you money. We offer rates that cut the global average.
                        </p>
                    </div>

                    <div className={currentBullet === 2 ? 'section-whyus__bullets-slide active' : 'section-whyus__bullets-slide'}>
                        <h3 className='section-whyus__bullets-heading'>
                            Loan <br /> Application
                        </h3>
                        <p className='section-whyus__bullets-text'>
                            When assessing your eligibility, we don’t just look at your
                            credit. We look at the whole pie. By assessing data points that
                            predict your growth potential after university, we can better
                            suit your needs.
                        </p>
                    </div>

                    <div className={currentBullet === 3 ? 'section-whyus__bullets-slide active' : 'section-whyus__bullets-slide'}>
                        <h3 className='section-whyus__bullets-heading'>
                            Financial <br /> Support
                        </h3>
                        <p className='section-whyus__bullets-text'>
                            We want you succeed.
                            To help, we build your credit score as you pay off loans.
                        </p>
                    </div>

                    <div className={currentBullet === 4 ? 'section-whyus__bullets-slide active' : 'section-whyus__bullets-slide'}>
                        <h3 className='section-whyus__bullets-heading'>
                            Alumni <br /> Support
                        </h3>
                        <p className='section-whyus__bullets-text'>
                            We bring on the best to help you fund your study abroad.
                            Behind your loan is a community of alumni from your university that wants to help you.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
