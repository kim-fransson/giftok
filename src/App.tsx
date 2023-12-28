import { GifsResult } from "@giphy/js-fetch-api";
import { useEffect, useRef, useState } from "react";
import { Gif, GifCard } from "./components/GifCard/GifCard";
import { useMediaQuery } from "@uidotdev/usehooks";
import Logo from "./assets/logo.svg?react";
import { twMerge } from "tailwind-merge";

const GIFS_LIMIT = 20;
const INFINITY_SCROLL_THRESHOLD = 0.8;

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [allGifs, setAllGifs] = useState<Gif[]>([]);
  const [offset, setOffset] = useState(0);
  const [lastElement, setLastElement] = useState<HTMLElement | null>(null);
  const [hasError, setHasError] = useState(false);
  const [totalNumberOfGifs, setTotalNumberOfGifs] = useState(0);

  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const isMediumDevice = useMediaQuery(
    "only screen and (min-width : 768px) and (max-width : 1024px)",
  );

  const observer = useRef(
    new IntersectionObserver((entries) => {
      const last = entries[0]; // only the last element in the entries array
      if (last.isIntersecting) {
        setOffset((current) => current + GIFS_LIMIT);
      }
    }),
  );

  const fetchGifs = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const res = await fetch(
        `/api/gifs/trending?limit=${GIFS_LIMIT}&offset=${offset}`,
      );
      const gifsResult = (await res.json()) as GifsResult;

      const seenIds = new Set([...allGifs].map((gif) => gif.id));
      const uniqueGifs = [...allGifs];

      gifsResult.data.forEach((gif) => {
        if (!seenIds.has(gif.id)) {
          seenIds.add(gif.id);
          uniqueGifs.push(gif);
        }
      });

      setAllGifs(uniqueGifs);
      setTotalNumberOfGifs(gifsResult.pagination.total_count);
    } catch (error) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGifs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastElement]);

  const numberOfColumns = isSmallDevice ? 1 : isMediumDevice ? 2 : 4;
  const totalItems = allGifs.length;
  let counter = 0;
  let refSet = false;

  return (
    <div className="app-grid">
      <div className="navbar bg-base-100 shadow-2xl fixed z-50 opacity-90 gap-4 pr-8">
        <Logo />
        <div className="ml-auto flex md:gap-8 gap-2">
          <div className="flex items-center gap-2">
            <span className="select-none rounded-lg px-2 py-1 bg-giphy md:inline-block hidden">
              Powered by
            </span>
            <a
              className={twMerge(
                "md:bg-transparent bg-accent px-2 py-1 md:px-0 md:py-0 rounded-lg md:rounded-none",
              )}
              href="https://giphy.com/"
              target="_blank"
              title="GIPHY"
            >
              Giphy
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="select-none rounded-lg bg-[#672871] px-2 py-1 text-gray-100 md:inline-block hidden">
              Designs from
            </span>
            <a
              className="bg-[#672871] md:bg-transparent px-2 py-1 md:px-0 md:py-0 rounded-lg md:rounded-none"
              href="https://bigdevsoon.me/"
              target="_blank"
              title="BigDevSoon"
            >
              BigDevSoon.me
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl md:pt-24 flex-1 md:mx-auto md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-4">
        {splitIntoColumns(allGifs, numberOfColumns).map(
          (column, columnIndex) => {
            return (
              <div key={columnIndex} className="grid md:gap-4">
                {column.map((gif) => {
                  const shouldSetRef =
                    !refSet &&
                    counter++ / totalItems >= INFINITY_SCROLL_THRESHOLD;
                  return (
                    <div
                      key={gif.id}
                      ref={(element) => {
                        if (shouldSetRef) {
                          setLastElement(element);
                          refSet = true;
                        }
                      }}
                      className="flex w-full"
                    >
                      <GifCard gif={gif} />
                    </div>
                  );
                })}
              </div>
            );
          },
        )}
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : hasError ? (
        <div className="flex flex-col gap-4 items-center justify-center py-8">
          <span className="text-error md:text-2xl text-lg font-medium">
            Failed to fetch gifs, try again?
          </span>
          <button
            onClick={() => fetchGifs()}
            className="btn md:btn-lg btn-sm btn-primary"
          >
            Try again
          </button>
        </div>
      ) : (
        allGifs.length === totalNumberOfGifs && (
          <div className="flex flex-col gap-4 items-center justify-center py-8">
            <span className="text-info md:text-2xl text-lg font-medium ">
              No more gifs for you, take a break!
            </span>
            <button className="btn md:btn-lg btn-sm btn-primary">
              Feeling lucky?
            </button>
          </div>
        )
      )}
    </div>
  );
}

const splitIntoColumns = (gifs: Gif[], numColumns: number) => {
  const columns = Array.from({ length: numColumns }, () => []) as Gif[][];
  gifs.forEach((gif, index) => {
    columns[index % numColumns].push(gif);
  });
  return columns;
};
