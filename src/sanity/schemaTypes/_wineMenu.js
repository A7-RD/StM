import { defineField, defineType } from "sanity";

export const wineMenu = defineType({
  name: "wineMenu",
  title: "Wine Menu",
  type: "document",
  fields: [
    defineField({
      name: "menu",
      type: "file",
      options: {
        accept: ".pdf",
      },
    }),
  ],
  preview: {
    prepare() {
      return { title: "Wine Menu" };
    },
  },
});
