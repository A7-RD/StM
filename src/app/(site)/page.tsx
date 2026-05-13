import { sanityFetch } from "@/sanity/lib/live"
import { getMenuItems } from "@/lib/menuItems"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Spacer from "@/components/spacer"
import FoodGallery from "@/components/foodGallery"
import MenuTabs from "@/components/menuTabs"
import MenuFooter from "@/components/menuFooter"
import ImageGallery from "@/components/imageGallery"
import PianoLiveSection from "@/components/pianoLiveSection"
import Footer from "@/components/footer"

const PAGE_QUERY = `{
  "header": *[_type == "header"][0],
  "hero": *[_type == "hero"][0],
  "foodGallery": *[_type == "foodGallery"][0],
  "imageGallery": *[_type == "gallery"][0],
  "menus": *[_type == "menus"][0],
  "footer": *[_type == "footer"][0] {
    ...,
    "hours": coalesce(hours, *[_type == "header"][0].hours)
  },
  "wineMenu": *[_type == "wineMenu"][0]{ "fileUrl": menu.asset->url }
}`

export const revalidate = 300

export default async function Home() {
  const [{ data }, dinnerItems] = await Promise.all([
    sanityFetch({ query: PAGE_QUERY }),
    getMenuItems("Dinner Menu"),
  ])

  const wineFileUrl = data?.wineMenu?.fileUrl
  const wineMenuPdfSrc =
    wineFileUrl != null
      ? `/api/wine-menu-pdf?url=${encodeURIComponent(wineFileUrl)}`
      : undefined

  return (
    <main>
      <Header data={data?.header} footerData={data?.footer} />
      <Hero data={data?.hero} />
      <Spacer h={250} />
      <FoodGallery data={data?.foodGallery} />
      <Spacer h={125} />
      <MenuTabs
        data={data?.menus}
        dinnerItems={dinnerItems}
        wineMenuUrl={wineMenuPdfSrc}
      />
      <MenuFooter warning={data?.menus?.warning} />
      <Spacer h={300} />
      <ImageGallery data={data?.imageGallery} />
      <Spacer h={120} hMobile={80} />
      <PianoLiveSection />
      <Spacer h={120} hMobile={80} />
      <Footer data={data?.footer} />
    </main>
  )
}
