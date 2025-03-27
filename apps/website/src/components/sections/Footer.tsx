import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin, FaPhone, FaEnvelope, FaLocationPin } from "react-icons/fa6";

interface COMPANY_LINKS {
    id: number;
    title: string;
    href: string;
}

interface SOCIAL_LINKS {
    icon: React.ReactNode;
    link: string;
}

interface CONTACT_US {
    icon: React.ReactNode;
    text: string;
}

const CONTACT_US: CONTACT_US[] = [
    {
        icon: <FaPhone />,
        text: '(800) 123-4567',
    },
    {
        icon: <FaEnvelope />,
        text: 'info@metaminor.com',
    },
    {
        icon: <FaLocationPin />,
        text: '123 Innovation Way, San Francisco, CA',
    },
]

const SOCIAL_LINKS: SOCIAL_LINKS[] = [
    {
        icon: <FaFacebookF />,
        link: 'https://www.facebook.com',
    },
    {
        icon: <FaInstagram />,
        link: 'https://www.instagram.com',
    },
    {
        icon: <FaTwitter />,
        link: 'https://www.twitter.com',
    },
    {
        icon: <FaLinkedin />,
        link: 'https://www.linkedin.com',
    },
]

const COMPANY_LINKS: COMPANY_LINKS[] = [
    {
        id: 1,
        title: "About Us",
        href: "/about",
    },
    {
        id: 2,
        title: "For Schools",
        href: "/schools",
    },
    {
        id: 3,
        title: "Careers",
        href: "/careers",
    },
    {
        id: 4,
        title: "Blog",
        href: "/blog",
    },
]

const RESOURCE_LINKS: COMPANY_LINKS[] = [
    {
        id: 1,
        title: "Help Center",
        href: "/help",
    },
    {
        id: 2,
        title: "Demo Videos",
        href: "/demos",
    },
    {
        id: 3,
        title: "Curriculum Guide",
        href: "/curriculum-guide",
    },
    {
        id: 4,
        title: "For Parents",
        href: "/parents",
    },
]

const Footer = () => {
    return (
        <div className="section-container border-t border-t-border">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
                {/* COLUMN-1 */}
                <div className="flex flex-col items-start gap-y-6">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.png" alt="MetaMinor" width={200} height={200} />
                    </Link>
                    <p className="text-base text-muted-foreground"> 
                        Revolutionizing K-12 education with a holistic platform 
                        that combines technical expertise with personal growth.
                    </p>
                    <div className="flex gap-4">
                        {SOCIAL_LINKS.map((items, i) => (
                        <Link href={items.link} key={i} target="_blank">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                                {items.icon}
                            </div>
                        </Link>
                        ))}
                    </div>
                </div>

                {/* COMPANY LINKS */}
                <div className="flex flex-col gap-y-4">
                    <p className="text-lg font-semibold">Company</p>
                    <ul className="space-y-3">
                        {COMPANY_LINKS.map((item, index) => (
                            <li key={index}>
                                <Link 
                                    href={item.href} 
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* RESOURCES LINKS */}
                <div className="flex flex-col gap-y-4">
                    <p className="text-lg font-semibold">Resources</p>
                    <ul className="space-y-3">
                        {RESOURCE_LINKS.map((item, index) => (
                            <li key={index}>
                                <Link 
                                    href={item.href} 
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CONTACT US */}
                <div className="flex flex-col gap-y-4">
                    <p className="text-lg font-semibold">Contact</p>
                    <ul className="space-y-3">
                        {CONTACT_US.map((item, index) => (
                            <li key={index}>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <span className="text-primary">{item.icon}</span>
                                    <p>{item.text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* All Rights Reserved */}
            <div className="py-8 border-t border-t-border">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} MetaMinor. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer;
