import type { SchemaTypeDefinition } from "sanity";
import { localeString } from "./objects/localeString";
import { localeText } from "./objects/localeText";
import { localeTextList } from "./objects/localeTextList";
import { heroContent } from "./documents/heroContent";
import { founder } from "./documents/founder";
import { aboutContent } from "./documents/aboutContent";
import { ecosystemDivision } from "./documents/ecosystemDivision";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    localeString,
    localeText,
    localeTextList,
    heroContent,
    founder,
    aboutContent,
    ecosystemDivision,
  ],
};

/** Document types that should only ever have a single instance. */
export const SINGLETON_TYPES = new Set(["heroContent", "founder", "aboutContent"]);
