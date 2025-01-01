import SectionContact from '@/components/sections/section-contact/section-contact';
import SectionFaq from '@/components/sections/section-faq/section-faq';
import SectionHero from '@/components/sections/section-hero/section-hero';
import SectionInnovation from '@/components/sections/section-innovation/section-innovation';
import SectionJoin from '@/components/sections/section-join/section-join';
import SectionProcess from '@/components/sections/section-process/section-process';
import SectionQuote from '@/components/sections/section-quote/section-quote';
import SectionWhyus from '@/components/sections/section-whyus/section-whyus';

export default function Home() {
    return (
        <>
            <SectionHero />
            <SectionQuote />
            <SectionWhyus />
            <SectionProcess />
            <SectionInnovation />
            <SectionJoin />
            <SectionFaq />
            <SectionContact />
        </>
    );
}
