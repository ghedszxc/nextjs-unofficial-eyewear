import Image from "next/image";
import Link from "next/link";
import RichText from "../RichText";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoryblokRichTextNodeTypes } from "@storyblok/react";
import { ISplitBanner } from "@/models/widgets/ISplitBanner";
import { imageSizes } from "@/lib/image-sizes";

const SplitBanner = (bannerProps: ISplitBanner) => {
  const { layout_variant, image, title, body, subtext, cta, background_color, tabs } = bannerProps;
  const isRight = layout_variant === "split-right";
  const isDark = background_color === "#000000";

  return (
    <div className={`flex flex-col ${isRight ? "lg:flex-row-reverse" : "lg:flex-row"} overflow-hidden lg:h-[720px]`}>
      {/* Image */}
      <div className={`relative h-[375px] w-full lg:h-full lg:w-1/2 ${isDark ? "border-white" : "border-black"}`}>
        {image?.mobile?.src && (
          <Image
            className="object-cover lg:hidden"
            src={image.mobile.src}
            alt={image.mobile.alt ?? ""}
            fill
            sizes={imageSizes({ base: "100vw", lg: "50vw" })}
            
          />
        )}
        {image?.desktop?.src && (
          <Image
            className="hidden object-cover lg:block"
            src={image.desktop.src}
            alt={image.desktop.alt ?? ""}
            fill
            sizes={imageSizes({ base: "100vw", lg: "50vw" })}
            
          />
        )}
      </div>

      {/* Content */}
      <div
        className={`w-full lg:w-1/2 bg-[${background_color}] ${isRight ? "lg:border-r lg:border-black" : "lg:border-l lg:border-black"} ${isDark ? "text-white" : "text-black"}`}
      >
        <div className="flex h-full flex-col justify-between gap-6 px-6 py-10 lg:p-10">
          {tabs?.length ? (
            /* render tabs (if present) */
            <Tabs defaultValue={tabs[0].key} className="min-h-40">
              <TabsList className="flex gap-6 bg-transparent p-0">
                {tabs.map((t) => (
                  <TabsTrigger
                    key={t.key}
                    value={t.key}
                    className="font-gt-america-expanded-bold cursor-pointer rounded-none bg-transparent px-0 pt-0 pb-1 text-sm uppercase underline-offset-1 data-[state=active]:bg-transparent data-[state=active]:underline data-[state=active]:shadow-none!"
                  >
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((t) => (
                <TabsContent key={t.key} value={t.key} className="flex flex-col gap-6 pt-10">
                  {t.title && <h3 className="font-gt-america-standard-light text-4xl font-light">{t.title}</h3>}
                  {t.body && <p className="font-gt-america-standard-light text-base font-light">{t.body}</p>}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="flex flex-col gap-4">
              {title && <h3 className="font-gt-america-expanded-bold text-lg uppercase">{title}</h3>}
              {body?.doc && (
                <RichText
                  doc={body.doc}
                  className={{ p: "font-gt-america-standard-light text-3xl font-light lg:text-4xl" }}
                />
              )}

              {subtext?.doc && (
                <RichText doc={subtext.doc} className={{ p: "font-gt-america-standard-light text-base font-light" }} />
              )}
            </div>
          )}

          {cta?.href && (
            <Button
              asChild
              className={`flex w-full items-center rounded-none border bg-transparent px-8 py-6 hover:bg-[#0000004D] lg:w-fit ${isDark ? "border-white" : "border-black"}`}
            >
              <Link href={cta.href} className="text-sm">
                <span className={`font-gt-america-expanded-bold ${isDark ? "text-white" : "text-black"} uppercase`}>
                  {cta.text}
                </span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SplitBanner;