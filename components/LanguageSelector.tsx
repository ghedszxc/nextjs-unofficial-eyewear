import { locales } from "@/constants/locales";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Link from "next/link";

export interface ILanguageSelector {
  localesVariants: {
    [key: string]: string;
  };
  lang: Language;
}

const LanguageSelector = ({ localesVariants, lang }: ILanguageSelector) => {
  const _locales = locales
    .map((language) => ({
      language,
      full_slug: localesVariants[language],
    }))
    ?.filter((locale) => locale?.full_slug !== undefined);

  return (
    <Popover>
      <PopoverTrigger className="absolute top-4 right-4 z-10 w-fit cursor-pointer overflow-hidden rounded-md border border-gray-200 bg-white px-3 py-2 shadow-sm">
        {lang?.toUpperCase()}
      </PopoverTrigger>

      <PopoverContent className="w-40 overflow-hidden p-0">
        <div className="border-b px-3 py-2 text-sm text-gray-500">Country</div>

        <ul className="flex flex-col">
          {_locales.map((locale) => (
            <li key={locale.language}>
              <Link href={locale.full_slug} className="block px-3 py-2 text-sm hover:bg-gray-100">
                {locale.language.toUpperCase()}
              </Link>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSelector;
