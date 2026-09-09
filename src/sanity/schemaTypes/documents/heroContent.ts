import { defineField, defineType } from "sanity";

export const heroContent = defineType({
  name: "heroContent",
  title: "Hero",
  type: "document",
  fields: [
    defineField({
      name: "welcomeBadge",
      title: "Welcome badge",
      description: 'Small status pill, e.g. "Johannesburg · Taking new clients"',
      type: "localeString",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "localeString",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "localeText",
    }),
  ],
  preview: {
    select: { title: "headline.en" },
  },
});
