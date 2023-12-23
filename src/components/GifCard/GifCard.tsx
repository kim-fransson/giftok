export type GifCardProps = {
  url: string;
  alt: string;
  isLoading: boolean;
};

export const GifCard = (props: GifCardProps) => {
  return (
    <div
      className={`flex items-center justify-center w-full ${
        props.isLoading && "skeleton"
      }`}
    >
      <figure className="w-full">
        <img className="w-full h-full" src={props.url} alt={props.alt} />
      </figure>
    </div>
  );
};
