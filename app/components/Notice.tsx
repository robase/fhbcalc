import { useLocation } from "@remix-run/react";
import { useEffect } from "react";

export function Notice() {
  const location = useLocation();

  useEffect(() => {
    handleAds();
  }, [location.key]);

  const handleAds = () => {
    // check if script exists yet
    if (!document.getElementById("adsbygoogleaftermount")) {
      var script = document.createElement("script");
      script.id = "adsbygoogleaftermount";
      script.type = "text/javascript";
      script.async = true;
      script.crossOrigin = "anonymous";
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7123056396745025";
      document.head.appendChild(script);
    }
    // @ts-ignore
    window.adsbygoogle = window.adsbygoogle || [];
    // @ts-ignore
    window.adsbygoogle.push({});
  };

  return (
    <div
      className="flex text-center justify-center items-center lg:w-[410px] xl:w-[710px] md:w-[768px] sm:w-[640px] min-[300px]:w-[400px] lg:h-[160px] max-lg:h-[300px] min-[300px]:h-[400px]"
      key={location.key}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7123056396745025"
        data-ad-slot="7806534601"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
