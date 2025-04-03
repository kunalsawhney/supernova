"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { FaLightbulb } from "react-icons/fa6";
import { cn } from "@/lib/utils";


export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });


  return (
    <motion.section 
      className="relative overflow-hidden bg-gradient-to-b from-background to-background/95 px-4 md:px-12" 
      ref={containerRef}
      id="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 1 }}
    >

      {/* Main hero section */}
      <div className="container mx-auto p-12 min-h-[calc(100vh-8rem)] flex flex-col justify-center relative z-10 border-2 rounded-2xl border-muted-foreground/20">

        <div className="flex flex-col items-center rounded-2xl">
          {/* Background pattern */}
          <div
            className={cn(
              "absolute inset-0",
              "[background-size:10px_10px]",
              "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
              "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
              "z-[-10] opacity-50"
            )}
          />

          <div className="flex flex-col items-center max-w-3xl space-y-8 text-center">
            <div 
              className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
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

            <p className="text-lg font-semibold text-muted-foreground">
              Empowering K-12 students with cutting-edge technology courses designed to spark creativity, critical thinking, and prepare them for the digital future.
            </p>

            <div 
              className="flex flex-wrap gap-3 justify-center border-b border-border pb-8"
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
              className="grid grid-cols-3 gap-12"
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
                    
          
          


        </div>
      </div>
    </motion.section>
  );
}
