import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { IGif } from "@giphy/js-types";

export type GifCardProps = {
  gif: IGif;
  onIntersection: (gif: IGif) => void;
};

export const GifCard = (props: GifCardProps) => {
  const { gif, onIntersection } = props;
  const user = gif.user;

  const [isLoadingGif, setIsLoadingGif] = useState(true);
  const [isLoadingUserAvatar, setIsLoadingUserAvatar] = useState(true);

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      onIntersection(gif);
    }
  }, [entry, gif, onIntersection]);

  return (
    <div ref={ref} className="flex flex-col gap-4 w-full">
      {entry?.isIntersecting && (
        <img
          className={`my-auto w-full ${
            isLoadingGif && "skeleton rounded-none"
          }`}
          height={gif.images.original.height}
          width={gif.images.original.width}
          src={gif.images.original.url}
          onLoad={() => setIsLoadingGif(false)}
        />
      )}

      {user && (
        <div className="flex flex-col gap-1 p-4">
          <a
            className="flex gap-2 items-center"
            href={`https://giphy.com/${user.username}/`}
            target="_blank"
          >
            <div className="avatar">
              <div
                className={`w-8 rounded ${isLoadingUserAvatar && "skeleton"}`}
              >
                {entry?.isIntersecting && (
                  <img
                    src={user.avatar_url}
                    onLoad={() => setIsLoadingUserAvatar(false)}
                  />
                )}
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
