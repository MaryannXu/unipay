'use client'; // important if using Framer Motion in Next.js app directory

import React, { useEffect, useRef, useState } from 'react';
import '@/components/sections/section-quote/section-quote.scss';

import Lenis from '@studio-freight/lenis';
import {useScroll, useTransform, motion, MotionValue} from 'framer-motion';

import Icon_quote from '../../icons/icon-quote';
import Image from 'next/image';

const images = [
    'stanford_logo.png',
    'uwash_logo.png',
    'upenn_logo.png',
    'ucla_logo.png',
    'usc_logo.png',
    'harvard_logo.png',
    'jhu_logo.png',
    'uchicago_logo.png',
    'columbia_logo.png',
    'bu_logo.png',
    'cmu_logo.png',
    'nyu_logo.png',
];

export default function SectionQuote() {
    const galleryRef = useRef<HTMLDivElement>(null);

    // We'll store the window width/height for the parallax transform calculations
    const [dimension, setDimension] = useState({ width: 0, height: 0 });
    const { height } = dimension;

    // 1) Track scroll progress *only* for this section using the "galleryRef"
    const { scrollYProgress } = useScroll({
        target: galleryRef,
        offset: ['start end', 'end start'],
    });

    // 2) Create transforms for each of the four columns
    const y1 = useTransform(scrollYProgress, [0, 1], [0, height * 1.4]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, height * 3.3]);
    const y3 = useTransform(scrollYProgress, [0, 1], [0, height * 1.25]);
    const y4 = useTransform(scrollYProgress, [0, 1], [0, height * 3]);

    // 3) Set up Lenis for *smooth scrolling* and watch for window resizes
    useEffect(() => {
        const lenis = new Lenis();

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // On mount + resize, update window dimensions
        function handleResize() {
            setDimension({ width: window.innerWidth, height: window.innerHeight });
        }
        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <section className="section-quote">
            {/*
         The parallax "gallery" is behind the text.
         This acts like the "middle" of your page
         where the effect should happen.
       */}
            <div ref={galleryRef} className="section-quote__gallery">
                <div className="section-quote__gallery__wrapper">
                    {/* We split 12 images into 4 columns of 3 images each */}
                    <Column images={[images[0], images[1], images[2]]} y={y1} />
                    <Column images={[images[3], images[4], images[5]]} y={y2} />
                    <Column images={[images[6], images[7], images[8]]} y={y3} />
                    <Column images={[images[9], images[10], images[11]]} y={y4} />
                </div>
            </div>

            {/* The content container for the quote text sits above (z-index) the parallax */}
            <div className="container section-quote__container">
                <div className="section-quote__top-line">
                    <div className="section-quote__quote-icon">
                        <Icon_quote />
                    </div>
                    <small className="section-quote__top-caption">
                        Fuel your education and career growth
                    </small>
                </div>
                <ul className="section-quote__list">
                    <li className="section-quote-item">
                        <q className="section-quote-quote-text">
                        I've struggled to find the right financing for my education.
                        UniPay's combination of technology and deep understanding 
                        of global finance, empowers students like me to unlock their 
                        potential and thrive in their academic journey. 
                        
                        </q>
                        <div className="section-quote__person">
                            <div className="section-quote__person-image">
                                <Image
                                    src={'/img/jadenDahliwal.jpg'}
                                    alt={'USC Viterbi Dean'}
                                    fill
                                    sizes="(max-width: 768px) 200px, (max-width: 1200px) 400px"
                                />
                            </div>
                            <div className="section-quote__person-text">
                                <strong className="section-quote__person-name">
                                    Jaden Dalhiwal
                                </strong>
                                <small className="section-quote__person-position">
                                    Student, <br /> USC Marshall
                                    School of Business
                                </small>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    );
}

// Renders one parallax column (3 images) with a dynamic "y" transform
function Column({
                    images,
                    y,
                }: {
    images: string[];
    y: MotionValue<number>; // Explicitly specify number here
}) {
    return (
        <motion.div className="section-quote__gallery__column" style={{ y }}>
            {images.map((src, i) => (
                <div key={i} className="section-quote__gallery__image-container">
                    <Image
                        src={`/img/${src}`}
                        alt="image"
                        fill
                        style={{ objectFit: 'contain', opacity: 0.3 }}
                    />
                </div>
            ))}
        </motion.div>
    );
}

