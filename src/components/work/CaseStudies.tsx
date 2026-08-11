"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";
import { ExternalLink, Folder } from "lucide-react";
import { TabProjectModel, ProjectModel } from "@/types";

interface CaseStudiesProps {
  data: TabProjectModel[];
}

function CaseStudyCard({
  project,
  index,
  isInView,
}: {
  project: ProjectModel;
  index: number;
  isInView: boolean;
}) {
  const t = useTranslations("work");

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      <div className="h-48 md:h-56 relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
        {project.img_url ? (
          <img
            src={project.img_url}
            alt={project.project_title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Folder className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <div className="p-6 md:p-8 space-y-4">
        <div>
          <h3 className="text-xl md:text-2xl font-bold">{project.project_title}</h3>
          {project.industry && (
            <p className="text-sm text-accent font-medium mt-1">
              {t("industry")}: {project.industry}
            </p>
          )}
        </div>

        {project.challenge && (
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              {t("challenge")}
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {project.challenge}
            </p>
          </div>
        )}

        {project.solution && (
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              {t("solution")}
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {project.solution}
            </p>
          </div>
        )}

        {project.result && (
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              {t("result")}
            </h4>
            <p className="text-foreground text-sm leading-relaxed font-medium">
              {project.result}
            </p>
          </div>
        )}

        {!project.challenge && !project.solution && !project.result && (
          <p className="text-muted-foreground text-sm leading-relaxed">
            {project.project_description}
          </p>
        )}

        {project.stack_json && project.stack_json.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
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

        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline underline-offset-4 pt-2"
          >
            {t("live_link")}
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.article>
  );
}

export function CaseStudies({ data }: CaseStudiesProps) {
  const t = useTranslations("work");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const allProjects = useMemo(() => {
    return data.flatMap((group) => group.projects ?? []);
  }, [data]);

  return (
    <section id="work" className="py-24 bg-card/30" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-accent font-semibold text-sm tracking-wider uppercase">
            {t("label")}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            {t("heading")}{" "}
            <span className="gradient-text">{t("heading_gradient")}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("subheading")}</p>
        </motion.div>

        {allProjects.length === 0 ? (
          <p className="text-center text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {allProjects.map((project, index) => (
              <CaseStudyCard
                key={project.project_id}
                project={project}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
