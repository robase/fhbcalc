import { Files } from "react-bootstrap-icons";

export default function CopyResultsButton({
  linkText,
  setLinkText,
  handleCopyLink,
}: {
  linkText: string;
  setLinkText: (text: string) => void;
  handleCopyLink: () => void;
}) {
  return (
    <button
      onClick={() => {
        handleCopyLink();
        setLinkText("link copied!");
        setTimeout(() => {
          setLinkText("copy results link");
        }, 2000);
      }}
      className="
      hover:bg-zinc-200 active:bg-zinc-300
      px-4 py-2 bg-white border border-zinc-400
      uppercase text-sm w-52 text-zinc-700 flex flex-row gap-2 justify-between font-sans items-center cursor-pointer whitespace-nowrap"
    >
      <div>{linkText}</div>
      <Files size="18px" className="fill-zinc-500" />
    </button>
  );
}
