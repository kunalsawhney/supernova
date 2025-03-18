import Image from "next/image";
import { FaChevronRight } from "react-icons/fa6";
import Button from "@/components/ui/Button";

interface FEATURE {
    title: string;
    description: string;
}

const FEATURES: FEATURE[] = [
    {
        title: 'Personalized Learning Paths',
        description: 'Tailored to each student’s pace and needs.',
    },
    {
        title: 'Holistic Development',
        description: 'Cultivating soft skills like leadership, mindfulness, and emotional intelligence.'
    },
    {
        title: 'Real-World Projects',
        description: 'Hands-on experience with real-world projects and challenges.'
    },
    {
        title: 'Flexible Learning',
        description: 'Learn at your own pace, on your own schedule.'
    },
]

export default function Features() {
    return (
        <section id="about" className="section-container">
          <div className="container">
            <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
              <div className="relative">
                <div className="relative z-10 overflow-hidden rounded-2xl border shadow-xl bg-background-primary">
                  <Image
                    src="/placeholder.svg"
                    width={200}
                    height={200}
                    alt="Innovative teaching methods"
                    className="w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 z-0 h-full w-full rounded-2xl bg-background-secondary"></div>
              </div>
              <div className="space-y-6">
                <h2 className="section-title text-muted-foreground">What Makes Us Different</h2>
                <p className="section-subtitle">
                  At MetaMinor, we believe in a holistic approach to technology education that goes beyond just teaching
                  coding. Our unique methodology focuses on developing well-rounded tech innovators.
                </p>
                <div className="space-y-4">
                    {FEATURES.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                        <FaChevronRight className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="section-text !font-semibold">{item.title}</h3>
                        <p className="section-text !italic">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button text="Learn More About Our Approach" />
              </div>
            </div>
          </div>
        </section>
    );
}