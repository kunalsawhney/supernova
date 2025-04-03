"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
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
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });


    return (
        <motion.section 
            id="features" 
            className="section-container relative overflow-hidden py-20" 
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ duration: 1 }}
        >
            {/* Background elements */}
            <Image src="/vectors/vector1.svg" alt="" width={100} height={100} className="absolute top-10 left-10 opacity-50" />
            <Image src="/vectors/vector6.svg" alt="" width={100} height={100} className="absolute top-1/2 right-0 opacity-50" />
          
            <div className="container mx-auto">
                <div 
                    className="max-w-2xl mx-auto text-center space-y-4 mb-16"
                >
                    <div 
                        className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                    >
                        What Makes Us Different
                    </div>
                    
                    <h2 
                        className="text-4xl md:text-5xl font-bold tracking-tight"
                    >
                        Innovative Learning for the Digital Age
                    </h2>
                    
                    <p 
                        className="text-xl text-muted-foreground"
                    >
                        Our unique approach combines adaptive technology with holistic development, creating a learning experience unlike any other.
                    </p>
                </div>

                <div 
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
                >
                    {FEATURES.map((feature, index) => (
                        <div key={index} className="hover:scale-105 transition-all duration-300">
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
                        </div>
                    ))}
                </div>
                
                <div className="mt-32">
                    <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
                        <div 
                            className="relative order-2 lg:order-1"
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
                        </div>
                        
                        <div 
                            className="order-1 lg:order-2 flex flex-col gap-y-6 items-start"
                        >
                            <h2 
                                className="text-4xl md:text-5xl font-bold tracking-tight"
                            >
                                Learn at Your Own Pace
                            </h2>
                            
                            <p 
                                className="text-xl text-muted-foreground"
                            >
                                Our adaptive platform grows with your child, providing the perfect balance of challenge and support at every stage of development.
                            </p>
                            
                            <ul className="space-y-4 w-full">
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
                                    <li 
                                        key={index} 
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
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
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}