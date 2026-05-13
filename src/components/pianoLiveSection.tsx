import PianoKeysGraphic from "./pianoKeysGraphic"

export default function PianoLiveSection() {
  return (
    <section
      className="flex flex-col items-center px-10 max-md:px-[35px]"
      aria-labelledby="piano-live-heading"
    >
      <div className="flex w-full max-w-[878px] flex-col items-center gap-8">
        <h2
          id="piano-live-heading"
          className="m-0 max-w-[656px] text-center font-display text-[clamp(32px,5vw,56px)] leading-[1.05] font-normal italic tracking-[-0.02em] normal-case"
        >
          Live piano, 7 nights a week
        </h2>
        <div className="piano-live-section__keys-marquee w-full">
          <div className="piano-live-section__keys-track">
            <div className="piano-live-section__keys-cell">
              <PianoKeysGraphic />
            </div>
            <div className="piano-live-section__keys-cell">
              <PianoKeysGraphic />
            </div>
          </div>
        </div>
        <div className="flex w-full max-md:flex-col max-md:items-center items-start justify-between gap-6">
          <div className="flex min-w-0 flex-1 flex-col items-center justify-start gap-2 max-md:text-center">
            <p className="m-0 font-mono text-xs leading-[1.2] normal-case opacity-40">
              Sunday & Monday:
            </p>
            <p className="m-0 font-mono text-sm leading-[1.25] tracking-[-0.01em] normal-case">
              Alexis Lugo
            </p>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center justify-start gap-2 max-md:text-center">
            <p className="m-0 font-mono text-xs leading-[1.2] normal-case opacity-40">
              Tuesday–Thursday | Saturday:
            </p>
            <p className="m-0 font-mono text-sm leading-[1.25] tracking-[-0.01em] normal-case">
              Lewis Henderson
            </p>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center justify-start gap-2 max-md:text-center">
            <p className="m-0 font-mono text-xs leading-[1.2] normal-case opacity-40">
              Friday:
            </p>
            <p className="m-0 font-mono text-sm leading-[1.25] tracking-[-0.01em] normal-case">
              Robert Brown
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
