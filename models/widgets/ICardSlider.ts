export interface ICardSliderItem {
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  href: string;
}

export interface ICardSlider {
  items: ICardSliderItem[];
}
