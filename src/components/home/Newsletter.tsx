import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // TODO: Replace with your Mailchimp form action URL
    // You can get this from Mailchimp: Audience > Signup forms > Embedded forms
    // Look for the action URL in the form code
    
    // For now, simulate a subscription
    setTimeout(() => {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to my newsletter.",
      });
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section id="newsletter" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-6">
            <Mail className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Stay Updated</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Subscribe to My <span className="gradient-text">Newsletter</span>
          </h2>

          <p className="text-muted-foreground mb-8">
            Get the latest updates on web development, tech insights, and exclusive content 
            delivered straight to your inbox. No spam, unsubscribe anytime.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-12 bg-card border-border rounded-full"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 px-8 rounded-full gradient-bg hover:opacity-90 transition-opacity"
            >
              {isLoading ? (
                "Subscribing..."
              ) : (
                <>
                  Subscribe
                  <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            By subscribing, you agree to receive emails from me. You can unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
