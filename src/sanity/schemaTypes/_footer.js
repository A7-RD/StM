import { defineField, defineType } from "sanity";
import { restaurantHoursFields } from "./_restaurantHours";

export const footer = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  fields: [
    defineField({
      name: "careers",
      type: "object",
      fields: [
        defineField({ name: "visible", type: "boolean", initialValue: true }),
        defineField({ name: "text", type: "string" }),
        defineField({ name: "link", type: "string" }),
      ],
    }),
    defineField({
      name: "press",
      type: "object",
      fields: [
        defineField({ name: "visible", type: "boolean", initialValue: true }),
        defineField({ name: "text", type: "string" }),
        defineField({ name: "link", type: "string" }),
      ],
    }),
    defineField({
      name: "phone",
      type: "object",
      fields: [
        defineField({ name: "text", type: "string" }),
        defineField({ name: "link", type: "string" }),
      ],
    }),
    defineField({
      name: "address",
      type: "object",
      fields: [
        defineField({
          name: "street",
          type: "string",
          description: "First line (e.g. street). Shown in footer and mobile menu.",
        }),
        defineField({
          name: "cityState",
          title: "City & State",
          type: "string",
          description: "Second line. Shown in footer and mobile menu.",
        }),
        defineField({
          name: "text",
          type: "string",
          description:
            "Optional single-line fallback if street/city are empty (legacy).",
        }),
        defineField({
          name: "link",
          title: "Map / directions URL",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "hours",
      title: "Restaurant Hours",
      type: "object",
      fields: restaurantHoursFields,
      description:
        "Moved from Header. Controls open/closed state and footer / mobile menu display.",
    }),
    defineField({
      name: "handle",
      type: "object",
      fields: [
        defineField({ name: "text", type: "string" }),
        defineField({ name: "link", type: "string" }),
      ],
    }),
    defineField({ name: "tagline", type: "string" }),
    defineField({ name: "image", type: "image" }),
  ],
  preview: {
    prepare() {
      return { title: "Footer" };
    },
  },
});
