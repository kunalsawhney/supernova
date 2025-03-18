// components/Button.tsx
import { FaArrowRight } from "react-icons/fa6";
import Link from "next/link";
import clsx from "clsx";

interface ButtonProps {
  text: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, href, onClick, className }) => {
  const buttonContent = (
    <div
      className={clsx(
        "bg-primary text-xl",
        "rounded-xl transition-all",
        "hover:shadow-lg hover:shadow-primary hover:text-white",
        className
      )}
    >
      <span className="flex items-center justify-between p-4 gap-4">
        <span className="font-semibold">{text}</span>
          <FaArrowRight 
            size={16}
            className="-rotate-45 transform w-6 h-6 " 
          />
      </span>
    </div>
  );

  return href ? (
    <Link href={href} className="inline-block">
      {buttonContent}
    </Link>
  ) : (
    <button onClick={onClick} className="inline-flex">
      {buttonContent}
    </button>
  );
};

export default Button;
