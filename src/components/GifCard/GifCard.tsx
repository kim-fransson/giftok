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
  const user = gif.user;

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
    <div ref={ref} className={`flex flex-col gap-4 w-full`}>
      <figure className="w-full my-auto">
        <img
          className="w-full h-full"
          src={gif.images.original.url}
          alt={gif.alt_text}
        />
      </figure>

      {user && (
        <div className="flex flex-col gap-1 p-4">
          <a
            className="flex gap-2 items-center"
            href={`https://giphy.com/${user.username}/`}
            target="_blank"
          >
            <div className="avatar">
              <div className="w-8 rounded">
                <img
                  src={user.avatar_url}
                  alt={`${user.display_name} avatar`}
                />
              </div>
            </div>
            <span className="font-medium text-primary">
              {user.display_name}
            </span>
          </a>
          <span>{gif.title}</span>
        </div>
      )}
    </div>
  );
};
