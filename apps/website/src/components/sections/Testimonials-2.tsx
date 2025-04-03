"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

interface Testimonial {
  quote: string;
  author: string;
  image: string;
  className: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "My child has shown remarkable improvement in both technical skills and emotional intelligence. The platform's adaptive learning approach has helped them master concepts at their own pace.",
    author: "Sarah Chen",
    image: "/avatars/avatar-1.png",
    className: "md:row-span-2"
  },
  {
    quote: "The integration of coding with personal development is brilliant. My students are not just learning to code, but also developing crucial life skills like leadership and emotional regulation.",
    author: "James Rodriguez",
    image: "/avatars/avatar-2.png",
    className: "md:col-span-2"
  },
  {
    quote: "The bridging modules are a game-changer. They allowed my daughter to join mid-year and catch up quickly without feeling overwhelmed or left behind.",
    author: "Emily Nakamura",
    image: "/avatars/avatar-3.png",
    className: "md:col-span-1"
  },
  {
    quote: "As a school administrator, I've seen numerous EdTech platforms, but this one truly stands out with its holistic approach and minimal teacher intervention requirements.",
    author: "Michael Thompson",
    image: "/avatars/avatar-4.png",
    className: "md:row-span-2" 
  },
  {
    quote: "As a school administrator, I've seen numerous EdTech platforms, but this one truly stands out with its holistic approach and minimal teacher intervention requirements.",
    author: "Michael Thompson",
    image: "/avatars/avatar-4.png",
    className: "md:col-span-2" 
  }
];


export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.section 
      id="testimonials" 
      className="section-container relative overflow-hidden"
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 1 }}
    >
      {/* Background elements */}
      <Image src="/vectors/vector7.svg" alt="" width={100} height={100} className="absolute top-0 left-0 -z-10 -rotate-90" />
      <Image src="/vectors/vector7.svg" alt="" width={100} height={100} className="absolute top-0 right-0 -z-10" />
      <Image src="/vectors/vector7.svg" alt="" width={100} height={100} className="absolute bottom-0 left-0 -z-10 rotate-180" />
      <Image src="/vectors/vector7.svg" alt="" width={100} height={100} className="absolute bottom-0 right-0 -z-10 rotate-90" />

      <div className="container mx-auto">
        <div 
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <div 
            className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full mb-4 text-sm font-medium"
          >
            Testimonials
          </div>
          
          <h2 
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          >
            What Our Community Says
          </h2>
          
          <p 
            className="text-xl text-muted-foreground"
          >
            Students, parents, and educators love our unique approach to learning 
            that balances technology with personal growth.
          </p>
        </div>

        <div 
          className="relative max-w-6xl mx-auto"
        >
          <BentoGrid>
            {testimonials.map((testimonial, index) => (
              <BentoGridItem 
                key={index} 
                className={testimonial.className}
                title={testimonial.author}
                description={testimonial.quote}
                header={
                  <div className="flex items-center gap-2">
                    <Image src={testimonial.image} alt={testimonial.author} width={40} height={40} className="rounded-full" />
                  </div>
                }
              />
            ))}
          </BentoGrid>
        </div>

        <div 
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-6 py-3 text-sm font-medium text-primary">
            <span>Join over 10,000+ happy students worldwide</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
} 