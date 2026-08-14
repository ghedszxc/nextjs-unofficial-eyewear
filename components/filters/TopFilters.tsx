"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import Image from "next/image";
import { useEffect } from "react";
import { safeJsonParse } from "@/lib/utils";

type FilterKey =
  | "lensType"
  | "gender"
  | "frameMaterial"
  | "frameColour"
  | "frameShape"
  | "lensColour"
  | "faceCoverage"
  | "bridgeChoice"
  | "ageGroup";
// | "frameSize" | "frameStyle" ;

type FilterOption = {
  label: string;
  description?: string;
  value: string; // lowercase, spaces preserved
  icon?: string;
  smallText?: string;
  ageGroup?: string; //for differentiating Adults and Teens gender
};

type FilterConfig = Record<
  FilterKey,
  {
    title: string;
    options: FilterOption[];
    disclaimer?: string;
  }
>;

type SelectedFilters = Record<FilterKey, string[]>;

const CONFIG: FilterConfig = {
  lensType: {
    title: "SHOP FOR",
    options: [
      { label: "Sunglasses", value: "Sunglasses" },
      { label: "Eyeglasses", value: "Eyeglasses" },
    ],
  },

  gender: {
    title: "Style for",
    options: [
      { label: "Female", value: "Female", ageGroup: "adultsF" },
      { label: "Male", value: "Male", ageGroup: "adultsM" },
      { label: "Unisex", value: "Unisex", ageGroup: "uniS" },
      { label: "Boys", value: "Male", ageGroup: "teensM" },
      { label: "Girls", value: "Female", ageGroup: "teensF" },
    ],
  },

  ageGroup: {
    title: "Age Group",
    options: [
      { label: "Adult", value: "Adults" },
      { label: "Teens", value: "Teens (11-13)" },
      { label: "Juniors", value: "Juniors (7-10)" },
      { label: "Kids", value: "Kids (4-6)" },
      { label: "Babies", value: "Baby (0-3)" },
    ],
  },

  frameMaterial: {
    title: "FRAME MATERIAL",
    options: [
      { label: "Acetate", value: "Acetate" },
      { label: "Injected", value: "Injected" },
      { label: "Metal", value: "Metal" },
      //{ label: "Propionate", value: "Propionate" },
    ],
  },

  // frameStyle: {
  //   title: "FRAME STYLE",
  //   options: [
  //     { label: "Glam", value: "Glam" },
  //     { label: "Romantic", value: "Romantic" },
  //     { label: "Active", value: "Active" },
  //     { label: "Forever Young", value: "Forever Young" },
  //     { label: "Mini Me", value: "Mini Me" },
  //     { label: "Playful", value: "Playful" },
  //     { label: "Capsule", value: "Capsule" },
  //   ],
  // },

  frameColour: {
    title: "FRAME COLOUR",
    options: [
      { label: "Black", value: "Black" },
      { label: "Brown", value: "Brown" },
      { label: "Grey", value: "Grey" },
      { label: "Blue", value: "Blue" },
      { label: "Green", value: "Green" },
      { label: "Pink", value: "Pink" },
      { label: "Purple/Red", value: "Red" },
      { label: "Gold", value: "Gold" },
      { label: "Silver", value: "Silver" },
      { label: "Clear", value: "Clear" },
      { label: "Burgundy", value: "Burgundy" },
      { label: "Havana", value: "Havana" },
      { label: "Yellow", value: "Yellow" },
      { label: "Bronze/Copper", value: "Bronze" },
      { label: "Gunmetal", value: "Gunmetal" },
    ],
  },

  frameShape: {
    title: "FRAME SHAPE",
    options: [
      { icon: "/icons/filter/pantos.svg", label: "Pantos", value: "Pantos" },
      { icon: "/icons/filter/square.svg", label: "Square", value: "Square" },
      { icon: "/icons/filter/rectangle.svg", label: "Rectangle", value: "Rectangle" },
      { icon: "/icons/filter/pilot.svg", label: "Pilot", value: "Pilot" },
      { icon: "/icons/filter/oval.svg", label: "Oval", value: "Oval" },
      { icon: "/icons/filter/round.svg", label: "Round", value: "Round" },
      { icon: "/icons/filter/irregular.svg", label: "Irregular", value: "Irregular" },
      { icon: "/icons/filter/cateye.svg", label: "Cat-eye", value: "Cat Eye" },
      { icon: "/icons/filter/butterfly.svg", label: "Butterfly", value: "Butterfly" },
    ],
  },

  lensColour: {
    title: "LENS COLOUR",
    options: [
      { label: "Grey", value: "GREY" },
      { label: "Green", value: "GREEN" },
      { label: "Brown", value: "BROWN" },
      { label: "Blue", value: "BLUE" },
      { label: "Violet", value: "VIOLET" },
      { label: "Teal", value: "TEAL" },
      { label: "Orange", value: "ORANGE" },
    ],
  },

  faceCoverage: {
    title: "FACE COVERAGE",
    options: [
      {
        label: "Petite",
        value: "Petite",
        smallText: "A small lens front for those who prefer to cover a smaller portion of the face.",
      },
      { label: "Standard", value: "Standard" },
      { label: "Generous", value: "Brown" },
    ],
  },

  bridgeChoice: {
    title: "BRIDGE CHOICE & NOSEPADS",
    options: [
      {
        label: "High bridge fit",
        value: "High",
        description:
          "Offers a more secure and comfortable fit for those with a high nose bridge and lower cheekbones. A good choice if the bridge of your nose is above the level of your pupils.",
      },
      {
        label: "Low bridge fit",
        value: "Low",
        description:
          "Offers a more secure and comfortable fit for those with a low nose bridge and higher cheekbones. A good choice if eyewear tends to slide down your nose, sit too low, or press on your temples or cheeks.",
      },
      { label: "Universal fit", value: "Universal", description: "This option accommodates most face shapes." },
      { label: "Adjustable nose pads", value: "Adjustable", description: "This option accommodates most face shapes." },
    ],
  },
};

const EMPTY_SELECTED: SelectedFilters = {
  lensType: [],
  gender: [],
  ageGroup: [],
  frameMaterial: [],
  frameColour: [],
  frameShape: [],
  lensColour: [],
  faceCoverage: [],
  bridgeChoice: [],
  // frameStyle: []
  // frameSize: [],
};

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function countSelected(selected: SelectedFilters) {
  return Object.values(selected).reduce((acc, arr) => acc + arr.length, 0);
}

/**
 * Writes the selected filters into URLSearchParams using dot keys:
 * - attributes.FRAME_MATERIAL=val,val
 * - attributes.FRAME_COLOUR=val,val
 * - attributes.FRAME_SHAPE=val,val
 * - attributes.FRAME_SIZE=val,val
 *
 * Empty selections are removed from the URL.
 */
function upsertAttributeParams(params: URLSearchParams, selected: SelectedFilters) {
  const map: Record<FilterKey, string> = {
    lensType: "attributes.LENS_TYPE",
    gender: "attributes.GENDER",
    ageGroup: "attributes.AGE_GROUP",
    frameMaterial: "attributes.FRAME_MATERIAL",
    frameColour: "attributes.FRONT_FRAME_COLOR",
    frameShape: "attributes.FRAME_SHAPE",
    lensColour: "attributes.LENS_COLOR_DESCRIPTION",
    faceCoverage: "attributes.FACE_COVERAGE",
    bridgeChoice: "attributes.BRIDGE_CHOICE",
    // frameStyle: "attributes.FRAME_STYLE"
    // frameSize: "attributes.FRAME_SIZE",
  };

  (Object.keys(map) as FilterKey[]).forEach((key) => {
    const paramKey = map[key];
    const values = selected[key];

    if (!values || values.length === 0) {
      params.delete(paramKey);
      return;
    }

    // join as "string,string"
    params.set(paramKey, values.join(","));
  });

  return params;
}

type TopFiltersProps = {
  /** Optional: called when user clicks "See results" (in addition to URL update) */
  onApply?: (selected: SelectedFilters) => void;
  lang?: string;
  category?: string[];
  triggerLabel?: string;
  resultsCount?: number;
  className?: string;
};

export default function TopFilters({
  onApply,
  triggerLabel = "Filter",
  lang,
  category,
  resultsCount,
  className,
}: TopFiltersProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<SelectedFilters>(EMPTY_SELECTED);
  const [productCount, setProductCounts] = React.useState<number>(0);
  const [allProducts, setAllProducts] = React.useState<any[]>([]);
  const [activeAgeGroup, setActiveAgeGroup] = React.useState<String[]>([]);
  const [unisexSelected, setUnisexSelected] = React.useState(false);
  const prevItemsRef = React.useRef(activeAgeGroup);
  const [isSelectedEmpty, setIsSelectedEmpty] = React.useState<Boolean>(true);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const clearAll = () => {
    setSelected(EMPTY_SELECTED);
    setActiveAgeGroup([]);
    setProductCounts(0);

    // also clear from URL immediately
    const params = new URLSearchParams(searchParams.toString());
    params.delete("attributes.LENS_TYPE");
    params.delete("attributes.GENDER");
    params.delete("attributes.AGE_GROUP");
    params.delete("attributes.FRAME_MATERIAL");
    params.delete("FRONT_FRAME_COLOR");
    params.delete("attributes.FRAME_SHAPE");
    params.delete("attributes.LENS_COLOR_DESCRIPTION");
    params.delete("attributes.FACE_COVERAGE");
    params.delete("attributes.BRIDGE_CHOICE");
    params.delete("attributes.FRAME_STYLE");
    // params.delete("attributes.FRAME_SIZE");

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    router.refresh();
  };

  const apply = () => {
    onApply?.(selected);

    const params = new URLSearchParams(searchParams.toString());
    upsertAttributeParams(params, selected);

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });

    setOpen(false);
  };

  const selectGenderFilter = (key: FilterKey, option: string, ageGroup?: string) => {
    if (ageGroup) {
      setActiveAgeGroup(
        (prevItems) =>
          prevItems.includes(ageGroup)
            ? prevItems.filter((id) => id !== ageGroup)
            : [...prevItems, ageGroup] // Add if missing
      );
    } else {
      setSelected((prev) => ({
        ...prev,
        ["gender"]: toggleValue(prev["gender"], option),
      }));
    }
  };

  const selectFilter = (key: FilterKey, option: string, ageGroup?: string) => {
    setSelected((prev) => ({
      ...prev,
      [key]: toggleValue(prev[key], option),
    }));
  };

  const checkActiveAgeGroup = (ageGroup?: string) => {
    if (ageGroup) {
      return activeAgeGroup.includes(ageGroup);
    } else {
      return;
    }
  };

  const handleMouseEnter = (text: any, id: FilterKey, selectedFilter: string) => {
    const smallTextContainer = document.getElementById(selectedFilter) as HTMLElement;
    const newTextNode = document.createTextNode(text);
    if (!selected[id].includes(selectedFilter)) {
      if (text) {
        if (smallTextContainer) {
          smallTextContainer.appendChild(newTextNode);
        }
      }
    }
  };

  const handleMouseLeave = (id: FilterKey, selectedFilter: string) => {
    const smallTextContainer = document.getElementById(selectedFilter) as HTMLElement;
    if (!selected[id].includes(selectedFilter)) {
      if (smallTextContainer) {
        Array.from(smallTextContainer.childNodes).forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            node.remove();
          }
        });
      }
    }
  };

  const handleToggle = (text: any, id: FilterKey, selectedFilter: string) => {
    const smallTextContainer = document.getElementById(selectedFilter) as HTMLElement;
    const newTextNode = document.createTextNode(text);
    if (text && selected[id].includes(selectedFilter) && smallTextContainer.childNodes.length == 0) {
      if (smallTextContainer) {
        smallTextContainer.appendChild(newTextNode);
      }
    } else if (selected[id].includes(selectedFilter) && smallTextContainer.childNodes.length > 0) {
      Array.from(smallTextContainer.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.remove();
        }
      });
    }
  };

  //check category and disable filters accordingly
  const checkLensCategory = () => {
    const lensCategories = ["eyeglasses", "sunglasses", "sun", "optical"];
    return lensCategories.some((el) => pathname.includes(el));
  };

  //lens colour is only relevant for sunglasses, so disable it for eyeglasses
  const isEyeglassesCategory = pathname.includes("eyeglasses") || pathname.includes("optical");

  const renderFilters = (key: FilterKey, desktopColumns: any, mobileColumns: any) => {
    const col = CONFIG[key];

    const variantStyles: Record<string, string> = {
      col1: "grid-cols-1",
      col2: "grid-cols-2",
      col3: "grid-cols-3",
      col4: "grid-cols-4",
    };

    return (
      <div key={key} className="min-w-0">
        <p className="font-gt-america-expanded-bold py-6 text-[16px] font-normal text-white lg:py-8">{col.title}</p>

        <div
          className={`grid ${variantStyles[mobileColumns]} items-start gap-4 space-y-3 lg:${variantStyles[desktopColumns]}`}
        >
          {col.options.map((opt, index) => {
            const checked = selected[key].includes(opt.value);

            return (
              <label
                key={index}
                className={
                  "flex-auto cursor-pointer flex-nowrap rounded-full border border-white bg-transparent px-4 py-2 text-center text-white select-none lg:hover:bg-[#FFFFFF4D] lg:hover:text-white has-aria-checked:bg-white! has-aria-checked:text-black!"
                }
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => selectFilter(key, opt.value)}
                  className="peer invisible absolute mt-0.5"
                />
                <span>
                  {opt.icon && (
                    <Image
                      src={opt.icon}
                      alt={opt.label}
                      width={24}
                      height={24}
                      className="me-4 inline-block peer-data-[state=checked]:invert"
                      unoptimized
                    />
                  )}
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>

        <Separator className="mt-5 !h-[0.5px] bg-white" />
      </div>
    );
  };

  //filter specific to gender category
  const renderGenderFilters = (key: FilterKey, desktopColumns: any, mobileColumns: any) => {
    const col = CONFIG[key];

    const variantStyles: Record<string, string> = {
      col1: "grid-cols-1",
      col2: "grid-cols-2",
      col3: "grid-cols-3",
      col4: "grid-cols-4",
    };

    const genderCategories = ["male", "female", "unisex"];
    const isGenderCollection = genderCategories.some((el) => pathname.includes(el));
    const isTeensCategory = pathname.includes("teens");

    return (
      <div key={key} className="min-w-0">
        <p className="font-gt-america-expanded-bold py-6 text-[16px] font-normal text-white uppercase lg:py-8">
          {col.title}
        </p>

        <div
          className={`grid ${variantStyles[mobileColumns]} items-start gap-4 space-y-3 lg:${variantStyles[desktopColumns]}`}
        >
          {col.options.map((opt, index) => {
            const checked = selected[key].includes(opt.value);

            if (isTeensCategory) {
              if (opt.ageGroup == "adultsM" || opt.ageGroup == "adultsF") {
                return;
              } else {
                return (
                  <label
                    key={index}
                    className={`flex-auto cursor-pointer flex-nowrap ${opt.value == "Unisex" ? "order-1" : ""} rounded-full border border-white bg-transparent px-4 py-2 text-center text-white select-none lg:hover:bg-[#FFFFFF4D] lg:hover:text-white has-aria-checked:bg-white! has-aria-checked:text-black!`}
                  >
                    <Checkbox
                      checked={checkActiveAgeGroup(opt.ageGroup)}
                      onCheckedChange={() => selectFilter(key, opt.value, opt.ageGroup)}
                      className="peer invisible absolute mt-0.5"
                    />
                    <span className="text-sm">
                      {opt.icon && (
                        <img src={opt.icon} className="me-4 inline-block peer-data-[state=checked]:invert" />
                      )}
                      {opt.label}
                    </span>
                  </label>
                );
              }
            } else if (isGenderCollection) {
              if (opt.ageGroup == "teensM" || opt.ageGroup == "teensF") {
                return;
              }
              if (pathname.split("/").includes(opt.value.toLowerCase())) {
                return (
                  <label
                    key={index}
                    className={
                      "flex-auto cursor-pointer flex-nowrap rounded-full border border-white bg-transparent px-4 py-2 text-center text-white select-none lg:hover:bg-[#FFFFFF4D] lg:hover:text-white has-aria-checked:bg-white! has-aria-checked:text-black!"
                    }
                  >
                    <Checkbox
                      checked={true}
                      onCheckedChange={() => selectFilter(key, opt.value, opt.ageGroup)}
                      className="peer invisible absolute mt-0.5"
                    />
                    <span className="text-sm">
                      {opt.icon && (
                        <img src={opt.icon} className="me-4 inline-block peer-data-[state=checked]:invert" />
                      )}
                      {opt.label}
                    </span>
                  </label>
                );
              } else {
                return;
              }
            } else {
              return (
                <label
                  key={index}
                  className={
                    "flex-auto cursor-pointer flex-nowrap rounded-full border border-white bg-transparent px-4 py-2 text-center text-white select-none lg:hover:bg-[#FFFFFF4D] lg:hover:text-white has-aria-checked:bg-white! has-aria-checked:text-black!"
                  }
                >
                  <Checkbox
                    checked={checkActiveAgeGroup(opt.ageGroup)}
                    onCheckedChange={() => selectGenderFilter(key, opt.value, opt.ageGroup)}
                    className="peer invisible absolute mt-0.5"
                  />
                  <span className="text-sm">
                    {opt.icon && <img src={opt.icon} className="me-4 inline-block peer-data-[state=checked]:invert" />}
                    {opt.label}
                  </span>
                </label>
              );
            }
          })}
        </div>

        <Separator className="mt-5 !h-[0.5px] bg-white" />
      </div>
    );
  };

  const renderAccordionFilters = (key: FilterKey, desktopColumns: string, mobileColumns: string, disabled = false) => {
    const col = CONFIG[key];

    const variantStyles: Record<string, string> = {
      col1: "grid-cols-1",
      col2: "grid-cols-2",
      col3: "grid-cols-3",
      col4: "grid-cols-4",
    };

    return (
      <div key={key} className="min-w-0">
        <Accordion type="multiple" className="w-full">
          <AccordionItem key={key} value={key}>
            <AccordionTrigger className="font-gt-america-expanded-bold :aria-expanded:pb-6 items-center bg-clip-text py-7 text-[16px] font-normal text-white hover:no-underline aria-expanded:pt-8 lg:aria-expanded:pt-14 lg:aria-expanded:pb-10">
              {col.title}
            </AccordionTrigger>
            <AccordionContent className="pb-8 lg:pb-14">
              <div
                className={`grid ${variantStyles[mobileColumns]} lg:${variantStyles[desktopColumns]} items-start gap-4 space-y-3`}
              >
                {col.options.map((opt) => {
                  const checked = selected[key].includes(opt.value);

                  return (
                    <label
                      onClick={() => handleToggle(opt.smallText, key, opt.value)}
                      onMouseEnter={() => handleMouseEnter(opt.smallText, key, opt.value)}
                      onMouseLeave={() => handleMouseLeave(key, opt.value)}
                      key={opt.value}
                      aria-disabled={disabled}
                      className={`flex-auto flex-nowrap rounded-full border border-white bg-transparent px-4 py-2 text-center text-white select-none has-aria-checked:bg-white! has-aria-checked:text-black! ${disabled ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer lg:hover:bg-[#FFFFFF4D] lg:hover:text-white"}`}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={disabled}
                        onCheckedChange={() => selectFilter(key, opt.value)}
                        className="invisible absolute mt-0.5"
                      />
                      {opt.icon && (
                        <img src={opt.icon} className="me-4 inline-block peer-data-[state=checked]:invert" />
                      )}
                      <span>{opt.label}</span>
                    </label>
                  );
                })}
              </div>
              {col.options.map((opt, index) => {
                return <p key={index} id={opt.value} className="text-[8px] text-white"></p>;
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator className="mt-0 !h-[0.5px] bg-white" />
      </div>
    );
  };

  // const renderCheckBoxFilters = (key: FilterKey) => {
  //   const col = CONFIG[key];

  //   return (
  //     <div key={key} className="min-w-0">
  //       <Accordion type="multiple" className="w-full">
  //         <AccordionItem key={key} value={key}>
  //           <AccordionTrigger className="font-gt-america-expanded-bold text-white text-[16px] font-normal bg-clip-text hover:no-underline">{col.title}</AccordionTrigger>
  //           <AccordionContent className="pb-0">
  //             <div className={"grid grid-cols-1 gap-[16px] mt-4 space-y-3 items-start"}>
  //               {col.options.map((opt, index) => {
  //                 const checked = selected[key].includes(opt.value);

  //                 return (
  //                   <label key={opt.value} className={"flex-auto flex-nowrap cursor-pointer select-none bg-transparent text-white py-6 px-4 border border-gray-200 has-aria-checked:bg-white has-aria-checked:text-black hover:bg-[#FFFFFF4D] hover:text-white"}>
  //                     <Checkbox
  //                       checked={checked}
  //                       onCheckedChange={() =>
  //                         setSelected((prev) => ({
  //                           ...prev,
  //                           [key]: toggleValue(prev[key], opt.value),
  //                         }))
  //                       }
  //                       className="mt-0.5 me-[24px] rounded-full border border-white"
  //                     />
  //                     {opt.icon && <img src={opt.icon} className="inline-block me-[16px]" />}
  //                     <span className="text-[18px] inline-block mb-[8px]">
  //                       {opt.label}
  //                     </span>
  //                     {opt.description && <p className="ms-[40px]">{opt.description}</p>}
  //                   </label>
  //                 );
  //               })}
  //             </div>
  //           </AccordionContent>
  //         </AccordionItem>
  //       </Accordion>

  //       <Separator className="bg-white !h-[0.5px] mt-[20px]" />
  //     </div>
  //   );
  // };

  const isRecordEmpty = (record: SelectedFilters) => {
    const values = Object.values(record);

    if (values.length === 0) return true;

    return values.every(arr => Array.isArray(arr) && arr.length === 0);
  };

  //check for selected gender filters then apply corresponding filter
  useEffect(() => {
    const isMaleSelected = activeAgeGroup.includes("adultsM") || activeAgeGroup.includes("teensM");
    const isFemaleSelected = activeAgeGroup.includes("adultsF") || activeAgeGroup.includes("teensF");
    const isUnisexSelected = activeAgeGroup.includes("uniS");
    const isMaleFiltered = selected.gender.includes("Male");
    const isFemaleFiltered = selected.gender.includes("Female");
    const isUnisexFiltered = selected.gender.includes("Unisex");

    if (isMaleSelected && !isMaleFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["gender"]: [...prev["gender"], "Male"],
      }));
    } else if (!isMaleSelected && isMaleFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["gender"]: prev["gender"].filter((v) => v !== "Male"),
      }));
    }

    if (isFemaleSelected && !isFemaleFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["gender"]: [...prev["gender"], "Female"],
      }));
    } else if (!isFemaleSelected && isFemaleFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["gender"]: prev["gender"].filter((v) => v !== "Female"),
      }));
    }

    if (isUnisexSelected && !isUnisexFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["gender"]: [...prev["gender"], "Unisex"],
      }))
    } else if (!isUnisexSelected && isUnisexFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["gender"]: prev["gender"].filter((v) => v !== "Unisex"),
      }))
    }

    if (activeAgeGroup.length == 0) {
      setSelected((prev) => ({
        ...prev,
        ["gender"]: [],
      }));
    }
  }, [activeAgeGroup]);

  useEffect(() => {
    const isAdultGendersSelected = activeAgeGroup.includes("adultsM") || activeAgeGroup.includes("adultsF") || activeAgeGroup.includes("uniS");
    const isTeenGendersSelected = activeAgeGroup.includes("teensM") || activeAgeGroup.includes("teensF") || activeAgeGroup.includes("uniS");
    const isAdultFiltered = selected.ageGroup.includes("Adults");
    const isTeenFiltered = selected.ageGroup.includes("Teens (11-13)") || selected.ageGroup.includes("Juniors (7-10)") || selected.ageGroup.includes("Kids (4-6)") || selected.ageGroup.includes("Babies (0-3)");

    if (activeAgeGroup.length == 0) {
      return;
    }

    if (isAdultGendersSelected && !isAdultFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["ageGroup"]: [...prev["ageGroup"], "Adults"],
      }));
    } else if (!isAdultGendersSelected && isAdultFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["ageGroup"]: prev["ageGroup"].filter((v) => v !== "Adults"),
      }));
    }
    if (isTeenGendersSelected && !isTeenFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["ageGroup"]: [...prev["ageGroup"], "Teens (11-13)", "Juniors (7-10)", "Kids (4-6)", "Babies (0-3)"],
      }));
    } else if (!isTeenGendersSelected && isTeenFiltered) {
      setSelected((prev) => ({
        ...prev,
        ["ageGroup"]: prev["ageGroup"].filter(
          (v) => v !== "Teens (11-13)" && 
          v !== "Juniors (7-10)" && 
          v !== "Kids (4-6)" &&
          v !== "Babies (0-3)"
        ),
      }));
    }
  }, [activeAgeGroup]);

  useEffect(() => {
    const adultsRemoved = !activeAgeGroup.includes("adultsM") && !activeAgeGroup.includes("adultsF") && !activeAgeGroup.includes("uniS");

    const teensRemoved = !activeAgeGroup.includes("teensM") && !activeAgeGroup.includes("teensF") && !activeAgeGroup.includes("uniS");

    if (adultsRemoved) {
      setSelected((prev) => ({
        ...prev,
        ["ageGroup"]: prev["ageGroup"].filter((v) => v !== "Adults"),
      }));
    } 

    if (teensRemoved) {
      setSelected((prev) => ({
        ...prev,
        ["ageGroup"]: prev["ageGroup"].filter(
          (v) => v !== "Teens (11-13)" && 
          v !== "Juniors (7-10)" && 
          v !== "Kids (4-6)" &&
          v !== "Babies (0-3)"
        ),
      }));
    }

  }, [activeAgeGroup]);

  //check if there are filter params on load then set the corresponding filters to active
  useEffect(() => {
    const map: Record<string, string> = {
      "attributes.LENS_TYPE": "lensType",
      "attributes.GENDER": "gender",
      "attributes.AGE_GROUP": "ageGroup",
      "attributes.FRAME_MATERIAL": "frameMaterial",
      "attributes.FRONT_FRAME_COLOR": "frameColour",
      "attributes.FRAME_SHAPE": "frameShape",
      "attributes.LENS_COLOR_DESCRIPTION": "lensColour",
      "attributes.FACE_COVERAGE": "faceCoverage",
      "attributes.BRIDGE_CHOICE": "bridgeChoice",
    };

    const params = new URLSearchParams(searchParams.toString());
    if (params) {
      for (const [key, value] of params.entries()) {
        value.split(",").map((val: string, index: number) => {
          if (key === "lang" || key === "category" || key === "page") return;
          if (key in map) {
            setSelected((prev) => ({
              ...prev,
              [map[key]]: prev[map[key] as keyof SelectedFilters].includes(val)
                ? [...prev[map[key] as keyof SelectedFilters]]
                : [...prev[map[key] as keyof SelectedFilters], val],
            }));
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (params) {
      if (params.get("attributes.AGE_GROUP")?.split(",").includes("Adults")) {
        if (params.get("attributes.GENDER")?.split(",").includes("Female")) {
          setActiveAgeGroup(
            (prevItems) => (prevItems.includes("adultsF") ? [...prevItems] : [...prevItems, "adultsF"]) // Add if missing
          );
        }
        if (params.get("attributes.GENDER")?.split(",").includes("Male")) {
          setActiveAgeGroup(
            (prevItems) => (prevItems.includes("adultsM") ? [...prevItems] : [...prevItems, "adultsM"]) // Add if missing
          );
        }
      }
      if (
        params.get("attributes.AGE_GROUP")?.split(",").includes("Teens (11-13)") ||
        params.get("attributes.AGE_GROUP")?.split(",").includes("Juniors (7-10)") ||
        params.get("attributes.AGE_GROUP")?.split(",").includes("Kids (4-6)") ||
        params.get("attributes.AGE_GROUP")?.split(",").includes("Babies (0-3)")
      ) {
        if (params.get("attributes.GENDER")?.split(",").includes("Female")) {
          setActiveAgeGroup(
            (prevItems) => (prevItems.includes("teensF") ? [...prevItems] : [...prevItems, "teensF"]) // Add if missing
          );
        }
        if (params.get("attributes.GENDER")?.split(",").includes("Male")) {
          setActiveAgeGroup(
            (prevItems) => (prevItems.includes("teensM") ? [...prevItems] : [...prevItems, "teensM"]) // Add if missing
          );
        }
      }
    }
  }, []);

  //get all products
  useEffect(() => {
    console.log(category);

    const apiString = category ? `/api/fetchProducts?lang=${lang ?? "en"}&category=${category}` : `/api/fetchProducts?lang=${lang ?? "en"}&category=products`

    fetch(apiString)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        //setProductCounts(json.count)
        setAllProducts(json.data);
      })
      .catch(() => ({
        category: category,
        count: 0
      }))
  }, []);

  //count number of results when selecting filter
  useEffect(() => {
    let productsToCount = allProducts;

    let currentProductCount = 0;

    let genderSelected = selected.gender.length > 0;

    productsToCount = productsToCount?.map((data) => {
      const related = data?.content?.related_products ?? [];
      const filteredRelated = related.filter((rp: any) => {
        const attrs = safeJsonParse(rp?.content?.local_settings?.code) ?? {};
        const lensType = String(attrs?.LENS_TYPE ?? "").toLowerCase();
        const gender = String(attrs?.GENDER ?? "").toLowerCase();
        const age = String(attrs?.AGE_GROUP ?? "").toLowerCase();
        const frameColor = String(attrs?.FRONT_FRAME_COLOR ?? "").toLowerCase();
        const frameShape = String(attrs?.FRAME_SHAPE ?? "").toLowerCase();
        const frameMaterial = String(attrs?.FRAME_MATERIAL ?? "").toLowerCase();
        const lensColor = String(attrs?.LENS_COLOR_DESCRIPTION ?? "").toLowerCase();

        const attrSet = new Set([lensType, frameShape, frameMaterial]);
        const frameColorSet = new Set([frameColor]);
        const lensColorSet = new Set([lensColor]);
        const ageGroupSet = new Set([age]);
        const genderGroupSet = new Set([gender]);

        const hasMatch = Object.values(selected).flat().some(value => attrSet.has(value.toLowerCase()));
        const frameColorMatch = Object.values(selected.frameColour).flat().some(value => frameColorSet.has(value.toLowerCase()));
        const lensColorMatch = Object.values(selected.lensColour).flat().some(value => lensColorSet.has(value.toLowerCase()));
        const ageGroupHasMatch = Object.values(selected.ageGroup).flat().some(value => ageGroupSet.has(value.toLowerCase()));
        const genderHasMatch = Object.values(selected.gender).flat().some(value => genderGroupSet.has(value.toLowerCase()));

        return hasMatch || frameColorMatch || lensColorMatch || (genderSelected ? ageGroupHasMatch && genderHasMatch : ageGroupHasMatch);
      });

      return {
        ...data,
        content: {
          ...data.content,
          related_products: filteredRelated,
        },
      };
    })?.filter((product) => product.content?.related_products?.length > 0);

    currentProductCount = productsToCount.length;

    setProductCounts(currentProductCount);

  }, [selected, allProducts]);

  useEffect(() => {
    setIsSelectedEmpty(isRecordEmpty(selected));
  }, [selected])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant={null} className={`inline-flex place-items-start gap-2 px-0 lg:gap-6 ${className ?? ""}`}>
          <Image src="/icons/plus-icon.svg" alt="plus icon" width={18} height={18} unoptimized />
          <div className="pt-1 hover:underline">
            <span>
              {triggerLabel} {searchParams.size !== 0 && resultsCount && resultsCount > 0 ? <span className="leading-none">{`(${resultsCount})`}</span> : null}
            </span>
          </div>
        </Button>
      </SheetTrigger>

      {/* TOP DRAWER (scrollable) */}
      <SheetContent side="right" className="h-full w-full bg-black! p-0 lg:max-w-[600px]!">
        {/* Capped height + flex layout so only the middle scrolls */}
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
          {/* Header (non-scroll) */}
          <div className="px-4 py-5 md:px-6">
            <SheetHeader className="space-y-1">
              <SheetTitle className="text-white md:text-lg"></SheetTitle>
            </SheetHeader>
          </div>

          <Separator />

          {/* Scroll Area (hides scrollbar) */}
          <div className="scrollbar-hide flex-1 overflow-x-hidden px-4 pt-0 pb-6 md:px-6">
            <div className="grid grid-cols-1 gap-0">
              {!checkLensCategory() && renderFilters("lensType", "col2", "col2")}
              {renderGenderFilters("gender", "col3", "col2")}
              {/* {renderAccordionFilters("ageGroup", 2, 2)} */}
              {renderAccordionFilters("frameMaterial", "col3", "col2")}
              {/* {renderAccordionFilters("faceCoverage", "col3", "col2")} */}
              {renderAccordionFilters("frameShape", "col3", "col2")}
              {/* {renderAccordionFilters("frameStyle", "col3", "col2")} */}
              {renderAccordionFilters("frameColour", "col3", "col2")}
              {renderAccordionFilters("lensColour", "col3", "col2", isEyeglassesCategory)}
              {/* {renderCheckBoxFilters("bridgeChoice")} */}
            </div>

            {/* Spacer so last items don't feel cramped near footer */}
            <div className="h-6" />
          </div>

          <Separator />

          {/* Footer actions (sticky because it's outside scroll area) */}
          <div className="px-6 py-6">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button
                variant="link"
                className="font-gt-america-expanded-bold cursor-pointer text-white underline underline-offset-1"
                onClick={clearAll}
              >
                RESET ALL
              </Button>

              <Button
                className="font-gt-america-expanded-bold w-full cursor-pointer rounded-none border border-white bg-white text-black no-underline! hover:bg-white hover:no-underline lg:w-auto"
                disabled={productCount > 0 && !isSelectedEmpty ? false : true}
                onClick={apply}
              >
                SEE RESULTS{productCount > 0 && !isSelectedEmpty && `(${productCount})`}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
