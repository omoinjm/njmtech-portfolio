import { Hero } from "@/components/home/Hero";
import { Newsletter } from "@/components/home/Newsletter";
import { Services } from "@/components/home/Services";
import { Skills } from "@/components/home/Skills";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">

      <main>
        <Hero />
        <Skills />
        <Services />
        <Newsletter />
      </main>
    </div>
  );
};

export default Index;
