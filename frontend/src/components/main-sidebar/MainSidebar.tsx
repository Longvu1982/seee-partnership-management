import { Sidebar, SidebarContent, SidebarGroup } from "@/components/ui/sidebar";
import useAuthStore from "@/store/auth";
import { Role } from "@/types/enum/app-enum";
import MenuItem from "./menu-item/MenuItem";
import { type TMenuItem } from "./menu-item/menuItems.type";

const menus: TMenuItem[] = [
  {
    type: "single",
    title: "Danh sách đối tác",
    role: [],
    link: "/partner-list",
    level: 1,
  },
  {
    type: "single",
    title: "Danh sách sự kiện",
    role: [],
    link: "/event-list",
    level: 1,
  },
  {
    type: "single",
    title: "Danh sách liên hệ",
    role: [],
    link: "/contact-list",
    level: 1,
  },
  {
    type: "single",
    title: "Quản lý người dùng",
    role: [Role.ADMIN],
    link: "/user-list",
    level: 1,
  },
  {
    type: "single",
    title: "Tài khoản của tôi",
    role: [],
    link: "/account",
    level: 1,
  },
];

const MainSidebar = () => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  return (
    <Sidebar>
      <div className="text-center h-12 flex items-center justify-center border-b mb-3">
        <span className="font-semibold">SEEE Partnership Management</span>
      </div>
      <SidebarContent>
        <SidebarGroup className="space-y-1">
          {menus
            .filter(
              (item) => !item.role?.length || item.role.includes(role as Role)
            )
            .map((menu) => (
              <MenuItem {...menu} key={menu.title} />
            ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default MainSidebar;
