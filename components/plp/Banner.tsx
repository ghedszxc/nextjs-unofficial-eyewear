import RichText from "../RichText";

interface Banner {
  title: string;
  description: any;
}

const Banner = ({ banner }: { banner: Banner }) => {
  const { title, description } = banner;

  return (
    <div className="bg-secondary-light w-full border-t border-black">
      <div className="flex flex-col lg:flex-row gap-4 px-8 py-10 lg:flex-start">
        <h2 className="font-gt-america-expanded-bold uppercase text-xl lg:w-1/2">{title}</h2>
        <RichText
          doc={{
            type: description?.type,
            content: description?.content,
          }}
          className={{
            p: "font-gt-america-standard-light text-base",
          }}
        />
      </div>
    </div>
  );
};

export default Banner;
