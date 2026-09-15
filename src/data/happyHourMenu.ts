export type HappyHourItem = {
  name: string
  price?: string
}

export type HappyHourBlock = {
  header: string
  items: readonly HappyHourItem[]
  columns?: 2 | 3 | 4
  compactWrap?: boolean
}

export const happyHourMenu: readonly HappyHourBlock[] = [
  {
    header: "H.H. Cocktails",
    columns: 2,
    items: [
      { name: "Aperol Spritz", price: "$10" },
      { name: "Old Fashioned", price: "$10" },
      { name: "Champagne Cocktail", price: "$10" },
      { name: "House Negroni", price: "$10" },
      { name: "House Martini", price: "$10" },
      { name: "Espresso Martini", price: "$12" },
    ],
  },
  {
    header: "Wine...$10",
    items: [
      { name: "House Red" },
      { name: "House White" },
      { name: "House Sparkling" },
      { name: "House Rosé" },
    ],
  },
  {
    header: "Beers...$6",
    columns: 3,
    items: [
      { name: "Stella Artois" },
      { name: "Kronenbourg 1664" },
      { name: "Community IPA" },
      { name: "Negra Modelo" },
      { name: "Miller Lite" },
      { name: "Aval Blanc Cider" },
    ],
  },
  {
    header: "Food",
    compactWrap: true,
    items: [
      { name: "Escargots", price: "$15" },
      { name: "Mussels", price: "$15" },
      { name: "Steak Tartar", price: "$15" },
      { name: "Shrimp St. Martins", price: "$15" },
      { name: "Bistro Burger", price: "$21" },
      { name: "Steak Frites", price: "$29" },
    ],
  },
]

export function formatHappyHourItem({ name, price }: HappyHourItem) {
  return price ? `${name}...${price}` : name
}
