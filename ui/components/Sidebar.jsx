'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/sidebar-context';

import HomeIcon from '@/assets/icons/home.svg';
import SearchIcon from '@/assets/icons/search.svg';
import ChevronIcon from '@/assets/icons/chevron.svg';
import NodeIcon from '@/assets/icons/node.svg';
import SettingsIcon from '@/assets/icons/settings.svg';
import HelpIcon from '@/assets/icons/help.svg';
import UpdateIcon from '@/assets/icons/update.svg';
import KleinFull from '@/assets/full-klein.svg';
import KleinSmall from '@/assets/klein.svg';
import AnimatedRocketIcon from '@/assets/icons/update/animated-rocket';


const NavItem = ({ href, icon, title, shortcut, collapsed, isUpdateButton = false }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`block hover:bg-hover_gray rounded-lg overflow-hidden ${isActive ? 'bg-selected_bg' : ''}`}>
      <div className="flex items-center px-4 py-2 transition-all duration-300 ease-in-out" title={title}>
        <div className="flex-shrink-0">
          {isUpdateButton ? (
            <AnimatedRocketIcon />
          ) : (
            <Image src={icon} alt={title} width={20} height={20} />
          )}
        </div>
        <div
          className={`flex items-center flex-1 min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            }`}
        >
          <span className="ml-2 text-base font-normal leading-[20px] tracking-[-0.32px] text-text_gray overflow-hidden text-ellipsis whitespace-nowrap">
            {title}
          </span>
          {shortcut && (
            <span className="ml-auto text-[10px] font-extralight leading-[20px] text-text_gray whitespace-nowrap">
              {shortcut}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

const NavSection = ({ title, items, collapsed }) => {
  return (
    <>
      <div
        className={`w-full flex items-center text-xs font-medium uppercase text-text_gray mb-2 transition-all duration-300 ease-in-out mt-4 ${collapsed ? 'justify-center' : 'justify-start pl-4'
          }`}
      >
        {title}
      </div>
      <nav className="flex flex-col space-y-1">
        {items.map((item, index) => (
          <NavItem key={index} {...item} collapsed={collapsed} />
        ))}
      </nav>
    </>
  );
};

const Sidebar = () => {
  const { collapsed, setCollapsed, hasUpdate } = useSidebar();

  const sidebarWidth = collapsed ? '95px' : '260px';

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const mainNavItems = [
    { title: 'Home', href: '/', icon: HomeIcon, shortcut: 'Ctrl+H' },
    { title: 'Explore', href: '/explore', icon: SearchIcon, shortcut: 'Ctrl+F' },
    { title: 'Node Overview', href: '/nodeoverview', icon: NodeIcon, shortcut: 'Ctrl+A' },
  ];

  // if (hasUpdate) {
  //   mainNavItems.push({ title: 'Update', href: '/', icon: UpdateIcon, shortcut: '', isUpdateButton: true });
  // }

  mainNavItems.push({ title: 'Settings', href: '/settings', icon: SettingsIcon, shortcut: '' });


  const helpNavItems = [
    { title: 'Help', href: '/help', icon: HelpIcon, shortcut: '' },
  ];

  return (
    <div
      className={`h-full bg-gray dark:bg-bg_dark_gray rounded-xl transition-all duration-300 ease-in-out`}
      style={{ width: sidebarWidth }}
    >
      <div className="h-full flex flex-col items-center">
        <div
          className="mb-12 mt-8 relative overflow-hidden transition-all duration-300 ease-in-out"
          style={{ width: collapsed ? '40px' : '160px', height: '30px' }}
        >
          <div
            className="absolute inset-0 transition-all duration-300 ease-in-out"
            style={{
              opacity: collapsed ? 0 : 1,
              transform: `scale(${collapsed ? 0.5 : 1})`,
            }}
          >
            <Image
              src={KleinFull}
              alt="Klein Full Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div
            className="absolute inset-0 transition-all duration-300 ease-in-out"
            style={{
              opacity: collapsed ? 1 : 0,
              transform: `scale(${collapsed ? 1 : 1.5})`,
            }}
          >
            <Image
              src={KleinSmall}
              alt="Klein Small Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
        <div className="relative w-full">
          <button
            className="absolute top-4 -right-3 bg-white rounded-full p-1 shadow-md transition-all duration-300 ease-in-out hover:scale-110 active:scale-95"
            onClick={toggleSidebar}
            style={{
              transform: `rotate(${collapsed ? 0 : 180}deg)`,
            }}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Image src={ChevronIcon} alt="" width={24} height={24} />
          </button>
        </div>
        <div className="w-full h-full px-6 overflow-hidden">
          <NavSection title="Main" items={mainNavItems} collapsed={collapsed} />
        </div>
        <div className="w-full pb-6 px-6 overflow-hidden">
          <NavSection title="" items={helpNavItems} collapsed={collapsed} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

