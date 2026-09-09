import { defineField, defineType } from "sanity";

export const aboutContent = defineType({
  name: "aboutContent",
  title: "About Page Content",
  type: "document",
  fields: [
    defineField({
      name: "companyParagraphs",
      title: "Company paragraphs",
      description: "Intro paragraphs shown at the top of the About page.",
      type: "localeTextList",
    }),
    defineField({
      name: "values",
      title: "How we work (values)",
      type: "localeTextList",
    }),
    defineField({
      name: "clientIndustries",
      title: "Industries we serve",
      type: "localeTextList",
    }),
  ],
  preview: {
    prepare: () => ({ title: "About page content" }),
  },
});
