export const happyHourFood = {
  header: "Food...$15",
  plates: ["Escargots,", "Mussels,", "Steak Tartar,", "Shrimp St. Martins"],
  specials: ["Bistro Burger...$21", "Steak Frites...$29"],
} as const

export const happyHourDrinks = {
  wine: {
    header: "Wine...$10",
    items: [
      "House Cabernet",
      "House Sauv. Blanc",
      "House Bordeaux",
      "House Chardonnay",
      "House Pinot Noir",
      "House Sparkling",
    ],
  },
  cocktails: {
    header: "H.H. Cocktails...$10",
    items: [
      "House Martini",
      "Espresso Martini +$2",
      "Aperol Spritz",
      "Old Fashioned",
      "Champagne Cocktail",
      "House Negroni",
    ],
    footer: "St.M Classics....$12",
  },
  beer: {
    header: "Beer...$6",
    items: [
      "Stella Artois",
      "Community IPA",
      "Kronenbourg 1664",
      "Negra Modelo",
      "Miller Lite",
      "Athletic Brewery",
    ],
  },
} as const
