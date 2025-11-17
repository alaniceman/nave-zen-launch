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
      <SidebarHeader className="border-b border-border bg-card p-4">
        {!collapsed && (
          <h2 className="text-lg font-bold text-card-foreground">Nave Studio Admin</h2>
        )}
      </SidebarHeader>

      <SidebarContent className="bg-card">
        <SidebarGroup className="px-2">
          <SidebarGroupLabel className="text-muted-foreground font-bold text-xs uppercase tracking-wider mb-2 px-2">
            Gestión
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                          isActive
                            ? 'bg-primary text-primary-foreground font-bold shadow-md scale-[1.02]'
                            : 'text-card-foreground hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] font-medium'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border bg-card p-4">
        {!collapsed && user && (
          <div className="mb-3 p-2 rounded-md bg-muted/50 text-sm text-card-foreground truncate font-medium">
            <User className="h-4 w-4 inline mr-2" />
            <span className="text-xs">{user.email}</span>
          </div>
        )}
        <Button
          variant="outline"
          size={collapsed ? 'icon' : 'default'}
          onClick={signOut}
          className="w-full justify-start border-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive font-semibold"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Cerrar Sesión</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
