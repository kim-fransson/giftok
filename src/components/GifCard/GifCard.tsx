import { useIntersectionObserver, useMediaQuery } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { IGif } from "@giphy/js-types";

export type GifCardProps = {
  gif: IGif;
  onIntersection: (gif: IGif) => void;
  onLoading: (value: boolean) => void;
};

export const GifCard = (props: GifCardProps) => {
  const { gif, onIntersection, onLoading } = props;
  const user = gif.user;

  const [isLoadingGif, setIsLoadingGif] = useState(true);

  const [isLoadingUserAvatar, setIsLoadingUserAvatar] = useState(true);

  const useIntersection = useMediaQuery("only screen and (min-width : 768px)");

  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "0px",
  });

  useEffect(() => {
    onLoading(isLoadingGif);
  }, [isLoadingGif, onLoading]);

  useEffect(() => {
    if (entry?.isIntersecting) {
      onIntersection(gif);
    }
  }, [entry, gif, onIntersection]);

  return (
    <div
      ref={ref}
      className="flex flex-col gap-4 w-full md:rounded-lg md:overflow-hidden md:shadow-2xl relative group"
    >
      {(entry?.isIntersecting || useIntersection) && (
        <img
          className={`md:my-0 my-auto md:w-auto w-full ${
            isLoadingGif && "skeleton rounded-none"
          }`}
          height={gif.images.original.height}
          width={gif.images.original.width}
          src={gif.images.original.url}
          onLoad={() => {
            setIsLoadingGif(false);
          }}
        />
      )}
      <div className="flex flex-col gap-1 p-4 md:hidden group-hover:flex md:absolute md:bottom-4 md:left-4 md:right-4 md:bg-base-100 md:rounded-lg">
        {user ? (
          <>
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
          </>
        ) : (
          <span>No account, no problem! This GIF flies solo. 🤷‍♂️</span>
        )}
      </div>
    </div>
  );
};
