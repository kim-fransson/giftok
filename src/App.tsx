import { GiphyFetch } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";
import { useCallback, useEffect, useState } from "react";
import { GifCard } from "./components/GifCard/GifCard";
import { useMediaQuery } from "@uidotdev/usehooks";
import Logo from "./assets/logo.svg?react";

const GIFS_LIMIT = 20;
const INFINITE_LOADING_THRESHOLD = 0.95;

export default function App() {
  const [gifs, setGifs] = useState<IGif[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const showGrid = useMediaQuery("only screen and (min-width : 768px)");

  const fetchAndFilterGifs = useCallback(
    async (limit = GIFS_LIMIT, offset = 0) => {
      setIsLoading(true);
      const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY);
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
      } catch (error) {
        console.error("Error fetching GIFs:", error);
        // todo: handle errors
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchAndFilterGifs();
  }, []);

  const handleIntersection = (gif: IGif) => {
    const numberOfFetchedGifs = gifs.length;

    const indexOfIntersectedGifs = Array.from(gifs).indexOf(gif);

    const shouldLoadMoreGifs =
      (indexOfIntersectedGifs + 1) / numberOfFetchedGifs >
      INFINITE_LOADING_THRESHOLD;

    if (shouldLoadMoreGifs && !isLoading) {
      fetchAndFilterGifs(GIFS_LIMIT, numberOfFetchedGifs);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="navbar bg-base-100 shadow-2xl">
        <Logo />
      </div>
      {showGrid ? (
        <div>
          <div className="max-w-7xl mx-auto p-8 md:columns-3 lg:columns-4 transition-all">
            {gifs.map((gif) => (
              <div key={gif.id} className="mb-5">
                <GifCard
                  gif={gif}
                  onIntersection={handleIntersection}
                  onLoading={setIsLoading}
                />
              </div>
            ))}
          </div>
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          )}
        </div>
      ) : (
        <div className="carousel carousel-vertical w-full flex-1">
          {gifs.map((gif) => (
            <div key={gif.id} className="carousel-item h-full">
              <GifCard
                gif={gif}
                onIntersection={handleIntersection}
                onLoading={setIsLoading}
              />
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
