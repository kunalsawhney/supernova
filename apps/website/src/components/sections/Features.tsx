"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation, useInView } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaCode, FaGraduationCap, FaLightbulb, FaUsers } from "react-icons/fa6";

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FEATURES: Feature[] = [
    {
        icon: <FaLightbulb className="h-10 w-10 text-primary" />,
        title: 'Personalized Learning Paths',
        description: 'Adaptive technology creates tailored educational journeys based on each student\'s learning style, pace, and interests.'
    },
    {
        icon: <FaCode className="h-10 w-10 text-primary" />,
        title: 'Tech + Personal Development',
        description: 'A holistic approach that balances coding skills with emotional intelligence, leadership, and mindfulness.'
    },
    {
        icon: <FaUsers className="h-10 w-10 text-primary" />,
        title: 'Bridging Modules',
        description: 'Specialized modules help late joiners quickly catch up on foundational concepts without feeling overwhelmed.'
    },
    {
        icon: <FaGraduationCap className="h-10 w-10 text-primary" />,
        title: 'Minimal Teacher Intervention',
        description: 'Our intelligent platform handles routine tasks, freeing teachers to focus on mentorship and targeted support.'
    }
];

export default function Features() {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

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
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    // Trigger animations when in view (only once)
    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    return (
        <section id="features" className="section-container relative overflow-hidden py-20" ref={ref}>
            {/* Background elements */}
            <div className="absolute w-full h-full top-0 left-0 -z-10">
                {/* Static gradient orbs */}
                <div className="absolute h-60 w-60 rounded-full bg-primary/10 blur-3xl opacity-30" style={{ top: '10%', left: '5%' }} />
                <div className="absolute h-40 w-40 rounded-full bg-secondary/10 blur-3xl opacity-30" style={{ bottom: '15%', right: '10%' }} />
                
                <Image src="/vectors/vector1.svg" alt="" width={100} height={100} className="absolute top-10 left-10 opacity-50" />
                <Image src="/vectors/vector4.svg" alt="" width={100} height={100} className="absolute bottom-10 right-10 opacity-50" />
            </div>
          
            <div className="container mx-auto">
                <motion.div 
                    className="max-w-2xl mx-auto text-center space-y-4 mb-16"
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                >
                    <motion.div 
                        className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                        variants={itemVariants}
                    >
                        What Makes Us Different
                    </motion.div>
                    
                    <motion.h2 
                        className="text-4xl md:text-5xl font-bold tracking-tight"
                        variants={itemVariants}
                    >
                        Innovative Learning for the Digital Age
                    </motion.h2>
                    
                    <motion.p 
                        className="text-xl text-muted-foreground"
                        variants={itemVariants}
                    >
                        Our unique approach combines adaptive technology with holistic development, creating a learning experience unlike any other.
                    </motion.p>
                </motion.div>

                <motion.div 
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                >
                    {FEATURES.map((feature, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card className="h-full border shadow-md bg-gradient-to-b from-background to-muted/30 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
                                <CardHeader className="pb-2">
                                    <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
                                        {feature.icon}
                                    </div>
                                    <CardTitle>{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">{feature.description}</CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
                
                <div className="mt-32">
                    <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
                        <motion.div 
                            className="relative order-2 lg:order-1"
                            initial={{ opacity: 0, x: -50 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.7, delay: 0.3 }}
                        >
                            <div className="relative z-10  rounded-2xl border shadow-xl bg-primary-foreground p-2 shadow-primary/20">
                                <Image
                                    src="/placeholder.svg"
                                    width={500}
                                    height={300}
                                    alt="Innovative teaching methods"
                                    className="w-full h-full rounded-xl"
                                />
                                
                                {/* Static decorative element */}
                                <div className="absolute -right-6 -top-6 bg-gradient-to-br from-primary to-purple-600 p-3 rounded-full shadow-lg">
                                    <FaLightbulb className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 z-0 h-full w-full rounded-2xl bg-primary/80"></div>
                        </motion.div>
                        
                        <motion.div 
                            className="order-1 lg:order-2 flex flex-col gap-y-6 items-start"
                            variants={containerVariants}
                            initial="hidden"
                            animate={controls}
                        >
                            <motion.h2 
                                className="text-4xl md:text-5xl font-bold tracking-tight"
                                variants={itemVariants}
                            >
                                Learn at Your Own Pace
                            </motion.h2>
                            
                            <motion.p 
                                className="text-xl text-muted-foreground"
                                variants={itemVariants}
                            >
                                Our adaptive platform grows with your child, providing the perfect balance of challenge and support at every stage of development.
                            </motion.p>
                            
                            <motion.ul className="space-y-4 w-full" variants={containerVariants}>
                                {[
                                    {
                                        title: "Automated Diagnostics",
                                        description: "Intelligent assessments that identify strengths and areas for improvement"
                                    },
                                    {
                                        title: "Real-Time Adaptation",
                                        description: "Content that adjusts difficulty based on performance and engagement"
                                    },
                                    {
                                        title: "Progress Visualization",
                                        description: "Intuitive dashboards that track growth across technical and personal skills"
                                    }
                                ].map((item, index) => (
                                    <motion.li 
                                        key={index} 
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                        variants={itemVariants}
                                    >
                                        <div className="rounded-full bg-primary/10 p-1">
                                            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{item.title}</h3>
                                            <p className="text-muted-foreground">{item.description}</p>
                                        </div>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}