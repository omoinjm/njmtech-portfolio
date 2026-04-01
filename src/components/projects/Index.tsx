"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { ExternalLink, Github, Folder } from "lucide-react";
import { TabProjectModel } from "@/types";

interface ProjectsProps {
  data: TabProjectModel[];
}

export const Projects = ({ data }: ProjectsProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Extract unique categories from the data
  const categories = useMemo(() => {
    return data.map((group) => ({
      project_group_id: group.project_group_id,
      project_group_name: group.project_group_name,
      project_group_code: group.project_group_code,
    }));
  }, [data]);

  // Find the 'Website' category ID for default selection (project_group_code: "WEB")
  const defaultCategoryId = useMemo(() => {
    const websiteCategory = categories.find(
      (cat) => cat.project_group_code === "WEB",
    );
    return websiteCategory?.project_group_id || categories[0]?.project_group_id;
  }, [categories]);

  const [activeCategory, setActiveCategory] = useState<number | undefined>(
    defaultCategoryId,
  );

  // Flatten all projects from all groups
  const allProjects = useMemo(() => {
    return data.flatMap(
      (group) =>
        group.projects?.map((project) => ({
          ...project,
          project_group_id: group.project_group_id,
        })) || [],
    );
  }, [data]);

  // Filter projects based on active category
  const filteredProjects = useMemo(() => {
    if (!activeCategory) {
      return allProjects;
    }
    return allProjects.filter(
      (project) => project.project_group_id === activeCategory,
    );
  }, [allProjects, activeCategory]);

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

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.project_group_id}
              onClick={() => setActiveCategory(category.project_group_id)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.project_group_id
                  ? "gradient-bg text-foreground"
                  : "bg-card border border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
              }`}
            >
              {category.project_group_name}
            </button>
          ))}
        </motion.div>

        {/* Featured Projects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.project_id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group project-card relative rounded-2xl overflow-hidden bg-card border border-border"
            >
              {/* Project Image */}
              <div className="h-48 relative overflow-hidden">
                {project.img_url ? (
                  <img
                    src={project.img_url}
                    alt={project.project_title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Folder className="w-16 h-16 text-muted-foreground/30" />
                  </div>
                )}

                {/* Overlay on Hover */}
                <div className="project-card-overlay absolute inset-0 rounded-t-2xl bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-4">
                    {project.is_code && project.code_url && (
                      <a
                        href={project.code_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
                      >
                        <Github className="w-6 h-6" />
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
                      >
                        <ExternalLink className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:gradient-text transition-all">
                  {project.project_title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {project.project_description}
                </p>
                {project.stack_json && project.stack_json.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.stack_json.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
