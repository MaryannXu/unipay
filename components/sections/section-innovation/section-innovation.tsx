import './section-innovation.scss';
import Icon_comfort from '../../icons/icon-comfort';
import Icon_quality from '../../icons/icon-quality';
import Icon_web3 from '../../icons/icon-web3';
import Icon_energy from '../../icons/icon-energy';
import Icon_marketplace from '../../icons/icon-marketplace';
import Icon_price from '../../icons/icon-price';

export default function SectionInnovation() {
    return (
        <section id='innovations' className='section-innovation'>
            <div className='container section-innovation__container'>
                <div className='section-innovation__header'>
                    <div className='section-innovation__heading-wrapper'>
                        <small className='section-innovation__top-caption'>WHAT ARE OUR DIFFERENTIATORS?</small>
                        <h2 className='section-innovation__heading'>We Redefine Finance</h2>
                    </div>
                    <p className='section-innovation__description-text'>
                        Your growth is our priority, with tailored solutions, financial empowerment, and a network of support.
                    </p>
                </div>
                <ul className='section-innovation__grid-list'>
                    <li className='section-innovation__grid-item'>
                        <div className='section-innovation__grid-icon'>
                            <Icon_quality/>
                        </div>
                        <div className='section-innovation__grid-description'>
                            <h3 className='section-innovation__description-heading'>Holistic Perspective</h3>
                            <p className='section-innovation__description-text'>
                                We understand you are at an early point in your career.
                                To make sure our assessment of your potential is fair,
                                we look at your all around potential.
                            </p>
                        </div>
                    </li>
                    <li className='section-innovation__grid-item'>
                        <div className='section-innovation__grid-icon'>
                            <Icon_price />
                        </div>
                        <div className='section-innovation__grid-description'>
                            <h3 className='section-innovation__description-heading'>Financial Support</h3>
                            <p className='section-innovation__description-text'>
                                By supporting you financially we hope to make you feel you belong
                                here. Being a member of UniPay we'll keep record of your
                                financing history which can boost your U.S credit score for the
                                long run.
                            </p>
                        </div>
                    </li>
                    <li className='section-innovation__grid-item'>
                        <div className='section-innovation__grid-icon'>
                            <Icon_marketplace/>
                        </div>
                        <div className='section-innovation__grid-description'>
                            <h3 className='section-innovation__description-heading'>Community Driven</h3>
                            <p className='section-innovation__description-text'>
                                We care about you. And so do others. That's why we brings on alumni
                                and other supporters of your university to form a community driven
                                lending system.
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    );
}
