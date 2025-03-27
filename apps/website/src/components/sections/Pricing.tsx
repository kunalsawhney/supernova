"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FaCheck, FaCrown } from "react-icons/fa6";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";

interface PricingTier {
  name: string;
  description: string;
  price: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Basic",
    description: "Perfect for individual students",
    price: "$12.99",
    features: [
      "Personalized learning path",
      "Core tech curriculum access",
      "Basic personal development modules",
      "Progress tracking",
      "Email support"
    ],
    buttonText: "Start Basic Plan"
  },
  {
    name: "Pro",
    description: "For serious learners and families",
    price: "$29.99",
    features: [
      "Everything in Basic",
      "Enhanced personalized learning",
      "Advanced curriculum access",
      "All personal development modules",
      "Bridging modules for quick advancement",
      "Priority support",
      "Parent dashboard and reports"
    ],
    popular: true,
    buttonText: "Get Pro Plan"
  },
  {
    name: "School",
    description: "For educational institutions",
    price: "Custom",
    features: [
      "Everything in Pro",
      "School-wide implementation",
      "Teacher dashboards",
      "Admin controls and reporting",
      "Custom curriculum integration",
      "API access",
      "Dedicated account manager"
    ],
    buttonText: "Contact Sales"
  }
];

export default function Pricing() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Card animations
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24,
        duration: 0.5
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
    <section id="pricing" className="section-container relative py-20 overflow-hidden" ref={ref}>
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          className="absolute h-screen w-screen bg-gradient-to-b from-background to-muted/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        
        <motion.div 
          className="absolute top-1/4 left-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.6 } : { opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 right-10 h-80 w-80 rounded-full bg-secondary/5 blur-3xl"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.6 } : { opacity: 0 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
        
        {/* Simple pattern background */}
        <div
          className="absolute h-full w-full opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle, var(--primary) 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        />
      </div>

      <div className="container mx-auto">
        <motion.div 
          className="max-w-2xl mx-auto text-center space-y-4 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          <motion.div 
            className="inline-block bg-primary/10 text-primary px-4 py-1 rounded-full mb-4 text-sm font-medium"
            variants={itemVariants}
          >
            Pricing
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            variants={itemVariants}
          >
            Simple, Transparent Pricing
          </motion.h2>
          
          <motion.p 
            className="text-xl text-muted-foreground"
            variants={itemVariants}
          >
            Choose the plan that fits your needs, whether you're an individual student, 
            a family, or a school looking for a comprehensive solution.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-20"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              custom={index}
              className="flex"
            >
              <Card 
                className={`flex flex-col h-full w-full relative overflow-hidden backdrop-blur-sm
                  ${tier.popular ? 'border-primary shadow-xl shadow-primary/10 z-10 scale-105' : 'border-muted'}
                `}
              >
                {tier.popular && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                )}
                
                {tier.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                      <FaCrown className="mr-1 h-3 w-3" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold tracking-tight">
                      {tier.price}
                    </span>
                    {tier.name !== "School" && (
                      <span className="ml-1 text-muted-foreground">/month</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li 
                        key={i} 
                        className="flex items-start gap-2"
                      >
                        <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${tier.popular ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                          <FaCheck className="h-3 w-3" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={tier.popular ? "default" : "outline"} 
                    size="lg" 
                    className={`w-full ${tier.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                  >
                    {tier.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur-sm px-6 py-3">
            <p className="text-muted-foreground">
              All plans include a <span className="font-medium text-foreground">14-day free trial</span>. 
              No credit card required.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 