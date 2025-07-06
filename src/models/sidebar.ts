export interface MenuItem {
  id: string;
  name: string;
  path: string;
  isIntegrated?: boolean;
  icon?:
    | 'LayoutDashboard'
    | 'Users'
    | 'FileUser'
    | 'ChevronRight'
    | 'User'
    | 'Server'
    | 'Store'
    | 'CircleHelp'
    | 'Inbox'
    | 'FileClock'
    | 'Presentation'
    | 'History'
    | 'Calendar'
    | 'SearchX'
    | 'TriangleAlert'
    | 'ChartNoAxesCombined';
  children?: MenuItem[];
}

export interface SidebarMenuItemProps {
  item: MenuItem;
  showText: boolean;
  isActive: boolean;
  onClick?: () => void;
}
