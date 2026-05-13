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

type MenuNavProps = {
  sections: MenuSectionMeta[]
  activeId: string
}

export default function MenuNav({ sections, activeId }: MenuNavProps) {
  return (
    <>
      <MenuImages sections={sections} activeId={activeId} />
      <MenuItems sections={sections} />
    </>
  )
}

function MenuImages({
  sections,
  activeId,
}: {
  sections: MenuSectionMeta[]
  activeId: string
}) {
  return (
    <div className="relative mx-auto mb-40 aspect-square w-[200px] max-md:mb-[60px]">
      {sections.map((s) =>
        s.image ? (
          <Image
            key={s.id}
            className={cn(
              "absolute inset-0 size-full object-contain mix-blend-multiply",
              s.id !== activeId && "hidden",
            )}
            src={urlFor(s.image).url()}
            alt={s.title ?? ""}
            width={193}
            height={176}
          />
        ) : null,
      )}
    </div>
  )
}

function MenuItems({ sections }: { sections: MenuSectionMeta[] }) {
  return (
    <div className="menu-nav sticky top-6 z-[110] flex w-full flex-wrap items-center justify-center gap-5 capitalize max-md:top-[35px] max-md:gap-2.5">
      <TabsList
        variant="line"
        className="inline-flex h-auto min-h-0 flex-wrap items-center justify-center gap-5 bg-transparent p-0 text-inherit max-md:gap-2.5"
      >
        {sections.map((s, i) => (
          <TabsTrigger
            key={s.id}
            value={s.id}
            className={cn(
              "relative rounded-none border-0 bg-transparent px-0 py-0 text-base font-normal tracking-[-0.01em] text-ink shadow-none",
              "after:bottom-[-1px] after:h-px after:bg-ink data-active:bg-transparent data-active:text-ink",
              "hover:text-ink dark:data-active:bg-transparent dark:data-active:text-ink",
              "max-md:before:hidden",
              i > 0 &&
                "before:mr-5 before:inline before:font-normal before:text-ink before:content-['/'] max-md:before:hidden",
            )}
          >
            {s.title}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  )
}
