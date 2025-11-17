import { Calendar, Users, Package, Clock, User, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const menuItems = [
  { title: 'Reservas', url: '/admin/agenda', icon: Calendar },
  { title: 'Profesionales', url: '/admin/profesionales', icon: Users },
  { title: 'Servicios', url: '/admin/servicios', icon: Package },
  { title: 'Disponibilidad', url: '/admin/disponibilidad', icon: Clock },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const { user, signOut } = useAuth();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className={collapsed ? 'w-14' : 'w-64'}>
      <SidebarHeader className="border-b border-border p-4">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-foreground">Nave Studio Admin</h2>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestión</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground font-medium'
                            : 'hover:bg-muted text-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        {!collapsed && user && (
          <div className="mb-2 text-sm text-muted-foreground truncate">
            {user.email}
          </div>
        )}
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'default'}
          onClick={signOut}
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Cerrar Sesión</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
