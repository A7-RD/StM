type MenuItemRow = {
  name?: string
  price?: string
  description?: string
  section?: string
}

type MenuSectionProps = {
  id: string
  items?: MenuItemRow[]
}

export default function MenuSection({ id, items = [] }: MenuSectionProps) {
  const sections = items.reduce<Record<string, MenuItemRow[]>>((acc, item) => {
    const key = item.section || ""
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <section id={id} className="flex justify-center px-8 pt-[60px]">
      <div className="menu-section flex w-full max-w-[878px] flex-col gap-[60px]">
        {Object.entries(sections).map(([sectionName, sectionItems]) => (
          <div key={sectionName} className="flex flex-col gap-5">
            {sectionName ? (
              <h3
                className="ds-header fade--in flex justify-center pb-5 text-center capitalize max-md:pb-[15px]"
                data-sal
              >
                {sectionName}
              </h3>
            ) : null}
            {sectionItems.map((item, i) => (
              <div key={i} className="fade--in delay-100" data-sal>
                <div className="menu-item__header">
                  <span className="menu-item__name ds-title">{item.name}</span>
                  <span className="menu-item__price ds-title">{item.price}</span>
                </div>
                {item.description ? (
                  <p className="ds-text mt-0 max-w-[250px] max-md:max-w-[250px] md:max-w-none">
                    {item.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
