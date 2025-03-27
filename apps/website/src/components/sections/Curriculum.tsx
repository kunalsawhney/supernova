"use client";

import { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { FaBrain, FaCode, FaHeart, FaLightbulb, FaChevronRight } from "react-icons/fa6";
import { motion, useAnimation, useInView } from "framer-motion";

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
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.2 });
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    // Animation variants
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.3
        }
      }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
      }
    };

    // Trigger animations when in view
    useEffect(() => {
      if (isInView) {
        controls.start("visible");
      } else {
        controls.start("hidden");
      }
    }, [isInView, controls]);

    return (
      <section id="curriculum" className="section-container relative py-20 overflow-hidden" ref={ref}>
        {/* Background elements */}
        <div className="absolute inset-0 -z-10">
          <motion.div 
            className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1 }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-secondary/5 blur-3xl"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={isInView ? { opacity: 0.3, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 1.5 }}
        >
          <Image src="/vectors/vector2.svg" alt="" width={100} height={100} className="absolute top-10 right-10 -z-10" />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={isInView ? { opacity: 0.3, scale: 1, rotate: 0 } : {}}
          transition={{ duration: 1.5, delay: 0.2 }}
        >
          <Image src="/vectors/vector3.svg" alt="" width={100} height={100} className="absolute bottom-10 left-10 -z-10" />
        </motion.div>
        
        <div className="container mx-auto space-y-16">
          <motion.div 
            className="max-w-3xl mx-auto text-center space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            <motion.div 
              className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full mb-4 text-sm font-medium"
              variants={itemVariants}
            >
              Age-Appropriate Learning
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
              variants={itemVariants}
            >
              Curriculum for Every Stage of Growth
            </motion.h2>
            
            <motion.p 
              className="text-xl text-muted-foreground"
              variants={itemVariants}
            >
              From early childhood to high school, our curriculum fosters both technical expertise and emotional intelligence.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {ageGroups.map((group, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{ 
                  y: -10, 
                  transition: { duration: 0.2 }
                }}
              >
                <Card className="overflow-hidden h-full border border-muted bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                  <CardHeader className={`${group.bgColor} flex flex-row items-center gap-4`}>
                    <motion.div 
                      className={`rounded-full bg-background/80 p-2.5 ${group.color}`}
                      whileHover={{ scale: 1.1 }}
                      animate={hoveredCard === index ? { 
                        y: [0, -5, 0],
                        transition: { 
                          duration: 1, 
                          repeat: Infinity,
                          repeatType: "loop" 
                        }
                      } : {}}
                    >
                      {group.icon}
                    </motion.div>
                    <div>
                      <CardTitle>{group.title}</CardTitle>
                      <CardDescription>{group.ageRange}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${group.color.replace('text', 'bg')}`}></span>
                        Tech Education
                      </h3>
                      <ul className="space-y-2 pl-4">
                        {group.techTrack.map((item, i) => (
                          <motion.li 
                            key={i}
                            className="flex items-start gap-2 text-muted-foreground"
                            initial={{ opacity: 0, x: -10 }}
                            animate={hoveredCard === index ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                          >
                            <FaChevronRight className={`h-3 w-3 mt-1.5 flex-shrink-0 ${group.color}`} />
                            <span>{item}</span>
                          </motion.li>
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
                          <motion.li 
                            key={i}
                            className="flex items-start gap-2 text-muted-foreground"
                            initial={{ opacity: 0, x: -10 }}
                            animate={hoveredCard === index ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                          >
                            <FaChevronRight className={`h-3 w-3 mt-1.5 flex-shrink-0 ${group.color}`} />
                            <span>{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 backdrop-blur-sm border border-primary/10"
              whileHover={{ 
                boxShadow: "0 0 30px rgba(var(--primary-rgb), 0.2)",
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              <motion.div 
                className="text-center"
              >
                <motion.h3 
                  className="text-2xl font-semibold mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  Bridging Modules for Late Joiners
                </motion.h3>
                <motion.p 
                  className="text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  Our specialized bridging modules quickly cover foundational concepts, 
                  allowing students to join at any level and catch up seamlessly.
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
}