import { defineField, defineType } from "sanity";

export const founder = defineType({
  name: "founder",
  title: "Founder",
  type: "document",
  fields: [
    defineField({
      name: "bio",
      title: "Founder bio",
      type: "localeText",
    }),
    defineField({
      name: "extendedRole",
      title: "Extended role (Open Akha Studio)",
      description:
        "Second paragraph on the About page — the founder's role at Open Akha Studio.",
      type: "localeText",
    }),
  ],
  preview: {
    select: { title: "bio.en" },
  },
});
