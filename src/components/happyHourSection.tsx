"use client"

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react"

import { happyHourDrinks, happyHourFood } from "@/data/happyHourMenu"
import { cn } from "@/lib/utils"

/** Stagger steps for top-to-bottom happy hour fade (matches design sequence). */
const SAL = {
  foodHeader: 0,
  plates: 1,
  specials: 2,
  drinkHeaders: 3,
  drinkRow: (index: number) => 4 + index,
} as const

const LAST_DRINK_ROW =
  Math.max(
    happyHourDrinks.wine.items.length,
    happyHourDrinks.cocktails.items.length,
    happyHourDrinks.beer.items.length,
  ) - 1

const drinkItemClass = "ds-text block leading-none text-ink"

function HappyHourLine({
  as: Tag = "div",
  children,
  className,
  salOrder,
}: {
  as?: ElementType
  children: ReactNode
  className?: string
  salOrder: number
}) {
  return (
    <Tag
      className={cn("fade--in", className)}
      style={{ "--sal-order": salOrder } as CSSProperties}
    >
      {children}
    </Tag>
  )
}

function HappyHourHeading({
  children,
  className,
  salOrder,
}: {
  children: ReactNode
  className?: string
  salOrder: number
}) {
  return (
    <HappyHourLine as="h3" salOrder={salOrder} className={cn("ds-subhead m-0 text-ink", className)}>
      {children}
    </HappyHourLine>
  )
}

function HappyHourDrinkList({
  header,
  items,
  listClassName,
  itemClassName,
}: {
  header: string
  items: readonly string[]
  listClassName?: string
  itemClassName?: string
}) {
  return (
    <>
      <HappyHourHeading salOrder={SAL.drinkHeaders}>{header}</HappyHourHeading>
      <ul className={cn("m-0 flex w-full list-none flex-col gap-1 p-0", listClassName)}>
        {items.map((item, index) => (
          <li key={item}>
            <HappyHourLine
              as="span"
              salOrder={SAL.drinkRow(index)}
              className={cn(drinkItemClass, itemClassName)}
            >
              {item}
            </HappyHourLine>
          </li>
        ))}
      </ul>
    </>
  )
}

type HappyHourSectionProps = {
  isActive?: boolean
}

export default function HappyHourSection({ isActive = false }: HappyHourSectionProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const menu = menuRef.current
    if (!menu || !isActive) {
      menu?.classList.remove("sal-animate")
      return
    }

    menu.classList.remove("sal-animate")

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          menu.classList.add("sal-animate")
          observer.disconnect()
        }
      },
      { threshold: 0.2, rootMargin: "0px" },
    )

    observer.observe(menu)
    return () => observer.disconnect()
  }, [isActive])

  return (
    <section
      id="happy-hour"
      className="flex justify-center px-8 pt-12 max-md:px-6 max-md:pt-8"
    >
      <div
        ref={menuRef}
        className="happy-hour-menu flex w-full max-w-[878px] flex-col gap-4 max-md:items-center max-md:gap-6 max-md:text-center"
      >
        <div className="flex flex-col items-center gap-4 max-md:gap-2">
          <HappyHourHeading salOrder={SAL.foodHeader} className="text-center">
            {happyHourFood.header}
          </HappyHourHeading>

          <HappyHourLine
            as="ul"
            salOrder={SAL.plates}
            className="m-0 flex list-none flex-wrap items-center justify-center gap-2 p-0 max-md:flex-col max-md:gap-1"
          >
            {happyHourFood.plates.map((item) => (
              <li key={item} className="ds-text leading-none text-ink">
                {item}
              </li>
            ))}
          </HappyHourLine>

          <HappyHourLine
            salOrder={SAL.specials}
            className="flex w-full items-start gap-4 max-md:flex-col max-md:items-center max-md:gap-1"
          >
            {happyHourFood.specials.map((item) => (
              <p
                key={item}
                className="ds-text m-0 flex-1 text-center leading-none text-ink"
              >
                {item}
              </p>
            ))}
          </HappyHourLine>
        </div>

        <div className="flex w-full items-start justify-between gap-8 max-md:contents">
          <div className="flex flex-col items-start gap-2 max-md:order-4 max-md:items-center">
            <HappyHourDrinkList
              header={happyHourDrinks.wine.header}
              items={happyHourDrinks.wine.items}
              listClassName="max-md:items-center"
            />
          </div>

          <div className="flex flex-col items-start gap-2 max-md:order-2 max-md:items-center">
            <HappyHourDrinkList
              header={happyHourDrinks.cocktails.header}
              items={happyHourDrinks.cocktails.items}
              listClassName="items-center"
            />
          </div>

          <div className="flex flex-col items-end gap-2 max-md:order-5 max-md:items-center">
            <HappyHourDrinkList
              header={happyHourDrinks.beer.header}
              items={happyHourDrinks.beer.items}
              listClassName="items-end max-md:items-center"
              itemClassName="max-md:text-center md:text-right"
            />
          </div>
        </div>

        <HappyHourHeading
          salOrder={SAL.drinkRow(LAST_DRINK_ROW + 1)}
          className="max-md:order-3 text-center"
        >
          {happyHourDrinks.cocktails.footer}
        </HappyHourHeading>
      </div>
    </section>
  )
}
