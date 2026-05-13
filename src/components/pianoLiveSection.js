import PianoKeysGraphic from "./pianoKeysGraphic";

export default function PianoLiveSection() {
  return (
    <section
      className="piano-live-section flex flex-col align-center"
      aria-labelledby="piano-live-heading"
    >
      <div className="piano-live-section__inner flex flex-col align-center">
        <h2 id="piano-live-heading" className="piano-live-section__headline galipos text-center">
          Live piano, 7 nights a week
        </h2>
        <div className="piano-live-section__keys-marquee">
          <div className="piano-live-section__keys-track">
            <div className="piano-live-section__keys-cell">
              <PianoKeysGraphic />
            </div>
            <div className="piano-live-section__keys-cell">
              <PianoKeysGraphic />
            </div>
          </div>
        </div>
        <div className="piano-live-section__schedule flex space-between w-100 m-flex-col m-align-center">
          <div className="piano-live-section__slot flex flex-col align-center justify-start">
            <p className="piano-live-section__label xanh f-12 op-4">Sunday & Monday:</p>
            <p className="piano-live-section__name xanh f-14">Alexis Lugo</p>
          </div>
          <div className="piano-live-section__slot flex flex-col align-center justify-start">
            <p className="piano-live-section__label xanh f-12 op-4">
              Tuesday–Thursday | Saturday:
            </p>
            <p className="piano-live-section__name xanh f-14">Lewis Henderson</p>
          </div>
          <div className="piano-live-section__slot flex flex-col align-center justify-start">
            <p className="piano-live-section__label xanh f-12 op-4">Friday:</p>
            <p className="piano-live-section__name xanh f-14">Robert Brown</p>
          </div>
        </div>
      </div>
    </section>
  );
}
