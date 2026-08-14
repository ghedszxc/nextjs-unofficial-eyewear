import Link from "next/link";
import React from "react";
import Submenu from "./Submenu";

const NavLinks = ({
  navLinks,
  openMenu,
  setOpenMenu,
  closeMenu,
}: {
  navLinks: any[];
  openMenu: string | null;
  setOpenMenu: React.Dispatch<React.SetStateAction<string | null>>;
  closeMenu: () => void;
}) => {
  
  return (
    <ul className="flex justify-between items-center gap-8">
      {navLinks.map((link: any) => {
        const isActive = openMenu === link.label;
        return (
          <li key={link.label}>
            <button
              onClick={() => setOpenMenu(link.children ? (isActive ? null : link.label) : null)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className={`font-gt-america-expanded-bold text-sm uppercase text-white ${isActive ? "underline decoration-[1px] underline-offset-8" : ""}`}>
                  {link.label}
                </span>
              </div>
            </button>

            {link.children && <Submenu subLinks={link.children} label={link.label} isOpen={isActive} closeMenu={closeMenu} />}
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;
