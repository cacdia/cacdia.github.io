interface SVGHeaderProps {
  children: React.ReactNode;
}

export default function SVGHeader({ children }: SVGHeaderProps) {
  return (
    <>
      <svg
        version="1.1"
        viewBox="0 0 960 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <g>{children}</g>
      </svg>
    </>
  );
}
