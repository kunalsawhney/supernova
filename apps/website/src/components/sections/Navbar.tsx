'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationItem {
    name: string;
    href: string;
    current: boolean;
}

const navigation: NavigationItem[] = [
    { name: 'Features', href: '#features', current: true },
    { name: 'Curriculum', href: '#curriculum', current: false },
    { name: 'Pricing', href: '#pricing', current: false },
    { name: 'For Schools', href: '#for-schools', current: false },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const CustomLink = ({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) => {
    return (
        <Link href={href} passHref>
            <span
                onClick={onClick}
                className="px-3 py-4 text-lg font-normal"
            >
                {children}
            </span>
        </Link>
    );
};


const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    const [currentLink, setCurrentLink] = useState('/');

    // Prevent body scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleLinkClick = (href: string) => {
        setCurrentLink(href);
        setIsOpen(false);
    };

    return (
        <div className="bg-background-primary">
            <>
                <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
                    <div className="relative flex h-12 md:h-20 items-center justify-between">
                        <div className="flex flex-1 items-center sm:items-stretch sm:justify-start">

                            {/* LOGO */}

                            <div className="flex flex-shrink-0 items-center">
                                <Image
                                    className="h-full w-full"
                                    src={'/logo.png'}
                                    alt="metaminor-logo"
                                    width={200}
                                    height={100}
                                />
                            </div>

                            {/* LINKS */}

                            <div className="hidden lg:block m-auto">
                                <div className="flex space-x-4">
                                    {navigation.map((item) => (
                                        <CustomLink
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => handleLinkClick(item.href)}
                                        >
                                            <span
                                                className={classNames(
                                                    item.href === currentLink ? 'underline-links' : 'text-slategray',
                                                    'px-3 py-4 text-lg font-normal opacity-75 hover:opacity-100'
                                                )}
                                                aria-current={item.href ? 'page' : undefined}
                                            >
                                                {item.name}
                                            </span>
                                        </CustomLink>
                                    ))}
                                </div>
                            </div>

                            <div className="hidden lg:flex items-center gap-4">
                                <Button variant="ghost" size="xl">
                                    Dashboard
                                    <FaArrowRight className='-rotate-45' />
                                </Button>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="lg:hidden flex items-center z-20">
                            <button 
                                onClick={() => setIsOpen(!isOpen)} 
                                className="inline-flex items-center justify-center p-2 rounded-md text-foreground"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {!isOpen ? (
                                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {isOpen && (
                        <>
                            {/* Backdrop overlay */}
                            <motion.div
                                className="fixed inset-0 z-10 bg-background/80 backdrop-blur-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => setIsOpen(false)}
                            />
                            
                            {/* Menu panel */}
                            <motion.div 
                                className="lg:hidden fixed inset-y-0 right-0 z-20 w-full max-w-xs flex flex-col pt-16 bg-background border-l border-border shadow-xl"
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                <div className="w-full h-full flex flex-col p-6 space-y-6">
                                    <nav className="flex flex-col space-y-4">
                                        {navigation.map((item) => (
                                            <Link 
                                                key={item.name} 
                                                href={item.href}
                                                onClick={() => handleLinkClick(item.href)}
                                                className={classNames(
                                                    item.href === currentLink ? 'text-primary font-medium' : 'text-foreground',
                                                    'px-3 py-2 text-xl'
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </nav>
                                    <div className="mt-auto">
                                        <Button className="w-full" size="xl">
                                            Dashboard
                                            <FaArrowRight className='-rotate-45 ml-2' />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </>
        </div>
    );
};

export default Navbar;
