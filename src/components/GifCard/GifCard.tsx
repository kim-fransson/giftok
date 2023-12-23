export type GifCardProps = {
  url: string;
  alt: string;
  isLoading: boolean;
};

export const GifCard = (props: GifCardProps) => {
  return (
    <div
      className={`card w-full bg-base-100 shadow-xl ${
        props.isLoading && "skeleton"
      }`}
    >
      <figure>
        <img src={props.url} alt={props.alt} />
      </figure>
    </div>
  );
};
