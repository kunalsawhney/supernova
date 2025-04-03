// import Hero from "@/components/sections/Hero";
import Hero from "@/components/sections/Hero-2";
import Features from "@/components/sections/Features";
import Curriculum from "@/components/sections/Curriculum";
import Pricing from "@/components/sections/Pricing";
// import Testimonials from "@/components/sections/Testimonials";
import Testimonials from "@/components/sections/Testimonials-2";
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