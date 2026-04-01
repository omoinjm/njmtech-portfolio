import { Hero } from './Hero';
import { Newsletter } from './Newsletter';
import { Services } from './Services';
import { Skills } from './Skills';

export default function HomePage() {
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
}
