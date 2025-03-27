'use client';

import { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaChevronDown, FaQuestion } from "react-icons/fa6";
import React from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    question: "How does the adaptive learning system work?",
    answer: "Our platform uses diagnostic assessments to identify each student's strengths and areas for improvement. The system then creates a personalized learning path that adapts in real-time as the student progresses, ensuring they're always challenged but never overwhelmed."
  },
  {
    question: "Can students join at any age or skill level?",
    answer: "Yes! Our bridging modules are specifically designed to help students catch up quickly if they join at a later stage. These modules cover foundational concepts in a condensed format, allowing students to integrate seamlessly into the regular curriculum."
  },
  {
    question: "How does the platform balance tech education with personal development?",
    answer: "Our curriculum thoughtfully integrates technical skills with personal development in each lesson. For example, a coding project might include elements of teamwork and communication, or a problem-solving exercise might incorporate mindfulness techniques to approach challenges creatively."
  },
  {
    question: "What role do teachers play in this platform?",
    answer: "Teachers act as facilitators rather than lecturers. Our platform handles content delivery and basic assessments, freeing teachers to provide targeted support, answer complex questions, and guide group discussions. This approach minimizes teacher workload while maximizing their impact."
  },
  {
    question: "How can schools integrate this platform with their existing curriculum?",
    answer: "Our platform is designed to be modular and flexible. Schools can implement it as a supplementary program, integrate specific modules into their existing curriculum, or adopt it as a comprehensive solution. Our team works with schools to create a customized implementation plan."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! All our plans include a 14-day free trial with full access to features. No credit card is required to start exploring our platform."
  }
];

export default function Faq() {
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  const filteredItems = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Scroll animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  return (
    <section 
      id="faq" 
      className="section-container py-20 relative overflow-hidden"
      ref={sectionRef}
    >
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

      <div className="container mx-auto">
        <motion.div 
          className="max-w-2xl mx-auto text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div 
              className="bg-primary/10 p-3 rounded-full text-primary"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <FaQuestion className="h-6 w-6" />
            </motion.div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about our platform, curriculum, and approach.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div 
          className="max-w-lg mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 rounded-full border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <AnimatePresence>
            {filteredItems.length === 0 ? (
              <motion.div 
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-muted-foreground">No matching questions found.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item, index) => (
                  <motion.div 
                    key={index} 
                    variants={itemVariants}
                    layout
                  >
                    <Accordion 
                      type="single"
                      collapsible
                    >
                      <AccordionItem 
                        value={`item-${index}`} 
                        className={`overflow-hidden rounded-xl border bg-card transition-all duration-200 ${openItem === index ? 'border-primary shadow-lg shadow-primary/5' : 'hover:border-primary/50'}`}
                      >
                        <AccordionTrigger 
                          onClick={() => setOpenItem(openItem === index ? null : index)}
                          className="px-6 py-4 flex w-full items-center justify-between text-left"
                        >
                          <motion.h3 
                            className="text-lg font-medium"
                            layout
                          >
                            {item.question}
                          </motion.h3>
                          <motion.div
                            animate={{ rotate: openItem === index ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FaChevronDown className="h-4 w-4 text-muted-foreground" />
                          </motion.div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="text-base text-muted-foreground">{item.answer}</p>
                          </motion.div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-muted-foreground">
            Still have questions? <motion.span 
              className="font-medium text-primary cursor-pointer inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact our support team
            </motion.span>
          </p>
        </motion.div>
      </div>
    </section>
  );
} 
