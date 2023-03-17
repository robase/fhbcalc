export default function Pill({
  text,
  status,
  url,
  reason,
  onClick,
}: {
  text: string
  status: "R" | "A" | "G"
  url?: string
  reason?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
}) {
  return (
    <div
      // href={url}
      // rel="noreferrer"
      // target="_blank"
      title={reason}
      onClick={onClick}
    >
      <p
        className={`${
          status === "R"
            ? "text-zinc-400 border-zinc-400"
            : status === "A"
            ? "border-yellow-600 text-yellow-600"
            : "border-green-600 text-green-600"
        } border-2  font-roboto font-bold border-opacity-60 rounded-full text-xs px-2 py-1 w-min cursor-pointer hover:bg-white`}
      >
        {text}
      </p>
    </div>
  )
}
