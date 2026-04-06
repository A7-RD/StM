import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

export default function MenuNav({ sections, activeId, onSelect }) {
  return (
    <>
      <MenuImages sections={sections} activeId={activeId} />
      <MenuItems sections={sections} activeId={activeId} onSelect={onSelect} />
    </>
  );
}

function MenuImages({ sections, activeId }) {
  return (
    <div className="ratio-1-1 pos-rel w-200px mb-160 mx-auto m-mb-60">
      {sections.map((s) =>
        s.image ? (
          <Image
            key={s.id}
            className={`bg-image contain${s.id === activeId ? "" : " hide"}`}
            src={urlFor(s.image).url()}
            alt={s.title ?? ""}
            width={193}
            height={176}
          />
        ) : null
      )}
    </div>
  );
}

function MenuItems({ sections, activeId, onSelect }) {
  return (
    <div className="menu-nav w-100 flex justify-center capitalize flex gap-5 m-align-center m-gap-10">
      {sections.map((s, i) => (
        <span key={s.id} className="flex gap-5">
          {i > 0 && <span className="cursor-default m-hide">/</span>}
          <button
            onClick={() => onSelect(s.id)}
            className={`menu-nav-btn${activeId === s.id ? " active" : ""}`}
          >
            {s.title}
          </button>
        </span>
      ))}
    </div>
  );
}
