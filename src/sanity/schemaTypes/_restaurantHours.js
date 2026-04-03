import { defineField } from "sanity";

/** Shared field shape for restaurant hours (footer + legacy header migration). */
export const restaurantHoursFields = [
  defineField({
    name: "weekdays",
    title: "Sun – Thu",
    type: "object",
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({
        name: "text",
        title: "Display Text",
        type: "string",
      }),
      defineField({
        name: "open",
        title: "Opens (24h)",
        type: "number",
        description: "17 for 5pm",
      }),
      defineField({
        name: "close",
        title: "Closes (24h)",
        type: "number",
        description: "22 for 10pm",
      }),
    ],
  }),
  defineField({
    name: "weekend",
    title: "Fri & Sat",
    type: "object",
    options: { collapsible: true, collapsed: true },
    fields: [
      defineField({
        name: "text",
        title: "Display Text",
        type: "string",
      }),
      defineField({
        name: "open",
        title: "Opens (24h)",
        type: "number",
        description: "17 for 5pm",
      }),
      defineField({
        name: "close",
        title: "Closes (24h)",
        type: "number",
        description: "23 for 11pm",
      }),
    ],
  }),
];
