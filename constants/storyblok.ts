export const ROOT_FOLDER = "grandvision";
export const SITE_NAME = "unofficial";
export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT as "int" | "uat" | "prod";

// Helper to generate root path dynamically
export const getStoryblokRoot = () => `${ROOT_FOLDER}/${SITE_NAME}/${ENVIRONMENT}`;

export const PLACEMENTS_HEADER_DDM = ["header_ddm_first_column", "header_ddm_second_column", "header_ddm_third_column"];

export const PLACEMENTS_MAIN = [
  "before_breadcrumb",
  "main_placement_1",
  "main_placement_2",
  "main_placement_3",
  "main_placement_4",
  "main_placement_5",
  "main_placement_6",
  "main_placement_7",
  "main_placement_8",
  "main_placement_9",
  "main_placement_10",
  "main_placement_11",
  "main_placement_12",
  "main_placement_13",
  "main_placement_14",
  "main_placement_15",
  "before_footer",
];

export const PLACEMENTS_FOOTER = [
  "footer_newsletter",
  "footer_newsletter_overlay",
  "footer_navigation",
  "footer_cross_site_links",
  "footer_copyright",
  "footer_checkout",
];
