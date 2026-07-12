import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  onClick?: () => void;
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ onClick, className, width = 120, height = 28 }: LogoProps) {
  return (
    <Link href="/" onClick={onClick} className={`flex-shrink-0 inline-block ${className || ""}`}>
      <Image
        src="/img/logo.svg"
        alt="Elvyn logo"
        width={100}
        height={70}
        priority
        
      />
    </Link>
  );
}
