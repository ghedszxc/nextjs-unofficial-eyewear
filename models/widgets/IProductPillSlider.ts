export interface IProductPillSliderItem {
  label: string;
  name: string;
  price: string;
  image: {
    url: string;
    alt: string;
  };
  thumbnail: {
    url: string;
    alt: string;
  };
  icon?: {
    url: string;
    alt: string;
  };
  ctaIcon?: {
    url: string;
    alt: string;
  };
  targetUrl: string;
  ctaText: string;
}

export interface IProductPillSlider {
  title: string;
  pills: IProductPillSliderItem[];
  maxVisibleButtons?: number;
}
