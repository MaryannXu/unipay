'use client';

import './section-faq.scss';
import Icon_accordion from '../../icons/icon-accordion';
import { useState } from 'react';

type ItemProps = {
    heading: string;
    text: string;
};

function SectionFaqItem({ heading, text }: ItemProps) {
    const [isOpened, setIsOpened] = useState(false);

    return (
        <li onClick={() => setIsOpened((curr) => !curr)} className={isOpened ? 'section-faq__item active' : 'section-faq__item'}>
            <h3 className='section-faq__item-heading'>{heading}</h3>
            <span className='section-faq__item-button'>
                <Icon_accordion type={isOpened ? 'close' : 'open'} />
            </span>
            <div className='section-faq__spoiler-wrapper'>
                <p className='section-faq__item-text'>{text}</p>
            </div>
        </li>
    );
}

const LIST: ItemProps[] = [
    {
        heading: 'Can UniPay help me access financial support?',
        text: 'Yes! Once approved, UniPay provides financial support tailored to the needs of our members.',
    },
    {
        heading: 'What are my options as an international student?',
        text: 'Interest rates and loan terms depend on your financial background. Most lenders require a cosigner for international student loans, but UniPay offers options to help you navigate these challenges.',
    },
    {
        heading: 'How can I learn more about UniPay and financial resources?',
        text: 'Explore our platform for in-depth resources on studying in the U.S., or connect with us on social media for tips, updates, and support.',
    },
];

export default function SectionFaqList() {
    return (
        <ul className='section-faq__list'>
            {LIST.map((el, i) => (
                <SectionFaqItem key={i} heading={el.heading} text={el.text} />
            ))}
        </ul>
    );
}
