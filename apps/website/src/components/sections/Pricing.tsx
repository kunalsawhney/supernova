"use client";

import { useRef, useState, useEffect } from "react";
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

  // Card hover animations
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
    },
    hover: { 
      y: -15,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3 }
    }
  };

  // Feature item animations
  const featureVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: 0.5 + i * 0.1,
        duration: 0.3 
      }
    })
  };

  // Trigger animations when in view
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
        
        {/* Animated patterns */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`pattern-${i}`}
            className="absolute h-64 w-64 opacity-5"
            style={{
              backgroundImage: "radial-gradient(circle, var(--primary) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              top: `${20 + i * 30}%`,
              left: `${i * 40}%`,
            }}
            animate={{
              opacity: [0.05, 0.1, 0.05],
              rotate: [0, 10],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
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
              whileHover={tier.popular ? {} : "hover"}
              custom={index}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              className="flex"
            >
              <Card 
                className={`flex flex-col h-full w-full relative overflow-hidden backdrop-blur-sm transition-all duration-500
                  ${tier.popular ? 'border-primary shadow-xl shadow-primary/10 z-10 scale-105' : 'border-muted hover:border-primary/50'}
                  ${hoveredCard === index && !tier.popular ? 'border-primary/50' : ''}
                `}
              >
                {tier.popular && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"
                    animate={{
                      background: [
                        "linear-gradient(to bottom right, rgba(var(--primary-rgb), 0.05), transparent, rgba(var(--secondary-rgb), 0.05))",
                        "linear-gradient(to bottom right, rgba(var(--primary-rgb), 0.1), transparent, rgba(var(--secondary-rgb), 0.1))",
                        "linear-gradient(to bottom right, rgba(var(--primary-rgb), 0.05), transparent, rgba(var(--secondary-rgb), 0.05))"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                )}
                
                {tier.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      className="flex items-center justify-center rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-medium"
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1, duration: 0.5 }}
                    >
                      <FaCrown className="mr-1 h-3 w-3" />
                      Most Popular
                    </motion.div>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4 flex items-baseline">
                    <motion.span 
                      className="text-4xl font-bold tracking-tight"
                      animate={hoveredCard === index ? { scale: 1.05 } : { scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {tier.price}
                    </motion.span>
                    {tier.name !== "School" && (
                      <span className="ml-1 text-muted-foreground">/month</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-start gap-2"
                        custom={i}
                        variants={featureVariants}
                        initial="hidden"
                        animate={hoveredCard === index ? "visible" : ""}
                      >
                        <motion.div
                          className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${tier.popular ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}
                          whileHover={{ scale: 1.2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FaCheck className="h-3 w-3" />
                        </motion.div>
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant={tier.popular ? "default" : "outline"} 
                    size="lg" 
                    className={`w-full rounded-full transition-all duration-300 ${tier.popular ? 'bg-primary hover:bg-primary/90' : 'hover:border-primary hover:text-primary'}`}
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
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 backdrop-blur-sm px-6 py-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-muted-foreground">
              All plans include a <span className="font-medium text-foreground">14-day free trial</span>. 
              No credit card required.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 