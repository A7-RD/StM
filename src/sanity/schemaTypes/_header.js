import { defineField, defineType } from "sanity";

export const header = defineType({
  name: "header",
  title: "Header",
  type: "document",
  fields: [
    defineField({
      name: "reservation",
      type: "object",
      fields: [
        defineField({ name: "button", title: "Button Text", type: "string" }),
        defineField({ name: "link", type: "url" }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Header" };
    },
  },
});
