const SAMPLE = "St. Martin's"

const TEXT_SAMPLE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."

const TEXT_STYLES = [
  { label: "Header", className: "ds-header", sample: SAMPLE },
  { label: "Subhead", className: "ds-subhead", sample: SAMPLE },
  { label: "Title", className: "ds-title", sample: SAMPLE },
  { label: "Text", className: "ds-text", sample: TEXT_SAMPLE },
  { label: "Text Small", className: "ds-text-small", sample: SAMPLE },
  { label: "Caption", className: "ds-caption", sample: SAMPLE },
] as const

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-paper p-16 text-ink">
      <section
        aria-labelledby="design-system-type-heading"
        className="mx-auto flex max-w-xl flex-col gap-8"
      >
        <h1 id="design-system-type-heading" className="ds-caption">
          Type
        </h1>
        <ul className="m-0 flex list-none flex-col gap-8 p-0">
          {TEXT_STYLES.map(({ label, className, sample }) => (
            <li key={label} className="flex flex-col gap-2">
              <span className="ds-caption text-site-accent">{label}</span>
              <p className={`m-0 ${className}`}>{sample}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
