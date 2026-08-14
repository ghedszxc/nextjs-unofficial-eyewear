"use client";

import React from "react";
//import { BsChevronRight } from "react-icons/bs";
import { ChevronRight } from "lucide-react"

type NavItem = {
  label: string;
  href?: string;
  children?: any[];
};

type MobileNavListProps = {
  navLinks: NavItem[];
  onSelect: (label: string) => void;
};

const MobileNavList = ({ navLinks, onSelect }: MobileNavListProps) => {
  return (
    <ul className="mt-[40px] flex flex-col">
      {navLinks.map((link) => (
        <li key={link.label}>
          <button
            type="button"
            onClick={() => onSelect(link.label)}
            className="flex w-full cursor-pointer items-center justify-between px-6 py-5 pb-3"
          >
            <span className="font-gt-america-expanded-bold text-[20px] uppercase text-white">
              {link.label}
            </span>
            {/* <BsChevronRight className="text-white" style={{ width: 32, height: 32 }} /> */}
            <ChevronRight className="text-white" style={{ width: 48, height: 48 }} strokeWidth={1}/>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default MobileNavList;
