export default function ReservationButton({ data }) {
  return (
    <a
      className="reservation-button button-secondary reservation-button--masthead"
      href={data?.reservation?.link}
    >
      {data?.reservation?.button}
    </a>
  );
}
