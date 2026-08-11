"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { ExternalLink, Folder, Github } from "lucide-react";
import { TabProjectModel, ProjectModel } from "@/types";

/** Display order for D1 project_group rows (Vercel sync categories). */
const CATEGORY_ORDER = ["Website", "Tools", "E-commerce"] as const;

interface CaseStudiesProps {
  data: TabProjectModel[];
}

function sortCategories(groups: TabProjectModel[]): TabProjectModel[] {
  return [...groups].sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(
      a.project_group_name as (typeof CATEGORY_ORDER)[number],
    );
    const indexB = CATEGORY_ORDER.indexOf(
      b.project_group_name as (typeof CATEGORY_ORDER)[number],
    );
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
  });
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

        {(project.live_url || (project.is_code && project.code_url)) && (
          <div className="flex flex-wrap gap-4 pt-2">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline underline-offset-4"
              >
                {t("live_link")}
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.is_code && project.code_url && (
              <a
                href={project.code_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline underline-offset-4"
              >
                {t("code_link")}
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export function CaseStudies({ data }: CaseStudiesProps) {
  const t = useTranslations("work");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const categories = useMemo(() => sortCategories(data), [data]);

  const defaultCategoryId = useMemo(() => {
    const website = categories.find(
      (group) =>
        group.project_group_code === "WEB" ||
        group.project_group_name === "Website",
    );
    return website?.project_group_id ?? categories[0]?.project_group_id;
  }, [categories]);

  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(
    undefined,
  );

  const resolvedCategoryId = activeCategoryId ?? defaultCategoryId;

  const activeProjects = useMemo(() => {
    const group = categories.find(
      (item) => item.project_group_id === resolvedCategoryId,
    );
    return group?.projects ?? [];
  }, [categories, resolvedCategoryId]);

  const totalProjects = useMemo(
    () => categories.reduce((sum, group) => sum + (group.projects?.length ?? 0), 0),
    [categories],
  );

  return (
    <section id="work" className="py-24 bg-card/30" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
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

        {totalProjects === 0 ? (
          <p className="text-center text-muted-foreground">{t("empty")}</p>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
              role="tablist"
              aria-label={t("categories_label")}
            >
              {categories.map((category) => {
                const count = category.projects?.length ?? 0;
                const isActive = category.project_group_id === resolvedCategoryId;

                return (
                  <button
                    key={category.project_group_id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategoryId(category.project_group_id)}
                    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                      isActive
                        ? "gradient-bg text-foreground"
                        : "bg-card border border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
                    }`}
                  >
                    {category.project_group_name}
                    <span className="ml-2 text-xs opacity-80">({count})</span>
                  </button>
                );
              })}
            </motion.div>

            {activeProjects.length === 0 ? (
              <p className="text-center text-muted-foreground">{t("empty_category")}</p>
            ) : (
              <div className="grid lg:grid-cols-2 gap-8">
                {activeProjects.map((project, index) => (
                  <CaseStudyCard
                    key={project.project_id}
                    project={project}
                    index={index}
                    isInView={isInView}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
