import { getStoryblokApi, refreshCacheIfStale, toStoryblokRequestError } from "@/lib/storyblok";
import { safeJsonParse } from "@/lib/utils";
import { StoryblokClient } from "@storyblok/react/rsc";
import console from "console";
import { NextResponse } from "next/server";
import { collectionCatalogs, CATEGORY_FILTERS, FILTER_VALUES, productCatalogs } from "@/constants/productPrefixQuery";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT as string;
  const mode = process.env.NEXT_PUBLIC_MODE as "preview" | "public";
  const per_page = Number(searchParams.get("per_page") ?? 100);
  const lang = searchParams.get("lang") as string;
  const category = searchParams.get("category")?.split(",").filter(Boolean);
  const firstCategory = category?.at(0) ?? "";
  const secondCategory = category?.at(1) ?? "";

  // Extract the active filter from category (if any)
  const activeFilter = category?.find((seg) => FILTER_VALUES.includes(seg as any)) ?? null;

  // Extract attributes (dot-notation)
  let attributes: Record<string, string> = {};

  // Dot-notation (?attributes.KEY=VALUE)
  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith("attributes.")) {
      const attrKey = key.replace("attributes.", "");
      attributes[attrKey] = value;
    }
  }

  const lens_type = attributes.LENS_TYPE;
  const gender = attributes.GENDER;
  const age_group = attributes.AGE_GROUP;
  const frame_material = attributes.FRAME_MATERIAL;
  const frame_colour = attributes.FRONT_FRAME_COLOR;
  const frame_shape = attributes.FRAME_SHAPE;
  const lens_color = attributes.LENS_COLOR_DESCRIPTION;
  const face_coverage = attributes.FACE_COVERAGE;
  const bridgeChoice = attributes.BRIDGE_CHOICE;
  const collection = attributes.COLLECTION;

  try {
    const storyblokApi: StoryblokClient = getStoryblokApi!();
    await refreshCacheIfStale();

    const version = mode === "preview" ? "draft" : "published";
    const baseParams: Record<string, unknown> = {
      content_type: "product",
      by_slugs: `grandvision/unofficial/${env}/${lang}/${firstCategory}/*`,
      filter_query: Object.fromEntries(
        Object.entries({
          related_products: { is: "not_empty_array" },
        }).filter(([_, value]: any) => value.in !== "")
      ),
      per_page,
      resolve_relations: "product.related_products",
      version,
    };

    const allStories: any[] = [];
    let page = 1;

    while (true) {
      const { data } = await storyblokApi.getStories({
        ...baseParams,
        page,
      });

      const stories = data?.stories ?? [];

      // Stop fetching when there are no products anymore
      if (stories.length === 0) break;

      allStories.push(...stories);

      // Also safe to stop when the page isn't full (means no more pages)
      if (stories.length < per_page) break;

      page += 1;
    }

    let filteredProducts = allStories;

    const matchedCatalog = productCatalogs.find((c) => c.productNameSegment === firstCategory);

    if (matchedCatalog?.variantFilter) {
      const { field, value } = matchedCatalog.variantFilter;
      const needles = (Array.isArray(value) ? value : [value]).map((v) => v.toLowerCase());

      filteredProducts = filteredProducts
        .map((story) => {
          const related = story?.content?.related_products ?? [];
          const filteredRelated = related.filter((rp: any) => {
            const attrs = safeJsonParse(rp?.content?.local_settings?.code) ?? {};
            return needles.includes(String(attrs?.[field] ?? "").toLowerCase());
          });
          return { ...story, content: { ...story.content, related_products: filteredRelated } };
        })
        .filter((p) => p.content?.related_products?.length);
    }

    const matchedCollection = collectionCatalogs.find(
      (c) => c.collectionRoute.toLowerCase() === secondCategory.toLowerCase()
    );

    // VARIANT-LEVEL FILTER (collection) — ONLY related_products
    if (matchedCollection) {
      const needle = matchedCollection.collectionNameSegment.toLowerCase();

      filteredProducts = filteredProducts
        ?.map((story) => {
          const related = story?.content?.related_products ?? [];

          const filteredRelated = related.filter((rp: any) => {
            const variantCollection = String(rp?.content?.collection ?? "").toLowerCase();
            return variantCollection === needle;
          });

          return {
            ...story,
            content: {
              ...story.content,
              related_products: filteredRelated,
            },
          };
        })
        ?.filter((product) => product.content?.related_products?.length);
    }

    //  MODEL-LEVEL FILTER (secondCategory, but only if not a category filter)
    if (!matchedCollection && secondCategory && !FILTER_VALUES.includes(secondCategory as any)) {
      const needle = secondCategory.toLowerCase();
      filteredProducts = filteredProducts?.filter((story) => {
        const attrs = safeJsonParse(story?.content?.local_settings?.code) ?? {};
        return Object.values(attrs).some((value) => String(value).toLowerCase() === needle);
      });
    }

    // CATEGORY FILTER APPLICATION (gender, new, best-seller)
    if (activeFilter && activeFilter !== "prod") {
      const filterConfig = CATEGORY_FILTERS[activeFilter as keyof typeof CATEGORY_FILTERS];

      if (filterConfig?.storyblokField) {
        const expectedValue = filterConfig.value;

        // MODEL-LEVEL FILTER (for gender: male, female, unisex)
        // Filters the main product model - all variants inherit the gender
        if (filterConfig.filterType === "model") {
          filteredProducts = filteredProducts?.filter((story) => {
            const attrs = safeJsonParse(story?.content?.local_settings?.code) ?? {};
            const attrValue = String(attrs?.[filterConfig.storyblokField ?? ""] ?? "").toLowerCase();

            // Check primary attribute
            let primaryMatch = false;
            if (Array.isArray(expectedValue)) {
              primaryMatch = expectedValue.some((v) => String(v).toLowerCase() === attrValue);
            } else {
              primaryMatch = attrValue === String(expectedValue).toLowerCase();
            }

            // Check additional constraint if specified
            if (primaryMatch && filterConfig.additionalStoryblokField && filterConfig.additionalValue) {
              const additionalAttrValue = String(attrs?.[filterConfig.additionalStoryblokField] ?? "").toLowerCase();
              const additionalExpectedValue = String(filterConfig.additionalValue).toLowerCase();
              return additionalAttrValue === additionalExpectedValue;
            }

            return primaryMatch;
          });
        }

        // VARIANT-LEVEL FILTER (for status: new, best-seller)
        // Filters only the related_products (variants) that match STATUS_N1_26
        if (filterConfig.filterType === "variant") {
          filteredProducts = filteredProducts
            ?.map((story) => {
              const related = story?.content?.related_products ?? [];

              const filteredRelated = related.filter((rp: any) => {
                const attrs = safeJsonParse(rp?.content?.local_settings?.code) ?? {};
                const status = String(attrs?.[filterConfig.storyblokField ?? ""] ?? "").trim();
                return status === expectedValue;
              });

              return {
                ...story,
                content: {
                  ...story.content,
                  related_products: filteredRelated,
                },
              };
            })
            // only keep model products that still have variants after filtering
            ?.filter((product) => product.content?.related_products?.length);
        }
      }
    }

    // VARIANT-LEVEL FILTER — ONLY related_products
    let productsToFilter = filteredProducts

    if (lens_type || gender || age_group || frame_material || frame_colour || frame_shape || lens_color || face_coverage || bridgeChoice) {
      let genderSelected = gender;

      const transformedAttr = Object.fromEntries(
        Object.entries(attributes).map(([key, value]) => {
          const newValue = typeof value === 'string' ? value.split(',') : value;
          return [key, newValue];
        })
      );

      productsToFilter = productsToFilter?.map((story) => {
        const related = story?.content?.related_products ?? [];

        const filteredRelated = related.filter((rp: any) => {
          const attrs = safeJsonParse(rp?.content?.local_settings?.code) ?? {};
          const lensTypeAttr = String(attrs?.LENS_TYPE ?? "").toLowerCase();
          const genderAttr = String(attrs?.GENDER ?? "").toLowerCase();
          const ageAttr = String(attrs?.AGE_GROUP ?? "").toLowerCase();
          const frameColorAttr = String(attrs?.FRONT_FRAME_COLOR ?? "").toLowerCase();
          const frameShapeAttr = String(attrs?.FRAME_SHAPE ?? "").toLowerCase();
          const frameMaterialAttr = String(attrs?.FRAME_MATERIAL ?? "").toLowerCase();
          const lensColorAttr = String(attrs?.LENS_COLOR_DESCRIPTION ?? "").toLowerCase();

          const attrSet = new Set([lensTypeAttr, frameShapeAttr, frameMaterialAttr]);
          const frameColorSet = new Set([frameColorAttr]);
          const lensColorSet = new Set([lensColorAttr])
          const ageGroupSet = new Set([ageAttr]);
          const genderSet = new Set([genderAttr]);

          const hasMatch = Object.values(transformedAttr).flat().some(value => attrSet.has(value.toLowerCase()));
          const frameColorMatch = transformedAttr?.FRONT_FRAME_COLOR
            ? Object.values(transformedAttr?.FRONT_FRAME_COLOR).flat().some(value => frameColorSet.has(value.toLowerCase()))
            : false;
          const lensColorMatch = transformedAttr?.LENS_COLOR_DESCRIPTION
            ? Object.values(transformedAttr?.LENS_COLOR_DESCRIPTION).flat().some(value => lensColorSet.has(value.toLowerCase()))
            : false;
          const ageGroupHasMatch = Object.values(transformedAttr).flat().some(value => ageGroupSet.has(value.toLowerCase()));
          const genderHasMatch = Object.values(transformedAttr).flat().some(value => genderSet.has(value.toLowerCase()));

          return hasMatch || frameColorMatch || lensColorMatch || (genderSelected ? ageGroupHasMatch && genderHasMatch : ageGroupHasMatch);
        });

        return {
          ...story,
          content: {
            ...story.content,
            related_products: filteredRelated,
          },
        };
      })?.filter((product) => product.content?.related_products?.length > 0);
    }
    // if (lens_type) {
    //   const needles = lens_type
    //     .split(",")
    //     .map((c) => c.trim().toLowerCase())
    //     .filter(Boolean);

    //   console.log(needles);

    //   filteredProducts = filteredProducts
    //     ?.map((story) => {
    //       const related = story?.content?.related_products ?? [];

    //       const filteredRelated = related.filter((rp: any) => {
    //         const attrs = safeJsonParse(rp?.content?.local_settings?.code) ?? {};
    //         const type = String(attrs?.LENS_TYPE ?? "").toLowerCase();

    //         return needles.includes(type);
    //       });

    //       return {
    //         ...story,
    //         content: {
    //           ...story.content,
    //           related_products: filteredRelated,
    //         },
    //       };
    //     })
    //     // only keep model products that still have variants after filtering
    //     ?.filter((product) => product.content?.related_products?.length);
    // }
    // if (gender) {
    //   const needles = gender
    //     .split(",")
    //     .map((c) => c.trim().toLowerCase())
    //     .filter(Boolean);

    //   console.log(needles);

    //   filteredProducts = filteredProducts
    //     ?.map((story) => {
    //       const related = story?.content?.related_products ?? [];

    //       const filteredRelated = related.filter((rp: any) => {
    //         const attrs = safeJsonParse(rp?.content?.local_settings?.code) ?? {};
    //         const choice = String(attrs?.GENDER ?? "").toLowerCase();

    //         return needles.includes(choice);
    //       });

    //       return {
    //         ...story,
    //         content: {
    //           ...story.content,
    //           related_products: filteredRelated,
    //         },
    //       };
    //     })
    //     // only keep model products that still have variants after filtering
    //     ?.filter((product) => product.content?.related_products?.length);
    // }
    // if (age_group) {
    //   const needles = age_group
    //     .split(",")
    //     .map((c) => c.trim().toLowerCase())
    //     .filter(Boolean);

    //   console.log(needles);

    //   filteredProducts = filteredProducts
    //     ?.map((story) => {
    //       const related = story?.content?.related_products ?? [];

    //       const filteredRelated = related.filter((rp: any) => {
    //         const attrs = safeJsonParse(rp?.content?.local_settings?.code) ?? {};
    //         const age = String(attrs?.AGE_GROUP ?? "").toLowerCase();

    //         return needles.includes(age);
    //       });

    //       return {
    //         ...story,
    //         content: {
    //           ...story.content,
    //           related_products: filteredRelated,
    //         },
    //       };
    //     })
    //     // only keep model products that still have variants after filtering
    //     ?.filter((product) => product.content?.related_products?.length);
    // }
    // if (frame_material) {
    //   const needles = frame_material
    //     .split(",")
    //     .map((c) => c.trim().toLowerCase())
    //     .filter(Boolean);

    //   console.log(needles);

    //   filteredProducts = filteredProducts
    //     ?.map((story) => {
    //       const related = story?.content?.related_products ?? [];

    //       const filteredRelated = related.filter((rp: any) => {
    //         const attrs = safeJsonParse(rp?.content?.local_settings?.code) ?? {};
    //         const material = String(attrs?.FRAME_MATERIAL ?? "").toLowerCase();

    //         return needles.includes(material);
    //       });

    //       return {
    //         ...story,
    //         content: {
    //           ...story.content,
    //           related_products: filteredRelated,
    //         },
    //       };
    //     })
    //     // only keep model products that still have variants after filtering
    //     ?.filter((product) => product.content?.related_products?.length);
    // }
    // if (frame_colour) {
    //   const needles = frame_colour
    //     .split(",")
    //     .map((c) => c.trim().toLowerCase())
    //     .filter(Boolean);

    //   console.log(needles);

    //   filteredProducts = filteredProducts
    //     ?.map((story) => {
    //       const related = story?.content?.related_products ?? [];

    //       const filteredRelated = related.filter((rp: any) => {
    //         const attrs = safeJsonParse(rp?.content?.local_settings?.code) ?? {};
    //         const color = String(attrs?.FRONT_FRAME_COLOR ?? "").toLowerCase();

    //         return needles.includes(color);
    //       });

    //       return {
    //         ...story,
    //         content: {
    //           ...story.content,
    //           related_products: filteredRelated,
    //         },
    //       };
    //     })
    //     // only keep model products that still have variants after filtering
    //     ?.filter((product) => product.content?.related_products?.length);
    // }
    // if (frame_shape) {
    //   const needles = frame_shape
    //     .split(",")
    //     .map((c) => c.trim().toLowerCase())
    //     .filter(Boolean);

    //   console.log(needles);

    //   filteredProducts = filteredProducts
    //     ?.map((story) => {
    //       const related = story?.content?.related_products ?? [];

    //       const filteredRelated = related.filter((rp: any) => {
    //         const attrs = safeJsonParse(rp?.content?.local_settings?.code) ?? {};
    //         const shape = String(attrs?.FRAME_SHAPE ?? "").toLowerCase();

    //         return needles.includes(shape);
    //       });

    //       return {
    //         ...story,
    //         content: {
    //           ...story.content,
    //           related_products: filteredRelated,
    //         },
    //       };
    //     })
    //     // only keep model products that still have variants after filtering
    //     ?.filter((product) => product.content?.related_products?.length);
    // }
    // if (lens_color) {
    //   const needles = lens_color
    //     .split(",")
    //     .map((c) => c.trim().toLowerCase())
    //     .filter(Boolean);

    //   console.log(needles);

    //   filteredProducts = filteredProducts
    //     ?.map((story) => {
    //       const related = story?.content?.related_products ?? [];

    //       const filteredRelated = related.filter((rp: any) => {
    //         const attrs = safeJsonParse(rp?.content?.local_settings?.code) ?? {};
    //         const color = String(attrs?.LENS_COLOR_DESCRIPTION ?? "").toLowerCase();

    //         return needles.includes(color);
    //       });

    //       return {
    //         ...story,
    //         content: {
    //           ...story.content,
    //           related_products: filteredRelated,
    //         },
    //       };
    //     })
    //     // only keep model products that still have variants after filtering
    //     ?.filter((product) => product.content?.related_products?.length);
    // }
    // if (face_coverage) {
    //   const needles = face_coverage
    //     .split(",")
    //     .map((c) => c.trim().toLowerCase())
    //     .filter(Boolean);

    //   console.log(needles);

    //   filteredProducts = filteredProducts
    //     ?.map((story) => {
    //       const related = story?.content?.related_products ?? [];

    //       const filteredRelated = related.filter((rp: any) => {
    //         const attrs = safeJsonParse(rp?.content?.local_settings?.code) ?? {};
    //         const coverage = String(attrs?.FACE_COVERAGE ?? "").toLowerCase();

    //         return needles.includes(coverage);
    //       });

    //       return {
    //         ...story,
    //         content: {
    //           ...story.content,
    //           related_products: filteredRelated,
    //         },
    //       };
    //     })
    //     // only keep model products that still have variants after filtering
    //     ?.filter((product) => product.content?.related_products?.length);
    // }
    // if (bridgeChoice) {
    //   const needles = bridgeChoice
    //     .split(",")
    //     .map((c) => c.trim().toLowerCase())
    //     .filter(Boolean);

    //   console.log(needles);

    //   filteredProducts = filteredProducts
    //     ?.map((story) => {
    //       const related = story?.content?.related_products ?? [];

    //       const filteredRelated = related.filter((rp: any) => {
    //         const attrs = safeJsonParse(rp?.content?.local_settings?.code) ?? {};
    //         const choice = String(attrs?.BRIDGE_CHOICE ?? "").toLowerCase();

    //         return needles.includes(choice);
    //       });

    //       return {
    //         ...story,
    //         content: {
    //           ...story.content,
    //           related_products: filteredRelated,
    //         },
    //       };
    //     })
    //     // only keep model products that still have variants after filtering
    //     ?.filter((product) => product.content?.related_products?.length);
    // }

    return NextResponse.json(
      {
        success: true,
        attributes: {
          ...attributes,
          CATEGORIES: category?.join(","),
          ACTIVE_FILTER: activeFilter,
        },
        count: productsToFilter?.length,
        data: productsToFilter,
        pagesFetched: page,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching stories:", error);
    // Preserve the real upstream status (404 vs 429/5xx) so a transient
    // Storyblok failure isn't misreported as a client-error 400.
    const requestError = toStoryblokRequestError(error);
    return NextResponse.json(
      {
        success: false,
        error: requestError.message,
      },
      { status: requestError.statusCode }
    );
  }
}
