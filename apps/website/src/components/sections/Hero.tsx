"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { FaLightbulb } from "react-icons/fa6";


export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });


  return (
    <motion.section 
      className="relative overflow-hidden bg-gradient-to-b from-background to-background/95" 
      ref={containerRef}
      id="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 1 }}
    >

      {/* Main hero section */}
      <div className="container mx-auto px-4 py-20 min-h-[90vh] flex flex-col justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left column - Content */}
          <div 
            className="lg:col-span-6 space-y-8"
          >
            <div>
              <div 
                className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
              >
                The future of K-12 education
              </div>
              
              <div className="space-y-2">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                  Ignite the Future
                </h1>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
                  of Innovation
                </h1>
              </div>
            </div>
            
            <p 
              className="text-lg text-muted-foreground"
            >
              Empowering K-12 students with cutting-edge technology courses designed to spark creativity, critical thinking, and prepare them for the digital future.
            </p>
            
            <div 
              className="flex flex-wrap gap-3"
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
            </div>
            
            {/* Stats */}
            <div 
              className="grid grid-cols-3 gap-4 pt-6 border-t border-border"
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
            </div>
          </div>
          
          {/* Right column - Image & Features */}
          <div className="lg:col-span-6 space-y-6">
            <div 
              className="relative"
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
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
