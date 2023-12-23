import { GifsResult, GiphyFetch } from "@giphy/js-fetch-api";
import { useEffect, useState } from "react";
import { GifCard } from "./components/GifCard/GifCard";

export default function App() {
  const [gifs, setGifs] = useState<GifsResult>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY);
    gf.trending({ limit: 1 }).then((res) => {
      setGifs(res);
      setIsLoading(false);
    });
  }, []);

  return (
    gifs && (
      <div>
        {gifs.data.map((gif) => (
          <GifCard
            key={gif.id}
            url={gif.images.original.url}
            alt={gif.alt_text || "gif"}
            isLoading={isLoading}
          />
        ))}
      </div>
    )
  );
}
