import { defineField, defineType } from "sanity";

/** A localized list of short text entries — used for paragraphs, values, industries. */
export const localeTextList = defineType({
  name: "localeTextList",
  title: "Localized list",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "zu",
      title: "isiZulu",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});
