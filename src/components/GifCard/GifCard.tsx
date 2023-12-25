import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { IGif } from "@giphy/js-types";

export type GifCardProps = {
  gif: IGif;
  isLoading: boolean;
  onIntersection: (gif: IGif) => void;
};

export const GifCard = (props: GifCardProps) => {
  const { gif, isLoading, onIntersection } = props;

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      console.log(`${gif.id} is intersecting`);
      onIntersection(gif);
    }
  }, [entry, gif, onIntersection]);

  return (
    <div ref={ref} className={`flex items-center w-full`}>
      <figure className="flex-1">
        <img
          className="w-full h-full"
          src={gif.images.original.url}
          alt={gif.alt_text}
        />
      </figure>
    </div>
  );
};
