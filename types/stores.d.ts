type Store = {
  id?: string;
  name: string;
  url: string;
  icon?: { url: string; alt: string };
  iconColor?: string;
};

type CountryGroup = {
  country: string; // e.g. "Singapore (SG)"
  stores: Store[];
};

type RegionGroup = {
  region: string;
  countries: CountryGroup[];
};
