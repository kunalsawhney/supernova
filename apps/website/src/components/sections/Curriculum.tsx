"use client";

import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { FaBrain, FaCode, FaHeart, FaLightbulb, FaChevronRight } from "react-icons/fa6";
import { motion, useInView } from "framer-motion";

interface AgeGroup {
  title: string;
  ageRange: string;
  techTrack: string[];
  personalTrack: string[];
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const ageGroups: AgeGroup[] = [
  {
    title: "Early Childhood",
    ageRange: "Ages 4-8",
    techTrack: [
      "Interactive games",
      "Block-based coding",
      "Basic digital literacy"
    ],
    personalTrack: [
      "Emotional awareness",
      "Basic social skills",
      "Interactive storytelling"
    ],
    icon: <FaLightbulb className="h-6 w-6" />,
    color: "text-amber-500",
    bgColor: "bg-amber-50 dark:bg-amber-950/30"
  },
  {
    title: "Elementary",
    ageRange: "Ages 9-12",
    techTrack: [
      "Visual coding",
      "Transitional text-based coding",
      "Creative digital projects"
    ],
    personalTrack: [
      "Self-reflection",
      "Effective communication",
      "Teamwork"
    ],
    icon: <FaCode className="h-6 w-6" />,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30"
  },
  {
    title: "Middle School",
    ageRange: "Ages 13-15",
    techTrack: [
      "Python programming",
      "Basic data structures",
      "Problem-solving projects"
    ],
    personalTrack: [
      "Emotional intelligence",
      "Stress management",
      "Goal setting"
    ],
    icon: <FaBrain className="h-6 w-6" />,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30"
  },
  {
    title: "High School",
    ageRange: "Ages 16-18",
    techTrack: [
      "Advanced coding concepts",
      "APIs & web development",
      "Capstone projects"
    ],
    personalTrack: [
      "Leadership",
      "Critical thinking",
      "Career planning"
    ],
    icon: <FaHeart className="h-6 w-6" />,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/30"
  }
];

export default function Curriculum() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

  
    return (
      <motion.section 
        id="curriculum" 
        className="section-container relative py-20 overflow-hidden" 
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {/* Background elements */}
        
        {/* <Image src="/vectors/vector2.svg" alt="" width={100} height={100} className="absolute top-10 right-10 -z-10 opacity-50" /> */}
        {/* <Image src="/vectors/vector3.svg" alt="" width={100} height={100} className="absolute bottom-10 left-10 -z-10 opacity-50" /> */}
        
        <div className="container mx-auto space-y-16">
          <div 
            className="max-w-3xl mx-auto text-center space-y-4"
          >
            <div 
              className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full mb-4 text-sm font-medium"
            >
              Age-Appropriate Learning
            </div>
            
            <h2 
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            >
              Curriculum for Every Stage of Growth
            </h2>
            
            <p 
              className="text-xl text-muted-foreground"
            >
              From early childhood to high school, our curriculum fosters both technical expertise and emotional intelligence.
            </p>
          </div>
          
          <div className="flex flex-col gap-8 bg-primary/20 rounded-2xl p-8">
            <div 
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            >
              {ageGroups.map((group, index) => (
                <div 
                  key={index} 
                  className="h-full hover:scale-105 transition-all duration-300"
                >
                  <Card className="overflow-hidden h-full border border-muted bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md">
                    <CardHeader className={`${group.bgColor} flex flex-row items-center gap-4`}>
                      <div className={`rounded-full bg-background/80 p-2.5 ${group.color}`}>
                        {group.icon}
                      </div>
                      <div>
                        <CardTitle>{group.title}</CardTitle>
                        <CardDescription>{group.ageRange}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6 bg-background h-full">
                      <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${group.color.replace('text', 'bg')}`}></span>
                          Tech Education
                        </h3>
                        <ul className="space-y-2 pl-4">
                          {group.techTrack.map((item, i) => (
                            <li 
                              key={i}
                              className="flex items-start gap-2 text-muted-foreground"
                            >
                              <FaChevronRight className={`h-3 w-3 mt-1.5 flex-shrink-0 ${group.color}`} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${group.color.replace('text', 'bg')}`}></span>
                          Personal Development
                        </h3>
                        <ul className="space-y-2 pl-4">
                          {group.personalTrack.map((item, i) => (
                            <li 
                              key={i}
                              className="flex items-start gap-2 text-muted-foreground"
                            >
                              <FaChevronRight className={`h-3 w-3 mt-1.5 flex-shrink-0 ${group.color}`} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            <div 
              className="max-w-3xl mx-auto"
            >
              <div className="bg-background rounded-2xl p-8 backdrop-blur-sm border border-primary/10">
                <div className="text-center">
                  <h3 
                    className="text-2xl font-semibold mb-4"
                  >
                    Bridging Modules for Late Joiners
                  </h3>
                  <p 
                    className="text-muted-foreground"
                  >
                    Our specialized bridging modules quickly cover foundational concepts, 
                    allowing students to join at any level and catch up seamlessly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    );
}