import { GiphyFetch } from "@giphy/js-fetch-api";
import { useCallback, useEffect, useState } from "react";
import { Gif, GifCard } from "./components/GifCard/GifCard";
import { useMediaQuery } from "@uidotdev/usehooks";
import Logo from "./assets/logo.svg?react";

const GIFS_LIMIT = 20;
const INFINITE_LOADING_THRESHOLD = 0.75;

export default function App() {
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [noMoreGifs, setNoMoreGifs] = useState(false);

  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const isMediumDevice = useMediaQuery(
    "only screen and (min-width : 768px) and (max-width : 1024px)",
  );

  const fetchAndFilterGifs = useCallback(
    async (limit = GIFS_LIMIT, offset = 0) => {
      setIsLoading(true);
      setHasError(false);
      setNoMoreGifs(false);
      const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY);
      const previousGifsLength = gifs.length;
      try {
        const res = await gf.trending({ limit, offset });
        setGifs((current) => {
          const seen = new Set();
          const updatedGifsList = [...current, ...res.data];
          return updatedGifsList.filter((gif) => {
            const duplicate = seen.has(gif.id);
            seen.add(gif.id);
            return !duplicate;
          });
        });

        if (previousGifsLength === gifs.length) {
          setNoMoreGifs(true);
        }
      } catch (error) {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchAndFilterGifs();
  }, []);

  const handleIntersection = (gif: Gif) => {
    const numberOfFetchedGifs = gifs.length;

    const indexOfIntersectedGifs = Array.from(gifs).indexOf(gif);

    const shouldLoadMoreGifs =
      (indexOfIntersectedGifs + 1) / numberOfFetchedGifs >
      INFINITE_LOADING_THRESHOLD;

    if (shouldLoadMoreGifs && !isLoading) {
      fetchAndFilterGifs(GIFS_LIMIT, numberOfFetchedGifs);
    }
  };

  const numberOfColumns = isSmallDevice ? 1 : isMediumDevice ? 2 : 3;

  return (
    <div className="app-grid">
      <div className="navbar bg-base-100 shadow-2xl fixed z-50 opacity-90">
        <Logo />
      </div>
      <div className="max-w-7xl md:pt-24 flex-1 md:mx-auto md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-4">
        {splitIntoColumns(gifs, numberOfColumns).map((column, columnIndex) => (
          <div key={columnIndex} className="grid md:gap-4">
            {column.map((gif) => (
              <GifCard
                key={gif.id}
                gif={gif}
                onIntersection={handleIntersection}
                onLoading={setIsLoading}
              />
            ))}
          </div>
        ))}
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : hasError ? (
        <div className="flex items-center justify-center py-8">
          <span className="text-error md:text-2xl text-lg font-medium">
            Failed to fetch gifs, try again?
          </span>
        </div>
      ) : (
        noMoreGifs && (
          <div className="flex items-center justify-center py-8">
            <span className="text-info md:text-2xl text-lg font-medium ">
              No more gifs for you, take a break!
            </span>
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
