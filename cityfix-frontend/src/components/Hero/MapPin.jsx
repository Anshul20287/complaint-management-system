/**
 * MapPin — single animated pin on the live city map.
 */
export default function MapPin({ color, top, left, label, delay }) {
  return (
    <div
      title={label}
      className="absolute w-[14px] h-[14px] rounded-full cursor-pointer map-pin-ring"
      style={{
        top,
        left,
        background: `${color}4d`,   /* 30% opacity fill */
        border: `2px solid ${color}`,
        color,
        animationDelay: delay,
      }}
    />
  );
}
