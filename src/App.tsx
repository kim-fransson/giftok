import { GifsResult, GiphyFetch } from "@giphy/js-fetch-api";
import { useEffect, useState } from "react";
import { GifCard } from "./components/GifCard/GifCard";

export default function App() {
  const [gifs, setGifs] = useState<GifsResult>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY);
    gf.trending({ limit: 20 }).then((res) => {
      setGifs(res);
      setIsLoading(false);
    });
  }, []);

  return (
    gifs && (
      <div className="h-screen carousel carousel-vertical">
        {gifs.data.map((gif) => (
          <div className="carousel-item h-full">
            <GifCard
              key={gif.id}
              url={gif.images.original.url}
              alt={gif.alt_text || "gif"}
              isLoading={isLoading}
            />
          </div>
        ))}
      </div>
    )
  );
}
