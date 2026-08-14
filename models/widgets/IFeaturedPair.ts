interface Card {
  image?: {
    desktop?: { url?: string; alt?: string };
    mobile?: { url?: string; alt?: string };
  };
  icon?: { url?: string; alt?: string };
  link?: {
    url?: string;
    text?: string;
  };
  subtitle?: string;
  position: "left" | "right";
}

export interface IFeaturedPair {
  cards?: Card[];
  swap?: boolean;
  variant?: "default" | "block";
  imageSize?: { width: number; height: number };
  bgColor?: string;
  pt?: string;
  pb?: string;
}
