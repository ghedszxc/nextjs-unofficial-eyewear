import React from "react";
import { IFAQ } from "@/models/widgets/IFAQ";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import RichText from "@/components/RichText";

const Faq = ({ collectionTitle, collection }: IFAQ) => {
  return (
    <div>
      <div className="mt-32 w-[100%] text-center text-3xl font-bold">
        <h1>{collectionTitle}</h1>
      </div>
      <div className="ms-auto me-auto mt-24 max-w-200">
        {collection.map((item: any, index: number) => (
          <Accordion type="single" collapsible key={index}>
            <AccordionItem value="item-1">
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>
                <RichText
                  doc={{
                    type: item.description.doc.type,
                    content: item.description.doc.content,
                  }}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
};
export default Faq;
