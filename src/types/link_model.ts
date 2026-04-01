export interface LinkModel {
  page_links?: MenuModel[];
  footer_links?: FooterModel[];
}

export interface MenuModel {
  id: number;
  label: string;
  icon: string;
  url: string;
}

export interface FooterModel {
  id: number;
  label: string;
  icon: string;
  url: string;
}
