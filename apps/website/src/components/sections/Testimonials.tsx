"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { FaQuoteLeft, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  image: string;
  rating?: number;
}

const testimonials: Testimonial[] = [
  {
    quote: "My child has shown remarkable improvement in both technical skills and emotional intelligence. The platform's adaptive learning approach has helped them master concepts at their own pace.",
    author: "Sarah Chen",
    role: "Parent of a 10-year-old student",
    image: "/avatars/avatar-1.png",
    rating: 5
  },
  {
    quote: "The integration of coding with personal development is brilliant. My students are not just learning to code, but also developing crucial life skills like leadership and emotional regulation.",
    author: "James Rodriguez",
    role: "Middle School Teacher",
    image: "/avatars/avatar-2.png",
    rating: 5
  },
  {
    quote: "The bridging modules are a game-changer. They allowed my daughter to join mid-year and catch up quickly without feeling overwhelmed or left behind.",
    author: "Emily Nakamura",
    role: "Parent of a high school student",
    image: "/avatars/avatar-3.png",
    rating: 4
  },
  {
    quote: "As a school administrator, I've seen numerous EdTech platforms, but this one truly stands out with its holistic approach and minimal teacher intervention requirements.",
    author: "Michael Thompson",
    role: "School Principal",
    image: "/avatars/avatar-4.png",
    rating: 5
  }
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [activeIndex, setActiveIndex] = useState(0);

  // Navigation functions
  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <motion.section 
      id="testimonials" 
      className="section-container py-20 relative overflow-hidden"
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
          className="relative max-w-4xl mx-auto"
        >
          {/* Featured testimonial */}
          <div className="relative bg-background z-10 rounded-2xl shadow-xl overflow-hidden border border-primary/10">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5 backdrop-blur-sm" />
            
            <div className="p-8 md:p-12 relative flex flex-col md:flex-row gap-8">
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 relative mx-auto md:mx-0">
                  <div className="w-full h-full overflow-hidden rounded-full border-4 border-primary/10">
                    <Image 
                      src={testimonials[activeIndex].image} 
                      alt={testimonials[activeIndex].author} 
                      width={128} 
                      height={128} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  {/* Quote icon */}
                  <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full">
                    <FaQuoteLeft className="h-4 w-4" />
                  </div>
                </div>
                
                {/* Rating */}
                <div className="flex justify-center md:justify-start mt-3 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`h-4 w-4 ${i < (testimonials[activeIndex].rating || 5) ? 'text-yellow-400' : 'text-muted'}`} 
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center text-center md:text-left">
                <p className="text-lg md:text-xl italic mb-6">
                  "{testimonials[activeIndex].quote}"
                </p>
                
                <div>
                  <h4 className="text-lg font-semibold">{testimonials[activeIndex].author}</h4>
                  <p className="text-muted-foreground">{testimonials[activeIndex].role}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation controls */}
          <div className="flex justify-between mt-8">
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === index ? 'bg-primary w-8' : 'bg-muted w-2.5'
                  }`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              <button
                className="p-2 rounded-full bg-background border border-border hover:bg-muted transition-colors"
                onClick={goToPrev}
              >
                <FaChevronLeft className="h-4 w-4" />
              </button>
              
              <button
                className="p-2 rounded-full bg-background border border-border hover:bg-muted transition-colors"
                onClick={goToNext}
              >
                <FaChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
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