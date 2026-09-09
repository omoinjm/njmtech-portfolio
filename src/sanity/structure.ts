import type { StructureResolver } from "sanity/structure";
import { SINGLETON_TYPES } from "@/sanity/schemaTypes";

/**
 * Custom desk structure: singletons (hero, founder, about content) get a
 * fixed single-document view; everything else (ecosystem divisions) lists
 * normally so multiple documents can be created.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Hero")
        .id("heroContent")
        .child(S.document().schemaType("heroContent").documentId("heroContent")),
      S.listItem()
        .title("Founder")
        .id("founder")
        .child(S.document().schemaType("founder").documentId("founder")),
      S.listItem()
        .title("About Page Content")
        .id("aboutContent")
        .child(S.document().schemaType("aboutContent").documentId("aboutContent")),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETON_TYPES.has(listItem.getId() ?? ""),
      ),
    ]);
