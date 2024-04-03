import { menuType } from "../type/menu.type";
import {
  DashboardOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { MENULABEL } from "./contants";

export const menu: menuType[] = [
  {
    key: MENULABEL.PARTNER,
    name: MENULABEL.PARTNER,
    icons: CalendarOutlined,
    link: "/partner",
  },
  {
    key: MENULABEL.DASHBOARD,
    name: MENULABEL.DASHBOARD,
    icons: DashboardOutlined,
    link: "/dashboard",
  },
];
