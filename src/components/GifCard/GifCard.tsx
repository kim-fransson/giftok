import { useIntersectionObserver } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { IGif, IUser, ImageAllTypes } from "@giphy/js-types";

type User = Pick<IUser, "avatar_url" | "username" | "display_name">;
type Original = Pick<ImageAllTypes, "height" | "width" | "url">;
export type Gif = Pick<IGif, "title" | "id"> & {
  user: User;
  images: {
    original: Original;
  };
};

export type GifCardProps = {
  gif: Gif;
  onIntersection: (gif: Gif) => void;
  onLoading: (value: boolean) => void;
};

export const GifCard = (props: GifCardProps) => {
  const { gif, onIntersection, onLoading } = props;
  const user = gif.user;

  const [isLoadingGif, setIsLoadingGif] = useState(true);

  const [isLoadingUserAvatar, setIsLoadingUserAvatar] = useState(true);

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
      className="card rounded-none h-screen even:bg-primary odd:bg-secondary md:even:bg-transparent md:odd:bg-transparent
      md:h-auto md:rounded-lg md:shadow-2xl group overflow-hidden"
    >
      <figure className="mt-auto md:mt-0 md:h-full border-4 border-base-300 md:border-none">
        <img
          className={`w-full h-auto md:h-full ${
            isLoadingGif && "skeleton rounded-none"
          }`}
          height={gif.images.original.height}
          width={gif.images.original.width}
          src={gif.images.original.url}
          onLoad={() => {
            setIsLoadingGif(false);
          }}
        />
      </figure>

      <div
        className="flex justify-end flex-col gap-1 p-4 mt-auto bg-base-300
        md:opacity-0 md:mt-0 md:group-hover:block md:absolute md:bottom-4 md:left-4 md:right-4 md:bg-base-100 md:rounded-lg
        md:translate-y-10 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:transition-all"
      >
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
                {user.display_name || user.username}
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
