import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Curriculum from "@/components/sections/Curriculum";
import Pricing from "@/components/sections/Pricing";
import Testimonials from "@/components/sections/Testimonials";
import Faq from "@/components/sections/Faq";
import Cta from "@/components/sections/Cta";


export default function Home() {
    return (
        <div>
            <Hero />
            <Features />
            <Curriculum />
            <Pricing />
            <Testimonials />
            <Faq />
            <Cta />
        </div>
    );
}