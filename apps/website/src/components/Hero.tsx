import Image from "next/image";
// import vector1 from "../../public/vectors/vector1.svg";
import Button from "@/components/ui/Button";
import { FaLightbulb } from "react-icons/fa6";
import Badge from "@/components/ui/Badge";

export default function Hero() {
    return (

        <section className="relative section-container overflow-hidden">
          {/* <div className="absolute inset-0 bg-grid-pattern opacity-5"></div> */}
          <Image src="/vectors/vector1.svg" alt="" width={75} height={75} className="absolute top-0 left-5 md:top-5 md:left-5 lg:top-10 lg:left-10 -z-10" />
          <Image src="/vectors/vector1.svg" alt="" width={50} height={50} className="absolute bottom-5 -right-5 md:bottom-5 md:-right-5 lg:bottom-20 lg:-right-5 -z-10" />
          <Image src="/vectors/vector2.svg" alt="" width={50} height={50} className="absolute top-1/2 left-1/2 md:top-1/2 md:left-1/2 lg:top-1/2 lg:left-1/2 -z-10" />
          <Image src="/vectors/vector3.svg" alt="" width={50} height={50} className="absolute top-40 right-20 md:top-40 md:right-20 lg:top-40 lg:right-20 -z-10" />
          <Image src="/vectors/vector4.svg" alt="" width={150} height={150} className="absolute bottom-5 -left-5 md:bottom-5 md:left-5 lg:bottom-20 lg:left-10 -z-10" />
          <div className="container grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <h1 className="text-6xl font-bold leading-tight mb-6">
                {/* Inspiring Young <span className="text-primary">Tech Innovators</span> */}
                Ignite the 
                  <span>
                    &nbsp;Future
                    <span>
                      <Image src="/vectors/vector5.svg" alt="" width={360} height={360} className="absolute top-8 left-48 md:top-16 md:left-56 lg:top-40 lg:left-72 -z-10" />
                    </span>
                  </span> 
                  <br/> 
                of Innovation
              </h1>
              <p className="section-subtitle">
                Empowering K-12 students with cutting-edge technology courses designed to spark creativity, critical
                thinking, and prepare them for the digital future.
              </p>
              {/* <div className="flex flex-row gap-3">
                <Badge>Personalized learning paths</Badge>
                <Badge>Technical and emotional growth</Badge>
                <Badge>Age-appropriate curriculum evolution</Badge>
              </div> */}
              <div className="flex flex-row gap-3">
                <Button text="Get Started" href="/signup" />
                <Button text="Watch Demo" href="/demo" className="!bg-button-secondary hover:!shadow-button-secondary"/>
              </div>
            </div>
            <div className="relative mx-auto max-w-[500px]">
              <div className="relative z-10 rounded-2xl border border-border bg-background-primary p-2 shadow-xl shadow-background-secondary">
                <Image
                  src="/hero.png"
                  width={600}
                  height={600}
                  alt="Interactive learning platform"
                  className="rounded-xl"
                />
                <div className="absolute -right-4 -top-4 rounded-full bg-accent p-3 shadow-lg">
                  <FaLightbulb className="h-10 w-10" />
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 z-0 h-full w-full rounded-2xl bg-background-secondary"></div>
            </div>
          </div>
        </section>
    );
}
