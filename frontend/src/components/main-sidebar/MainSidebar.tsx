import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
} from "@/components/ui/sidebar";
import useAuthStore from "@/store/auth";
import { Role } from "@/types/enum/app-enum";
import { Avatar } from "../ui/avatar";
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
];

const MainSidebar = () => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  return (
    <Sidebar>
      <div className="flex items-center gap-2 ml-4 py-4">
        <Avatar className="size-8">{/* <AvatarImage src={logo} /> */}</Avatar>
        <span className="font-semibold italic">SEEE</span>
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
      <SidebarFooter>{/* Add footer content here */}</SidebarFooter>
    </Sidebar>
  );
};

export default MainSidebar;
