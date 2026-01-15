import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const skills = [
  { name: "React / Next.js / Angular", level: 95 },
  { name: "TypeScript", level: 90 },
  { name: "C# / .NET", level: 88 },
  { name: "Python", level: 85 },
  { name: "PostgreSQL / MongoDB", level: 82 },
  { name: "Azure / Cloud", level: 80 },
  { name: "Docker / DevOps", level: 78 },
  { name: "GraphQL", level: 75 },
];

const technologies = [
  "React", "Next.js", "TypeScript", "C#", "Python", "PostgreSQL",
  "MongoDB", "Azure", "Docker", "Kubernetes", "GraphQL", "REST APIs",
  "Postman", "Vim", "Git", "CI/CD"
];

export const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-24 relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-accent/10 blur-3xl" />
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
            My Expertise
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I've worked with a wide range of technologies in the web development
            world, from front-end frameworks to back-end systems and cloud infrastructure.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Skill Bars */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold mb-6">Core Competencies</h3>
            {skills.map((skill, index) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${skill.level}%` } : {}}
                    transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                    className="h-full rounded-full gradient-bg"
                  />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Technology Tags */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-6">Technologies I Work With</h3>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className="px-4 py-2 rounded-full bg-card border border-border hover:border-accent/50 transition-colors cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </div>

            {/* Experience Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {[
                { title: "Frontend", desc: "React, Next.js, Angular, TypeScript" },
                { title: "Backend", desc: "C#, Python, REST/GraphQL, Unit Testing (NUnit)" },
                { title: "Database", desc: "Microsoft SQL Server, PostgreSQL, MongoDB, Redis" },
                { title: "DevOps", desc: "Azure, Docker, Kubernetes, CI/CD, Bash & PowerShell Scripting" },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  className="p-4 rounded-xl bg-card border border-border hover:border-accent/30 transition-colors"
                >
                  <h4 className="font-semibold gradient-text">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
