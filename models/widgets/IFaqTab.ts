export interface IFaqTab {
  tabs: IFaqTabItem[];
}

export interface IFaqTabItem {
  tabName: string;
  anchorTarget?: string;
}
