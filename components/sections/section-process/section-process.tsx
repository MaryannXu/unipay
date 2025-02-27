"use client";
import SectionProcessList from './section-process-list';
import './section-process.scss';
import {useRouter} from "next/navigation";

export default function SectionProcess() {
    const router = useRouter();

    return (
        <section id='process' className='section-process'>
            <div className='container section-process__container'>
                <div className='section-process__heading-wrapper'>
                    <small className='section-process__top-caption'>Process</small>
                    <h2 className='section-process__heading'>Unlock Financial Growth in Three Easy Steps</h2>
                </div>
                <SectionProcessList />
                <button className='section-process__cta-button' onClick={() => router.push("/credit-score")}>Start Now</button>
            </div>
        </section>
    );
}
