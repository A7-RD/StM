import PianoKeysGraphic from "./pianoKeysGraphic"

export default function PianoLiveSection() {
  return (
    <section
      className="mt-48 flex flex-col items-center px-10 max-md:mt-36 max-md:px-[35px]"
      aria-labelledby="piano-live-heading"
    >
      <div className="flex w-full max-w-[878px] flex-col items-center gap-8">
        <h2
          id="piano-live-heading"
          className="ds-header m-0 max-w-[656px] text-center tracking-[-0.02em]"
        >
          Live Piano, 7 Nights a Week
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
            <p className="ds-text-small m-0 normal-case opacity-40">
              Sunday & Monday:
            </p>
            <p className="ds-title m-0">Alexis Lugo</p>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center justify-start gap-1 max-md:text-center">
            <p className="ds-text-small m-0 normal-case opacity-40">
              Tuesday–Thursday | Saturday:
            </p>
            <p className="ds-title m-0">Lewis Henderson</p>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center justify-start gap-1 max-md:text-center">
            <p className="ds-text-small m-0 normal-case opacity-40">Friday:</p>
            <p className="ds-title m-0">Robert Brown</p>
          </div>
        </div>
      </div>
    </section>
  )
}
