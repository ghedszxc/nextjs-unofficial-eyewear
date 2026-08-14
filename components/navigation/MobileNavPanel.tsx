"use client";

import React from "react";
import Link from "next/link";

type ChildLink = {
  label: string;
  href: string;
  totalItems?: string;
};

type NavChild = {
  header: string;
  href?: string;
  children?: ChildLink[];
};

type NavItem = {
  label: string;
  href?: string;
  children?: NavChild[];
};

type MobileNavPanelProps = {
  item: NavItem;
};

const MobileNavPanel = ({ item }: MobileNavPanelProps) => {
  const children = item.children ?? [];

  return (
    <div className="flex flex-col">
      {/* Content */}
      <div className={`flex flex-col ${item.label === "The Brand" ? "gap-8" : "gap-20"} px-6 py-6`}>
        {children.map((group) => {
          const hasSubChildren = group.children && group.children.length > 0;

          
          if (hasSubChildren) {
            return (
              <div key={group.header} className="flex flex-col gap-8">
                <span className="font-gt-america-expanded-bold text-[20px] uppercase text-white">
                  {group.header}
                </span>
                <ul className="flex flex-col gap-4">
                  {group.children!.map((child) => (
                    <li key={child.label}>
                      <Link
                        href={child.href}
                        className="font-gt-america-standard-light text-[20px]  text-white hover:underline"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }

  
          if (group.href) {
            return (
              <Link
                key={group.header}
                href={group.href}
                className="font-gt-america-expanded-bold text-[20px] uppercase text-white hover:underline"
              >
                {group.header}
              </Link>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

export default MobileNavPanel;
