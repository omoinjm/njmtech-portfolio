import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, Folder } from "lucide-react";

const projects = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard.",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    github: "https://github.com/omoinjm",
    live: "#",
    featured: true,
  },
  {
    title: "AI Content Generator",
    description: "An intelligent content creation tool powered by GPT-4, featuring templates, tone adjustment, and SEO optimization.",
    tags: ["React", "Python", "OpenAI", "FastAPI"],
    github: "https://github.com/omoinjm",
    live: "#",
    featured: true,
  },
  {
    title: "Real-Time Dashboard",
    description: "Analytics dashboard with live data streaming, interactive charts, and customizable widgets for business insights.",
    tags: ["React", "D3.js", "WebSocket", "Node.js"],
    github: "https://github.com/omoinjm",
    live: "#",
    featured: true,
  },
  {
    title: "Task Management App",
    description: "Collaborative project management tool with Kanban boards, time tracking, and team communication features.",
    tags: ["React", "Redux", "Firebase", "Material UI"],
    github: "https://github.com/omoinjm",
    live: "#",
  },
  {
    title: "Portfolio Website",
    description: "Modern, responsive portfolio website with smooth animations and dark theme.",
    tags: ["Next.js", "Framer Motion", "Tailwind"],
    github: "https://github.com/omoinjm/njmtech-portfolio",
    live: "#",
  },
  {
    title: "Weather Application",
    description: "Beautiful weather app with location-based forecasts, interactive maps, and weather alerts.",
    tags: ["React", "OpenWeather API", "Mapbox"],
    github: "https://github.com/omoinjm",
    live: "#",
  },
];

export const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="py-24 bg-card/30" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm tracking-wider uppercase">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Here are some of my recent works. Each project represents unique
            challenges and creative solutions.
          </p>
        </motion.div>

        {/* Featured Projects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group project-card relative rounded-2xl overflow-hidden bg-card border border-border"
            >
              {/* Project Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Folder className="w-16 h-16 text-muted-foreground/30" />
                </div>
                
                {/* Overlay on Hover */}
                <div className="project-card-overlay rounded-t-2xl">
                  <div className="flex gap-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
                    >
                      <Github className="w-6 h-6" />
                    </a>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
                    >
                      <ExternalLink className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:gradient-text transition-all">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            Other Noteworthy Projects
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border hover:border-accent/30 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <Folder className="w-10 h-10 text-accent" />
                  <div className="flex gap-3">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                <h4 className="font-semibold mb-2 group-hover:gradient-text transition-all">
                  {project.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
