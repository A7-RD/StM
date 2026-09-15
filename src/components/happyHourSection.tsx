"use client"

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react"

import { formatHappyHourItem, happyHourMenu } from "@/data/happyHourMenu"
import { cn } from "@/lib/utils"

const COLUMN_CLASS = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
} as const

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
        className="happy-hour-menu flex w-full max-w-[640px] flex-col items-center gap-8 text-center"
      >
        {happyHourMenu.map((block, index) => {
          const headerOrder = index * 2
          const itemsOrder = index * 2 + 1

          return (
            <div key={block.header} className="flex w-full flex-col items-center gap-3">
              <HappyHourLine
                as="h3"
                salOrder={headerOrder}
                className={cn(
                  "ds-subhead m-0 text-ink",
                  index === 0 && "max-md:mt-8",
                )}
              >
                {block.header}
              </HappyHourLine>

              <HappyHourLine
                as="ul"
                salOrder={itemsOrder}
                className={cn(
                  "m-0 list-none gap-x-8 gap-y-2 p-0",
                  block.columns
                    ? cn("mx-auto grid w-fit justify-items-center", COLUMN_CLASS[block.columns])
                    : cn(
                        "flex flex-wrap items-center justify-center",
                        block.compactWrap && "max-w-[520px]",
                      ),
                )}
              >
                {block.items.map((item) => (
                  <li key={item.name} className="ds-text whitespace-nowrap leading-none text-ink">
                    {formatHappyHourItem(item)}
                  </li>
                ))}
              </HappyHourLine>
            </div>
          )
        })}
      </div>
    </section>
  )
}
