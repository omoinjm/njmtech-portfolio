export interface LinkModel {
  page_links?: MenuModel[];
  footer_links?: FooterModel[];
}

export interface MenuModel {
  id: number;
  name: string;
  icon: string;
  route_url: string;
  is_active: boolean;
}

export interface FooterModel {
  id: number;
  name: string;
  icon: string;
  route_url: string;
  is_active: boolean;
}
