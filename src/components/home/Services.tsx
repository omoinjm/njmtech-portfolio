"use client";

import { motion, useInView } from "framer-motion";
import {
  Cloud,
  Code2,
  Database,
  Palette,
  Rocket,
  Smartphone
} from "lucide-react";
import { useRef } from "react";

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description: "Building responsive, performant web applications using modern frameworks like React, Next.js, and Vue.js.",
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Creating cross-platform mobile apps with React Native and Flutter for iOS and Android.",
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    description: "Designing and deploying scalable cloud infrastructure on AWS, GCP, and Azure.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "Crafting intuitive user interfaces and seamless user experiences that delight users.",
  },
  {
    icon: Database,
    title: "Backend Development",
    description: "Building robust APIs, microservices, and database architectures for enterprise applications.",
  },
  {
    icon: Rocket,
    title: "DevOps & CI/CD",
    description: "Implementing automated pipelines, containerization, and infrastructure as code.",
  },
];

export const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-24 relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm tracking-wider uppercase">
            What I Do
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Services & <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I offer a comprehensive range of development services to help bring
            your ideas to life with cutting-edge technology.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <service.icon className="w-7 h-7 text-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:gradient-text transition-all">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-6">
            Have a project in mind? Let's discuss how I can help.
          </p>
          <a
            href="/contact"
            className="inline-flex px-8 py-4 rounded-full gradient-bg text-foreground font-semibold hover:opacity-90 transition-all hover:scale-105"
          >
            Start a Conversation
          </a>
        </motion.div>
      </div>
    </section>
  );
};
