export interface IFooterLink {
  text: string;
  href: string;
  isExternal: boolean;
}

export interface IFooterSocial {
  icon: string;
  title: string;
  hashtag: string;
  href: string;
}

export interface IFooter {
  tagline: string;
  social: IFooterSocial;
  navigationLinks: IFooterLink[];
  copyright: string;
  logo: { src: string; alt: string };
}
