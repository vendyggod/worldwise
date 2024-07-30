import Logo from '../Logo/Logo';
import AppNav from '../AppNav/AppNav';
import styles from './Sidebar.module.css';
import SidebarFooter from '../SidebarFooter/SidebarFooter';
import { Outlet } from 'react-router-dom';

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />

      <Outlet />

      <SidebarFooter />
    </div>
  );
}

export default Sidebar;
