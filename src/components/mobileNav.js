import { sanityFetch } from "@/sanity/lib/live";
import MobileNavClient from "./mobileNavClient";

export default async function MobileNav() {
  const { data } = await sanityFetch({ query: `*[_type == "header"][0]` });
  return <MobileNavClient data={data} />;
}
