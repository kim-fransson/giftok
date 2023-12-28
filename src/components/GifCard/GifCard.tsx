import { IGif, IUser, ImageAllTypes } from "@giphy/js-types";
import { useState } from "react";

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
};

export const GifCard = (props: GifCardProps) => {
  const [isGifLoading, setIsGifLoading] = useState(true); // State to track loading
  const [isAvatarLoading, setIsAvatarLoading] = useState(true); // State to track loading

  const { gif } = props;
  const user = gif.user;

  return (
    <div
      className="card rounded-none w-full h-screen even:bg-primary odd:bg-secondary md:even:bg-transparent md:odd:bg-transparent
      md:h-auto md:rounded-lg md:shadow-2xl group overflow-hidden"
    >
      <figure
        className="mt-auto md:mt-0 md:h-full border-4 border-base-300 
        md:border-none"
      >
        <img
          className={`w-full h-auto md:h-full ${
            isGifLoading && "skeleton rounded-none"
          }`}
          height={gif.images.original.height}
          width={gif.images.original.width}
          src={gif.images.original.url}
          onLoad={() => setIsGifLoading(false)}
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
                <div className={`w-8 rounded ${isAvatarLoading && "skeleton"}`}>
                  <img
                    src={user.avatar_url}
                    onLoad={() => setIsAvatarLoading(false)}
                  />
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
