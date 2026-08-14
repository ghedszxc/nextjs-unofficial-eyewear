export interface IStoreList {
  suggestedText: string;
  storesAvailableText: string;
  visitStoreText: string;
  visitTextAccordion: string;
  searchPlaceholderText: string;
  searchArrowTextDsk: string;
  searchArrowTextMob: string;
  items: {
    region: string;
    country: string;
    url: string;
    store: string;
    logo: { url: string; alt: string };
    logoColor: string; 
  }[];
}