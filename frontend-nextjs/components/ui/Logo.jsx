export default function Logo({ className = "w-8 h-8", fill = "currentColor", ...props }) {
  return (
    <svg
      viewBox="0 0 1000 1000"
      className={className}
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Urban Landscape Logo"
      {...props}
    >
      <polygon points="501.5,129.5 601.5,205.5 127.5,561.5 128.5,408.5" />
      <polygon points="654.5,247.5 757.5,322.5 253.5,702.5 251.5,870.5 127.5,870.5 127.5,643.5" />
      <polygon points="809.5,363.5 872.5,410.5 872.5,870.5 318.5,870.5 319.5,747.5 751.5,747.5 752.5,478.5 711.5,438.5" />
    </svg>
  );
}
