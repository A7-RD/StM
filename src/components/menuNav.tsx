"use client"

import Image from "next/image"

import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { urlFor } from "@/sanity/lib/image"
import { cn } from "@/lib/utils"

export type MenuSectionMeta = {
  id: string
  title?: string
  image?: unknown
}

export function MenuImages({
  sections,
  activeId,
}: {
  sections: MenuSectionMeta[]
  activeId: string
}) {
  return (
    <div className="ratio-1-1 relative mx-auto mb-40 w-[200px] max-md:mb-[60px]">
      {sections.map((s) =>
        s.image ? (
          <Image
            key={s.id}
            className={cn(
              "bg-image contain",
              s.id !== activeId && "hidden",
            )}
            src={urlFor(s.image).url()}
            alt={s.title ?? ""}
            width={193}
            height={176}
            unoptimized
          />
        ) : null,
      )}
    </div>
  )
}

export default function MenuNav({ sections }: { sections: MenuSectionMeta[] }) {
  return (
    <div className="menu-nav sticky top-6 z-[110] flex w-full flex-wrap items-center justify-center gap-5 capitalize max-md:top-[35px] max-md:gap-2.5">
      <TabsList
        variant="line"
        className="inline-flex h-auto min-h-0 flex-wrap items-center justify-center gap-5 bg-transparent p-0 text-inherit max-md:gap-2.5"
      >
        {sections.map((s, i) => (
          <span key={s.id} className="flex items-center gap-5 max-md:gap-2.5">
            {i > 0 ? (
              <span className="cursor-default" aria-hidden="true">
                /
              </span>
            ) : null}
            <TabsTrigger
              id={`menu-tab-${s.id}`}
              value={s.id}
              className={cn(
                "ds-text menu-nav-tab flex-none rounded-none border-0 bg-transparent px-0 py-0 text-ink shadow-none",
                "data-active:bg-transparent data-active:text-ink",
                "hover:text-ink dark:data-active:bg-transparent dark:data-active:text-ink",
              )}
            >
              {s.title}
            </TabsTrigger>
          </span>
        ))}
      </TabsList>
    </div>
  )
}
