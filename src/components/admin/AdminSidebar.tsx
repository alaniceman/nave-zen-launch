import { Calendar, Users, Package, Clock, User, LogOut, Ticket, Gift, Key, MapPin, ShoppingCart } from 'lucide-react';
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
  { title: 'Órdenes de Compra', url: '/admin/ordenes', icon: ShoppingCart },
  { title: 'Sucursales', url: '/admin/sucursales', icon: MapPin },
  { title: 'Profesionales', url: '/admin/profesionales', icon: Users },
  { title: 'Servicios', url: '/admin/servicios', icon: Package },
  { title: 'Bonos', url: '/admin/paquetes-sesiones', icon: Gift },
  { title: 'Códigos de Sesión', url: '/admin/codigos-sesiones', icon: Key },
  { title: 'Cupones', url: '/admin/cupones', icon: Ticket },
  { title: 'Disponibilidad', url: '/admin/disponibilidad', icon: Clock },
  { title: 'Agendas Futuras', url: '/admin/agendas-futuras', icon: Calendar },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const { user, signOut } = useAuth();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar p-4 hidden lg:block">
        {!collapsed && (
          <h2 className="text-lg font-bold text-gray-900">Nave Studio Admin</h2>
        )}
      </SidebarHeader>

      <SidebarContent className="bg-sidebar">
        <SidebarGroup className="px-2">
          <SidebarGroupLabel className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-2 px-2">
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
                            ? 'bg-primary font-bold shadow-md scale-[1.02]'
                            : 'hover:bg-gray-100 hover:scale-[1.02] font-medium'
                        }`
                      }
                      style={({ isActive }) => ({
                        color: isActive ? '#ffffff' : '#1f2937'
                      })}
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

      <SidebarFooter className="border-t border-sidebar-border bg-sidebar p-4">
        {!collapsed && user && (
          <div className="mb-3 p-2 rounded-md bg-gray-100 text-sm text-gray-700 truncate font-medium">
            <User className="h-4 w-4 inline mr-2" />
            <span className="text-xs">{user.email}</span>
          </div>
        )}
        <Button
          variant="outline"
          size={collapsed ? 'icon' : 'default'}
          onClick={signOut}
          className="w-full justify-start border-2 bg-white text-gray-800 hover:bg-destructive hover:text-white hover:border-destructive font-semibold"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Cerrar Sesión</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
