export interface LinkModel {
  nav_menu?: MenuModel[];
  nav_footer?: FooterModel[];
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
