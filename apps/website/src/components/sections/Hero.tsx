"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { FaLightbulb, FaRocket, FaGraduationCap } from "react-icons/fa6";

// Feature Card Component
const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay: number;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-background/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-primary/20"
  >
    <div className="flex items-start gap-4">
      <div className="bg-primary/10 p-3 rounded-lg text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  </motion.div>
);

// Animated Text Component
const AnimatedText = ({ text, className = "" }: { text: string; className?: string }) => {
  return (
    <div className={className}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};


export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  // Features data
  const features = [
    {
      icon: <FaLightbulb className="h-6 w-6" />,
      title: "Creative Learning",
      description: "Inspiring courses that spark imagination and encourage innovation."
    },
    {
      icon: <FaRocket className="h-6 w-6" />,
      title: "Future Skills",
      description: "Cutting-edge technology skills that prepare students for tomorrow's challenges."
    },
    {
      icon: <FaGraduationCap className="h-6 w-6" />,
      title: "Personalized Path",
      description: "Adaptive learning experiences tailored to each student's unique journey."
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background to-background/95" ref={containerRef}>

      {/* Main hero section */}
      <div className="container mx-auto px-4 py-20 min-h-[90vh] flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left column - Content */}
          <motion.div 
            className="lg:col-span-6 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -50 }}
            transition={{ duration: 0.7 }}
          >
            <div>
              <motion.div 
                className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -20 }}
                transition={{ duration: 0.5 }}
              >
                The future of K-12 education
              </motion.div>
              
              <div className="space-y-2">
                <AnimatedText 
                  text="Ignite the Future" 
                  className="text-5xl md:text-6xl font-bold tracking-tight" 
                />
                <AnimatedText 
                  text="of Innovation" 
                  className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text" 
                />
              </div>
            </div>
            
            <motion.p 
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Empowering K-12 students with cutting-edge technology courses designed to spark creativity, critical thinking, and prepare them for the digital future.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Button 
                size="xl" 
                className=""
              >
                Get Started
              </Button>
              
              <Button 
                variant="outline" 
                size="xl"
                className=""
              >
                <span className="mr-2">▶</span> Watch Demo
              </Button>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-4 pt-6 border-t border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              {[
                { value: "200+", label: "Courses" },
                { value: "50k+", label: "Students" },
                { value: "95%", label: "Success Rate" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Right column - Image & Features */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.9 }}
              transition={{ duration: 0.7 }}
            >
              {/* Main image */}
              <div className="relative z-10 rounded-2xl shadow-2xl">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 opacity-75 blur-sm rounded-2xl" />
                <div className="relative rounded-2xl  border border-white/10">
                  <Image
                    src="/hero.png"
                    width={600}
                    height={600}
                    alt="Interactive learning platform"
                    className="w-full h-auto rounded-2xl"
                  />
                </div>
                
                <div className="absolute -right-4 -top-4 z-20 bg-gradient-to-br from-primary to-purple-600 p-3 rounded-full shadow-lg z-10">
                  <FaLightbulb className="h-8 w-8 text-white" />
                </div>
              </div>
              
              {/* Feature cards (showing by default) */}
              {/* <div className="grid gap-4 mt-6">
                {features.map((feature, i) => (
                  <FeatureCard 
                    key={i}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    delay={1.2 + i * 0.2}
                  />
                ))}
              </div> */}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
