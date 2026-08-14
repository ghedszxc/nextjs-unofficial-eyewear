type Language = "en" | "fr" | "de" | "nl" | "es" | "pt" | "pl" | "hu" | "it" | "tr" | "sv";

type PageProps = {
  params: Promise<{
    lang: lang;
    route?: string[];
  }>;
  searchParams: Promise<Record<string, string>>;
};

type FetchStoriesParams = {
  slugs?: string;
  content_type?: string;
  relations?: string[];
  per_page?: number;
  page?: number;
  sort_by?: string;
  preview?: boolean;
  language?: Language;
  by_uuids?: string;
  by_uuids_ordered?: string;
  by_slugs?: string;
  starts_with?: string;
  with_tag?: string;
};

// Base shape for all action responses (success or error)
type ActionResponse<T = null> = {
  success: boolean; // Indicates if the action succeeded or failed
  data?: T; // Returned data when successful
  error?: {
    // Error details when unsuccessful
    message: string; // Main error message
    details?: Record<string, string[]>;
  };
  status?: number; // Optional HTTP-like status code
};

// Response type for successful actions (forces success: true)
type SuccessResponse<T = null> = ActionResponse<T> & { success: true };

// Response type for failed actions (forces success: false)
type ErrorResponse = ActionResponse<undefined> & { success: false };

// Next.js API response specifically for error responses
type APIErrorResponse = NextResponse<ErrorResponse>;

// Next.js API response for success OR error responses
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;
