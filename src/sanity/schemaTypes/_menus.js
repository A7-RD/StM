import { defineField, defineType } from "sanity";

export const menus = defineType({
  name: "menus",
  title: "Menus",
  type: "document",
  fields: [
    defineField({
      name: "dinner",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Name", type: "string", initialValue: "Dinner Menu" }),
        defineField({ name: "image", title: "Image / GIF", type: "image", options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: "wine",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Name", type: "string", initialValue: "Wine List" }),
        defineField({ name: "image", title: "Image / GIF", type: "image", options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: "happyHour",
      title: "Happy Hour",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Name", type: "string", initialValue: "Happy Hour" }),
        defineField({ name: "image", title: "Image / GIF", type: "image", options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: "cocktails",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Name", type: "string", initialValue: "Cocktails & Spirits" }),
        defineField({ name: "image", title: "Image / GIF", type: "image", options: { hotspot: true } }),
      ],
    }),
    defineField({
        name: "warning",
        type: "text",
    })
  ],
  preview: {
    prepare() {
      return { title: "Menus" };
    },
  },
});
