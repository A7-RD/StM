export default function ReservationButton({ data }) {
  return <a className="reservation-button button-secondary m-hide" href={data?.reservation?.link}>{data?.reservation?.button}</a>;
}
