import { Files } from "react-bootstrap-icons"

export default function CopyResultsButton({
  linkText,
  setLinkText,
  handleCopyLink,
}: {
  linkText: string
  setLinkText: (text: string) => void
  handleCopyLink: () => void
}) {
  return (
    <button
      onClick={() => {
        handleCopyLink()
        setLinkText("link copied!")
        setTimeout(() => {
          setLinkText("copy results link")
        }, 2000)
      }}
      // animate-border from-pink-300 via-sky-200 to-pink-300 bg-[length:400%_400%] [animation-duration:_4s] hover:bg-gradient-to-br
      className="
      hover:bg-zinc-200 active:bg-zinc-300 rounded-md
      px-4 py-2 bg-zinc-50 border border-zinc-400
      font-semibold font-spartan uppercase text-zinc-700 flex flex-row gap-2 items-center cursor-pointer whitespace-nowrap"
    >
      <span>{linkText}</span> <Files size="18px" className="fill-zinc-500" />
    </button>
  )
}
