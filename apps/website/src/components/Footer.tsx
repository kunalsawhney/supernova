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
        text: '123-456-7890',
    },
    {
        icon: <FaEnvelope />,
        text: 'info@metaminor.com',
    },
    {
        icon: <FaLocationPin />,
        text: '123 Main St, Anytown, USA',
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
        title: "Home",
        href: "/",
    },
    {
        id: 2,
        title: "Courses",
        href: "/courses",
    },
    {
        id: 3,
        title: "About",
        href: "/about",
    },
    {
        id: 4,
        title: "School",
        href: "/school",
    },
]

const Footer = () => {
    return (
        <div className="section-container border-t border-t-border">
            <div className="grid grid-cols-1 md:grid-cols-3 p-8">
                {/* COLUMN-1 */}
                <div className="flex flex-col items-start px-4 gap-y-4">
                    <Image src="/logo.png" alt="metaminor-logo" width={200} height={100} />
                    <h3 className='text-base font-medium'> Tech skills and personal growth, tailored from childhood to high school for lifelong success!</h3>
                    <div className='flex gap-4'>
                        {SOCIAL_LINKS.map((items, i) => (
                        <Link href={items.link} key={i} target="_blank">
                            <div className="h-12 w-12 shadow-xl rounded-full flex items-center justify-center">
                                {items.icon}
                            </div>
                        </Link>
                        ))}
                    </div>
                </div>

                {/* CONTACT US */}
                <div className="flex flex-col px-4 gap-y-4">
                    <p className="text-lg font-medium">Contact Us</p>
                    <ul className="w-full">
                        {CONTACT_US.map((item, index) => (
                            <li key={index} className='mb-5'>
                                <div className="flex items-center gap-2">
                                    {item.icon}
                                    <p className="text-base font-normal">{item.text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* COMPANY LINKS */}
                <div className="flex flex-col px-4 gap-y-4">
                    <p className="text-lg font-medium">Company</p>
                    <ul className="w-full">
                        {COMPANY_LINKS.map((item, index) => (
                            <li key={index} className='mb-5'>
                                <Link href={item.href} className="text-base font-normal mb-6 space-links">{item.title}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

            {/* All Rights Reserved */}
            <div className='py-10 md:flex items-center justify-between border-t border-t-border'>
                <h4 className='text-sm font-normal'>Metaminor 2025</h4>
                <div className="flex gap-5 justify-center md:justify-start">
                    <h4 className='text-sm font-normal'><Link href="/" target="_blank">Privacy policy</Link></h4>
                    <h4 className='text-sm font-normal'><Link href="/" target="_blank">Terms & conditions</Link></h4>
                </div>
            </div>
        </div>
    )
}

export default Footer;
