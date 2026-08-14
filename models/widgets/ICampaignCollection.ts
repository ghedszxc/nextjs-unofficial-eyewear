export interface ICampaignCard {
  image?: {
    url?: string;
    alt?: string;
  };
  name?: string;
  cta?: {
    text?: string;
    href?: string;
  };
  icon?: { url: string; alt: string };
  counter?: string;
}

export interface ICampaignCollection {
  campaigns?: ICampaignCard[];
}
