"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, useAnimation, Variants } from "framer-motion";

// Animated shape component
const AnimatedShape = ({ 
  className, 
  variants, 
  initial, 
  animate,
  transition 
}: { 
  className: string; 
  variants?: Variants;
  initial?: any;
  animate?: any;
  transition?: any;
}) => (
  <motion.div 
    className={className}
    variants={variants}
    initial={initial}
    animate={animate}
    transition={transition}
  />
);

export default function Cta() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start("visible");
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      }
    }
  };

  return (
    <section 
      className="section-container relative overflow-hidden py-20" 
      ref={containerRef}
    >
      {/* Background gradients and vectors */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/20 to-background/50" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={isVisible ? { opacity: 0.3, scale: 1, rotate: 0 } : {}}
        transition={{ duration: 1.5 }}
      >
        <Image src="/vectors/vector2.svg" alt="" width={150} height={150} className="absolute top-10 left-10 -z-10" />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
        animate={isVisible ? { opacity: 0.3, scale: 1, rotate: 0 } : {}}
        transition={{ duration: 1.5, delay: 0.2 }}
      >
        <Image src="/vectors/vector4.svg" alt="" width={200} height={200} className="absolute bottom-10 right-10 -z-10" />
      </motion.div>
      
      <div className="container mx-auto">
        <motion.div 
          className="relative rounded-2xl bg-primary p-8 md:p-12 lg:p-16 overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Animated background gradients */}
          <AnimatedShape 
            className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-secondary opacity-50 blur-xl"
            initial={{ x: -20, y: -20, opacity: 0.2 }}
            animate={isVisible ? { x: 0, y: 0, opacity: 0.5 } : {}}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <AnimatedShape 
            className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-accent opacity-50 blur-xl"
            initial={{ x: 20, y: 20, opacity: 0.2 }}
            animate={isVisible ? { x: 0, y: 0, opacity: 0.5 } : {}}
            transition={{ 
              duration: 3.5, 
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.5 
            }}
          />
          
          {/* Floating particles */}
          {[...Array(5)].map((_, i) => (
            <AnimatedShape 
              key={i}
              className={`absolute h-4 w-4 rounded-full bg-primary-foreground/30 blur-sm`}
              initial={{ 
                x: Math.random() * 500 - 250, 
                y: Math.random() * 300 - 150,
                opacity: 0 
              }}
              animate={isVisible ? { 
                y: [0, -30, 0],
                opacity: [0, 0.4, 0]
              } : {}}
              transition={{ 
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5
              }}
            />
          ))}
          
          <div className="relative">
            <motion.div 
              className="max-w-2xl mx-auto text-center space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate={controls}
            >
              <motion.h2 
                className="text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl"
                variants={itemVariants}
              >
                Transform Your Child's Future Today
              </motion.h2>
              
              <motion.p 
                className="text-xl text-primary-foreground/80"
                variants={itemVariants}
              >
                Join thousands of families already empowering their children with the perfect balance 
                of technical expertise and personal growth.
              </motion.p>
              
              <motion.div 
                className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center"
                variants={itemVariants}
              >
                <Button 
                  size="xl" 
                  variant="secondary"
                  className="rounded-full relative overflow-hidden group"
                >
                  <span className="relative z-10">Start Your Free Trial</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
                
                <Button 
                  size="xl" 
                  variant="ghost"
                  className="text-primary-foreground/90 hover:text-primary-foreground rounded-full"
                >
                  Schedule a Demo
                </Button>
              </motion.div>
              
              <motion.p 
                className="text-sm text-primary-foreground/60"
                variants={itemVariants}
              >
                No credit card required. 14-day free trial.
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-16 grid gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
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
            <motion.div 
              key={index} 
              className="text-center p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10 shadow-sm"
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 