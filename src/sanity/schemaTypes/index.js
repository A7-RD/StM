import { header } from "./_header";
import { hero } from "./_hero";
import { foodGallery } from "./_gallery";
import { imageGallery } from "./_imageGallery";
import { menus } from "./_menus";
import { footer } from "./_footer";
import { wineMenu } from "./_wineMenu";

export const singletonTypes = new Set([
  "header",
  "hero",
  "foodGallery",
  "gallery",
  "wineMenu",
  "menus",
  "footer",
]);

export const schema = {
  types: [header, hero, foodGallery, wineMenu, menus, imageGallery, footer],
};
