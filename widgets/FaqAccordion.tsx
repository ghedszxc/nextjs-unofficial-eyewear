"use client";

import React, { useId, useEffect, useState } from "react";
import { IFaqAccordion } from "@/models/widgets/IFaqAccordion";
import { useSearch } from "@/context/SearchContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import RichText from "@/components/RichText";

function stripEmptyParagraphs(nodes: any[]): any[] {
  return nodes
    .filter((node: any) => {
      if (node.type !== "paragraph") return true;
      if (!node.content || node.content.length === 0) return false;
      return node.content.some((child: any) => child.text && child.text.trim().length > 0);
    })
    .map((node: any) => {
      if (node.content && Array.isArray(node.content)) {
        return { ...node, content: stripEmptyParagraphs(node.content) };
      }
      return node;
    });
}

const FaqAccordion = ({ collectionTitle, items, pb }: IFaqAccordion) => {
  const { isSearching, searchQuery, updateAccordionState, updateSearchResults } =
    useSearch();
  const accordionId = useId();
  const [openItem, setOpenItem] = useState<string>("");

  // Close this accordion when another accordion opens an item
  useEffect(() => {
    const handleOtherOpen = (e: Event) => {
      const { sourceId } = (e as CustomEvent).detail;
      if (sourceId !== accordionId) setOpenItem("");
    };

    window.addEventListener("faq-accordion-open", handleOtherOpen);
    return () => window.removeEventListener("faq-accordion-open", handleOtherOpen);
  }, [accordionId]);

  const handleValueChange = (value: string) => {
    setOpenItem(value);
    updateAccordionState(accordionId, !!value);
    if (value) {
      window.dispatchEvent(
        new CustomEvent("faq-accordion-open", { detail: { sourceId: accordionId } })
      );
    }
  };

  const displayItems =
    isSearching && items
      ? items.filter((item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase().trim())
        )
      : items;

  useEffect(() => {
    if (isSearching) {
      updateSearchResults(accordionId, displayItems.length > 0);
    } else {
      updateSearchResults(accordionId, false);
    }
  }, [isSearching, searchQuery, displayItems.length, accordionId, updateSearchResults]);

  if (!items || items.length === 0) return null;
  if (isSearching && displayItems.length === 0) return null;

  return (
    <section
      className={`bg-white px-8 lg:px-20 ${pb ? "pt-8" : "py-8"} text-black`}
      style={pb ? { paddingBottom: pb } : undefined}
    >
      <div className="max-w-9xl">
        {collectionTitle && (
          <h3 className="font-gt-america-expanded-bold font-bold text-2xl py-8 lg:text-3xl uppercase ">
            {collectionTitle}
          </h3>
        )}

        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={openItem}
          onValueChange={handleValueChange}
        >
          {displayItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-black last:border-b"
            >
              <AccordionTrigger className="font-gt-america-standard-light font-light cursor-pointer py-4  hover:no-underline [&>svg]:text-black lg:text-3xl ">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="my-4 prose max-w-none prose-li:marker:text-black prose-p:my-0 lg:px-20 lg:pb-4">
                <RichText
                  doc={{
                    type: item.answer.doc.type,
                    content: stripEmptyParagraphs(item.answer.doc.content),
                  }}
                  className={{
                    p: "font-gt-america-standard-light text-base text-black leading-relaxed py-0 lg:text-lg",
                  }}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqAccordion;
