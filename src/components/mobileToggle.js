export default function MobileToggle({ isOpen, onToggle }) {
  return (
    <button
      className={`mobile-toggle${isOpen ? " is-open" : ""}`}
      aria-label="Menu"
      onClick={onToggle}
    />
  );
}
