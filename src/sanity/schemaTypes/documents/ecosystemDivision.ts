import { defineField, defineType } from "sanity";

export const ecosystemDivision = defineType({
  name: "ecosystemDivision",
  title: "Ecosystem Division",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Key",
      description:
        'Stable identifier used in code (e.g. "open-studio"). Do not change after projects reference it.',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      description: "Proper noun — not translated (e.g. Open Akha Studio).",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "localeString",
    }),
    defineField({
      name: "statusLabel",
      title: "Status label",
      description: 'e.g. "In Development" or "Future Division". Leave empty if live.',
      type: "localeString",
    }),
    defineField({
      name: "url",
      title: "URL",
      description: "External link, if this division has a live site.",
      type: "url",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "key" },
  },
});
