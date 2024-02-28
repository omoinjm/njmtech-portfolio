export interface LinkModel {
  page_links?: NavMenuModel[];
  footer_links?: NavFooterModel[];
}

export interface NavMenuModel {
  id: number;
  name: string;
  icon: string;
  route_url: string;
  is_active: boolean;
}

export interface NavFooterModel {
  id: number;
  name: string;
  icon: string;
  route_url: string;
  is_active: boolean;
}
