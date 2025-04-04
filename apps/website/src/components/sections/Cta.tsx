"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";

export default function Cta() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const controls = useAnimation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
      }
    }
  };

  // Trigger animations when in view (only once)
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.section 
      className="section-container relative overflow-hidden py-20" 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 1 }}
    >
      {/* Background gradients and vectors */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/20 to-background/50" />
      
      <div className="absolute top-10 left-10 -z-10 opacity-30">
        <Image src="/vectors/vector2.svg" alt="" width={150} height={150} />
      </div>
      
      <div className="absolute bottom-10 right-10 -z-10 opacity-30">
        <Image src="/vectors/vector4.svg" alt="" width={200} height={200} />
      </div>
      
      <div className="container mx-auto">
        <div 
          className="relative rounded-2xl bg-primary p-8 md:p-12 lg:p-16 overflow-hidden"
        >
          {/* Static background gradients */}
          <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-secondary opacity-50 blur-xl" />
          <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-accent opacity-50 blur-xl" />
          
          <div className="relative">
            <div 
              className="max-w-2xl mx-auto text-center space-y-6"
            >
              <h2 
                className="text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl"
              >
                Transform Your Child's Future Today
              </h2>
              
              <p 
                className="text-xl text-primary-foreground/80"
              >
                Join thousands of families already empowering their children with the perfect balance 
                of technical expertise and personal growth.
              </p>
              
              <div 
                className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center"
              >
                <Button 
                  size="xl" 
                  variant="secondary"
                  className=""
                >
                  Start Your Free Trial
                </Button>
                
                <Button 
                  size="xl" 
                  variant="ghost"
                  className="bg-white"
                >
                  Schedule a Demo
                </Button>
              </div>
              
              <p 
                className="text-sm text-primary-foreground/60"
              >
                No credit card required. 14-day free trial.
              </p>
            </div>
          </div>
        </div>
        
        <div 
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          {[
            {
              title: "Personalized Learning",
              description: "Tailored to each student's unique needs and learning style."
            },
            {
              title: "Holistic Development",
              description: "Technical expertise paired with essential life skills."
            },
            {
              title: "Future Ready",
              description: "Preparing students for the challenges of tomorrow."
            }
          ].map((item, index) => (
            <div 
              key={index} 
              className="text-center p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10 shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
} 