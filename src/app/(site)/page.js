import { sanityFetch } from "@/sanity/lib/live";
import { getMenuItems } from "@/lib/sheets";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Spacer from "@/components/spacer";
import FoodGallery from "@/components/foodGallery";
import MenuTabs from "@/components/menuTabs";
import MenuFooter from "@/components/menuFooter";
import ImageGallery from "@/components/imageGallery";
import Footer from "@/components/footer";

const PAGE_QUERY = `{
  "header": *[_type == "header"][0],
  "hero": *[_type == "hero"][0],
  "foodGallery": *[_type == "foodGallery"][0],
  "imageGallery": *[_type == "gallery"][0],
  "menus": *[_type == "menus"][0],
  "footer": *[_type == "footer"][0],
  "wineMenu": *[_type == "wineMenu"][0]{ "fileUrl": menu.asset->url }
}`;

export const revalidate = 300;

export default async function Home() {
  const [{ data }, dinnerItems, /* wineItems, */ cocktailItems] = await Promise.all([
    sanityFetch({ query: PAGE_QUERY }),
    getMenuItems("Dinner Menu"),
    // getMenuItems("Wine List"),
    getMenuItems("Cocktails & Spirits"),
  ]);

  return (
    <main>
      <Header data={data?.header} />
      <Hero data={data?.hero} headerData={data?.header} />
      <Spacer className="h-250px" />
      <FoodGallery data={data?.foodGallery} />
      <Spacer className="h-125px" />
      <MenuTabs
        data={data?.menus}
        dinnerItems={dinnerItems}
        wineMenuUrl={data?.wineMenu?.fileUrl}
        cocktailItems={cocktailItems}
      />
      <MenuFooter warning={data?.menus?.warning} />
      <Spacer className="h-300px" />
      <ImageGallery data={data?.imageGallery} />
      <Spacer className="h-300px m-h-150px" />
      <Footer data={data?.footer} />
    </main>
  );
}
