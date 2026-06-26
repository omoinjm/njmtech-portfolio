"use client";

import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { motion, useInView } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, Phone, Send, Twitter } from "lucide-react";
import { useRef, useState } from "react";

export const Contact = () => {
  const t = useTranslations("contact");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = (await res.json()) as { message?: string };

      if (res.ok) {
        toast({
          title: t("toast_success_title"),
          description: data.message ?? t("toast_success_desc"),
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast({
          title: t("toast_error_title"),
          description: data.message ?? t("toast_error_desc"),
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
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactItems = [
    { icon: Mail, label: t("email_label"), value: "njmalaza@outlook.com", href: "mailto:njmalaza@outlook.com" },
    { icon: Phone, label: t("phone_label"), value: "+27 (72) 432-6766", href: "tel:+27724326766" },
    { icon: MapPin, label: t("location_label"), value: "Johannesburg", href: "#" },
  ];

  return (
    <section
      id="contact"
      data-keyboard-section="contact"
      className="py-24 bg-card/30"
      ref={ref}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm tracking-wider uppercase">
            {t("label")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            {t("heading")} <span className="gradient-text">{t("heading_gradient")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("subheading")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">{t("info_heading")}</h3>
              <p className="text-muted-foreground mb-8">{t("info_desc")}</p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {contactItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center group-hover:border-accent/50 transition-colors">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium group-hover:gradient-text transition-all">
                      {item.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">{t("follow")}</p>
              <div className="flex gap-4">
                {[
                  { icon: Github, href: "https://github.com/omoinjm", label: "GitHub" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/njmalaza", label: "LinkedIn" },
                  { icon: Twitter, href: "https://twitter.com/nhlanhlamalaza_", label: "Twitter" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:border-accent/50 hover:scale-110 transition-all"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-8 rounded-2xl bg-card border border-border"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    {t("name_label")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none"
                    placeholder={t("name_placeholder")}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    {t("email_field_label")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none"
                    placeholder={t("email_placeholder")}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  {t("subject_label")}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none"
                  placeholder={t("subject_placeholder")}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  {t("message_label")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl glass-input focus:outline-none resize-none"
                  placeholder={t("message_placeholder")}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 rounded-xl gradient-bg text-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  t("submitting")
                ) : (
                  <>
                    {t("submit")}
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

