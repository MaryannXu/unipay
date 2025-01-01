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
        heading: 'Can UniPay provide a letter of financial support?',
        text: 'Upon credit approval, MPOWER is able to issue support letters to assist our applicants with the visa process at no cost. You will need to provide the Support Letter to your school in order to receive the I-20.',
    },
    {
        heading: 'What is the loan repayment process like?',
        text: 'With UniPay, repayment begins after a grace period which includes the period of your study as well as a few additional months. Financing: 6 months from class end date. Refinancing: 6 months after graduating.',
    },
    {
        heading: 'How do funds get disbursed?',
        text: 'By partnering with your school, we disperse funds directly to your universities financial aid office. You\'ll receive confirmation of fund dispersal when completed.',
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
