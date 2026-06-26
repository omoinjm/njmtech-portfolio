"use client";

import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export const Newsletter = () => {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: t("toast_required_title"),
        description: t("toast_required_desc"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (res.ok && data.success) {
        toast({
          title: t("toast_success_title"),
          description: t("toast_success_desc"),
        });
        setEmail("");
      } else {
        toast({
          title: t("toast_error_title"),
          description: data.error ?? t("toast_error_desc"),
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: t("toast_network_title"),
        description: t("toast_network_desc"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="newsletter"
      data-keyboard-section="newsletter"
      className="relative min-h-screen flex items-center py-20 overflow-hidden"
    >
      {/* Background */}

      <div className="container mx-auto px-4 relative z-10 w-full">
        {/* Two-column split: left holds content, right open for keyboard */}
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-[52%]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-6">
                <Mail className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">{t("badge")}</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t("heading")}
              </h2>

              <p className="text-muted-foreground mb-8 max-w-md">
                {t("subheading")}
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder={t("placeholder")}
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
                    t("cta_loading")
                  ) : (
                    <>
                      {t("cta")}
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground mt-4">
                {t("disclaimer")}
              </p>
            </motion.div>
          </div>

          <div className="hidden lg:block lg:w-[48%] shrink-0" />
        </div>
      </div>
    </section>
  );
};
