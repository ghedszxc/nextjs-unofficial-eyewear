import { create } from "zustand";

type NavStore = {
  /** True while the fixed Navigation header is translated off-screen (scrolled down). */
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
};

/**
 * Single source of truth for the Navigation header's visibility.
 *
 * Navigation owns the show/hide logic (scroll direction, open menu, faqtab, etc.)
 * and publishes the result here. The sticky FiltersBar in PLP consumes it to
 * offset its `top` so it stays flush with the nav as it shows/hides.
 */
export const useNavStore = create<NavStore>((set) => ({
  hidden: false,
  setHidden: (hidden) => set({ hidden }),
}));
