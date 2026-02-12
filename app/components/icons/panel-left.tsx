export const PanelLeftIcon = ({ className = "" }: { className?: string }) => {
  return (
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 21 21"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke="#D9D9D9"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(3 3)"
      >
        <path d="m2.5.5h10c1.1045695 0 2 .8954305 2 2v10c0 1.1045695-.8954305 2-2 2h-10c-1.1045695 0-2-.8954305-2-2v-10c0-1.1045695.8954305-2 2-2z" />

        <path d="m2.5 11.5v-8" />
      </g>
    </svg>
  );
};
