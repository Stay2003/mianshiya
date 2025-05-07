import { MenuDataItem } from "@ant-design/pro-layout";
import { 
  HomeOutlined, 
  BookOutlined, 
  TrophyOutlined, 
  QuestionCircleOutlined,
  GithubOutlined,
  CrownOutlined,
  UserOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  MessageOutlined
} from "@ant-design/icons";
import ACCESS_ENUM from "@/access/accessEnum";

// 菜单列表
export const menus = [
  {
    path: "/",
    name: "首页",
    icon: <HomeOutlined />,
  },
  {
    path: "/banks",
    name: "题库中心",
    icon: <BookOutlined />,
  },
  {
    path: "/ranking",
    name: "排行榜",
    icon: <TrophyOutlined />,
  },
  {
    path: "/questions",
    name: "题目集",
    icon: <QuestionCircleOutlined />,
  },
  {
    name: "GitHub",
    path: "https://github.com/Stay2003",
    target: "_blank",
    icon: <GithubOutlined />,
  },
  {
    path: "/admin",
    name: "管理后台",
    icon: <CrownOutlined />,
    access: ACCESS_ENUM.ADMIN,
    children: [
      {
        path: "/admin/user",
        name: "用户管理",
        icon: <UserOutlined />,
        access: ACCESS_ENUM.ADMIN,
      },
      {
        path: "/admin/bank",
        name: "题库管理",
        icon: <DatabaseOutlined />,
        access: ACCESS_ENUM.ADMIN,
      },
      {
        path: "/admin/question",
        name: "题目管理",
        icon: <FileTextOutlined />,
        access: ACCESS_ENUM.ADMIN,
      },
      {
        path: "/admin/messages",
        name: "留言管理",
        icon: <MessageOutlined />,
        access: ACCESS_ENUM.ADMIN,
      },
    ],
  },
] as MenuDataItem[];

// 根据全部路径查找菜单
export const findAllMenuItemByPath = (path: string): MenuDataItem | null => {
  return findMenuItemByPath(menus, path);
};

// 根据路径查找菜单（递归）
export const findMenuItemByPath = (
  menus: MenuDataItem[],
  path: string,
): MenuDataItem | null => {
  for (const menu of menus) {
    if (menu.path === path) {
      return menu;
    }
    if (menu.children) {
      const matchedMenuItem = findMenuItemByPath(menu.children, path);
      if (matchedMenuItem) {
        return matchedMenuItem;
      }
    }
  }
  return null;
};
