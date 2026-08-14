import React from "react";
import Link from "next/link";
import Image from "next/image";
import RichText from "../RichText";
import { StoryblokRichTextProps } from "@storyblok/react/rsc";
import { Button } from "../ui/button";
//import { TfiClose } from "react-icons/tfi";
import { X } from "lucide-react"
import CollectionsSubmenu from "./CollectionSubmenu";
import { HiOutlineArrowSmRight } from "react-icons/hi";

type ProductGroup = {
  header: string;
  children: { label: string; href: string }[];
};

type CollectionGroup = {
  header: string;
  href: string;
  children: { label: string; href: string }[];
  image?: string;
  description?: Pick<StoryblokRichTextProps, "doc">;
};

type MoreGroup = {
  header: string;
  href: string;
};

type SubmenuProps = {
  subLinks: (ProductGroup | CollectionGroup | MoreGroup)[];
  label: string;
  isOpen: boolean;
  closeMenu: () => void;
};

const Submenu = ({ subLinks, label, isOpen, closeMenu }: SubmenuProps) => {
  return (
    <div
      className={`fixed inset-x-0 z-50 h-screen bg-black top-0 ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <div className="flex items-center border-b px-8 py-6">
        <Button
          variant="ghost"
          className="ml-auto flex cursor-pointer items-center gap-4 text-white hover:bg-transparent"
          onClick={closeMenu}
        >
          {/* <TfiClose className="text-white" style={{ width: 20, height: 20, minWidth: 20, minHeight: 20 }} /> */}
          <X className="text-white" style={{ width: 30, height: 30, minWidth: 20, minHeight: 20 }} strokeWidth={1}/>
          <span className="font-gt-america-expanded-bold mt-[3px] text-sm leading-none text-white">CLOSE</span>
        </Button>
      </div>

      {label === "Products" && (
        <div className="flex gap-10 p-10">
          {subLinks.map((group) => {
            const g = group as ProductGroup;
            return (
              <div key={g.header} className="flex w-1/2 flex-col gap-10">
                <span className="font-gt-america-expanded-bold text-3xl font-bold text-white uppercase">
                  {g.header}
                </span>
                <ul className="flex flex-col gap-6 py-6">
                  {g.children.map((child) => (
                    <li key={child.label} className="cursor-pointer">
                      <Link href={child.href}>
                        <span className="font-gt-america-expanded-bold text-lg text-white uppercase hover:underline">
                          {child.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {label === "Collections" && <CollectionsSubmenu subLinks={subLinks as CollectionGroup[]} />}

      {label !== "Products" && label !== "Collections" && (
        <div className="flex flex-col gap-20 p-20">
          {subLinks.map((group) => {
            const m = group as MoreGroup;
            return (
              <Link key={m.header} href={m.href}>
                <span className="font-gt-america-expanded-bold text-3xl text-white uppercase hover:underline">
                  {m.header}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Submenu;
