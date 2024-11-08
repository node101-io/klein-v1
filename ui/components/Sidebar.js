'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import HomeIcon from '@/assets/icons/home.svg';
import SearchIcon from '@/assets/icons/search.svg';
import ChevronIcon from '@/assets/icons/chevron.svg';
import NodeIcon from '@/assets/icons/node.svg';
import NewNodeIcon from '@/assets/icons/new-node.svg';
import SettingsIcon from '@/assets/icons/settings.svg';
import HelpIcon from '@/assets/icons/help.svg';

const NavItem = ({ href, icon, title, shortcut, collapsed }) => {
  return (
    <Link href={href} className="hover:bg-hover_gray rounded-lg">
      <div className="flex items-center justify-center px-4 py-2" title={title}>
        <div className="flex-shrink-0">
          <Image src={icon} alt={title} width={20} height={20} />
        </div>
        <div
          className={`flex items-center flex-1 min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${collapsed
            ? 'opacity-0 w-0 transform -translate-x-5'
            : 'opacity-100 w-auto transform translate-x-0'
            }`}
          style={{ whiteSpace: 'nowrap' }}
        >
          <span className="ml-2 text-base font-normal leading-[20px] tracking-[-0.32px] text-text_gray overflow-hidden text-ellipsis">
            {title}
          </span>
          <span className="ml-auto text-[10px] font-extralight leading-[20px] text-text_gray">
            {shortcut}
          </span>
        </div>
      </div>
    </Link>
  );
};

const NavSection = ({ title, items, collapsed }) => {
  return (
    <>
      <div
        className={`w-full pl-4 flex justify-start text-xs font-medium uppercase text-text_gray mb-2 transition-all duration-300 ease-in-out ${title === 'Main' ? 'mt-16' : 'mt-4'
          } ${collapsed ? 'opacity-0 transform -translate-x-5' : 'opacity-100 transform translate-x-0'}`}
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
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const mainNavItems = [
    { title: 'Home', href: '/', icon: HomeIcon, shortcut: 'Ctrl+H' },
    { title: 'Search', href: '/search', icon: SearchIcon, shortcut: 'Ctrl+F' },
  ];

  const nodesNavItems = [
    { title: 'Your Nodes', href: '/your-nodes', icon: NodeIcon, shortcut: 'Ctrl+A' },
    { title: 'New server', href: '/new-node', icon: NewNodeIcon, shortcut: 'Ctrl+F' },
  ];
  const settingsNavItems = [
    { title: 'Settings', href: '/settings', icon: SettingsIcon, shortcut: '' },
  ];
  const helpNavItems = [
    { title: 'Help', href: '/settings', icon: HelpIcon, shortcut: '' },
  ];

  return (
    <div className="h-full">
      <div
        className="h-full bg-gray rounded-xl text-black flex flex-col items-center transition-all duration-300 ease-in-out"
        style={{ width: collapsed ? 95 : 260 }}
      >
        <div className="relative w-full">
          <button
            className={`absolute top-4 -right-3 bg-white rounded-full p-1 shadow-md transition-transform duration-300 ease-in-out ${collapsed ? 'transform rotate-0' : 'transform rotate-180'
              }`}
            onClick={toggleSidebar}
          >
            <Image src={ChevronIcon} alt="Toggle Sidebar" width={24} height={24} />
          </button>
        </div>
        <div className="w-full h-full px-6">
          <NavSection title="Main" items={mainNavItems} collapsed={collapsed} />
          <NavSection title="Nodes" items={nodesNavItems} collapsed={collapsed} />
          <NavSection title="Settings" items={settingsNavItems} collapsed={collapsed} />
        </div>
        <div className="w-full pb-6 px-6">
          <NavSection title="" items={helpNavItems} collapsed={collapsed} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
