export interface ILocatorConfig {
  /**
   * The ID selector of the element in which the widget will be rendered
   */
  selector: string;

  /**
   * The locale of the widget
   */
  locale: string;

  /**
   * The tenant key of the widget
   */
  tenantKey: string;

  /**
   * The tenant key override for store search (If not present, tenantKey will be used)
   */
  tenantKeyDataOverride?: string;

  /**
   * The flag to skip the tenant redirection
   */
  skipRedirect?: boolean;

  /**
   * The widget options to enable/disable certain features (If not present, default options from backend will be used)
   */
  options?: ILocatorTenantOptions;

  /**
   * The translation labels (If not present, default translations from backend will be used)
   */
  labels?: ILocatorTranslation;

  /**
   * Callback executed on search action
   */
  onSearch?: (data?: Object) => void;

  /**
   * Callback executed on use my location action
   */
  onSearchUserLocation?: () => void;

  /**
   * Callback executed on nearby action
   */
  onSearchNearby?: () => void;

  /**
   * Callback executed on results page change
   */
  onPageChange?: (page: number) => void;

  /**
   * Callback executed on filters clear action
   */
  onFiltersClear?: () => void;

  /**
   * Callback executed on filters apply action
   */
  onFiltersApply?: (filters: Object) => void;

  /**
   * Callback executed on practice card click
   */
  onPracticeClick?: (data: Object) => void;

  /**
   * Callback executed on practice card book now click
   */
  onPracticeBookApptClick?: () => void;

  /**
   * Callback executed on practice card get directions click
   */
  onPracticeGetDirectionsClick?: () => void;

  /**
   * Callback executed on practice card call now click
   */
  onPracticeCallNowClick?: () => void;

  /**
   * Callback executed on store details book now click
   */
  onDetailsBookApptClick?: () => void;

  /**
   * Callback executed on store details get directions click
   */
  onDetailsGetDirectionsClick?: () => void;

  /**
   * Callback executed on store details call now click
   */
  onDetailsCallNowClick?: () => void;

  /**
   * Callback executed on store details website click
   */
  onDetailsWebsiteClick?: () => void;

  /**
   * Callback executed on store details close
   */
  onDetailsClose?: () => void;

  /**
   * Callback executed on map pin click
   */
  onMapPinClick?: (data: Object) => void;

  /**
   * Callback executed upon completed geo redirection
   */
  onGeoRedirect?: (success: boolean, tenantKey: string, locale: string) => void;
}

export interface ILocatorTenantOptions {
  /**
   * The Google Maps API key
   */
  google_maps_api_key: string;

  /**
   * The Google Maps style identifier
   *
   */
  enable_custom_map_style: string;

  /**
   * The Google Maps Places suggestions region constraint
   */
  country_geo_constraint: string[];

  /**
   * The Google Maps Places suggestion types (If not present, default values will be used)
   *
   * @default: ["locality", "administrative_area_level_3", "postal_code", "street_address", "neighborhood"]
   *
   * reference: https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingAddressTypes
   */
  google_maps_suggestion_types: string;

  /**
   * The Google Maps Places suggestion limit (If not present, default value will be used)
   *
   * @default: 5
   */
  google_maps_suggestion_limit: number;

  /**
   * The Azure Cognitive Search suggestions limit (If not present, default value will be used)
   *
   * @default: 10
   */
  search_suggestions_limit: number;

  /**
   * The flag to disable the chain search
   */
  disable_chain_search: boolean;

  /**
   * The show search icon flag
   */
  show_search_icon: boolean;

  /**
   * The show clear icon flag
   */
  show_search_clear_button: boolean;

  /**
   * The store results per page
   */
  results_per_page: number;

  /**
   * The order in which the search filters will render (If not present, default order will be used)
   *
   * @default: ["Online Booking", "Essilor Expert", "Distance", "Brands"]
   */
  search_filter_order: string[];

  /**
   * The default search distance radius
   */
  search_distance_radius: number;

  /**
   * The distance filter midpoint value (If not present, midpoint will be calculated in FE)
   */
  use_distance_midpoint: number;

  /**
   * The distance in imperial units flag
   */
  show_distance_in_imperial_units: boolean;

  /**
   * The flag to hide the online booking toggle filter
   */
  hide_online_booking_toggle_filter: boolean;

  /**
   * The show book now flag
   */
  show_book_now: boolean;

  /**
   * The flag to disable retail booking
   */
  disable_retail_booking: boolean;

  /**
   * The show expert badges flag
   */
  show_expert_badges: boolean;

  /**
   * The show expert badge offers flag
   */
  enable_eexpert_badge_to_offer: boolean;

  /**
   * The flag to hide city and province in addresses
   */
  hide_city_province: boolean;

  /**
   * The flag to expand the opening hours by default
   */
  show_default_expanded_opening_hours: number;

  /**
   * The right-to-left orientation flag
   */
  enable_rtl_orientation: boolean;

  /**
   * The skip geo redirect flag (If present, this will override the widget config's skipRedirect flag)
   */
  use_skip_redirect: boolean;

  /**
   * The flag to disable marker clustering
   */
  disable_marker_cluster: boolean;

  /**
   * The flag to enable dynamic area search
   */
  use_dynamic_area_search: boolean;

  /**
   * The flag the enable the center marker
   */
  use_center_marker: boolean;
}

export interface ILocatorTranslation {
  text_landing_headline: string | null;
  text_landing_description: string | null;
  text_address_placeholder: string | null;
  text_results_description: string | null;
  text_results_address_placeholder: string | null;
  text_use_location: string | null;
  text_nearby: string | null;
  text_search_this_area: string | null;
  text_search_by_chain_stores: string | null;
  text_no_results: string | null;
  text_no_results_sub: string | null;
  text_showing_stores: string | null;
  text_back_to_results: string | null;
  text_filters: string | null;
  text_filter_clear: string | null;
  text_apply: string | null;
  text_kilometer_unit: string | null;
  text_miles_unit: string | null;
  text_online_booking: string | null;
  text_online_booking_description: string | null;
  text_essilor_expert: string | null;
  text_essilor_expert_description: string | null;
  text_distance: string | null;
  text_distance_description: string | null;
  text_offers: string | null;
  text_offers_description: string | null;
  text_segments: string | null;
  text_segments_description: string | null;
  text_brands: string | null;
  text_brands_description: string | null;
  text_products: string | null;
  text_products_description: string | null;
  text_services: string | null;
  text_services_description: string | null;
  text_frames: string | null;
  text_frames_description: string | null;
  text_languages: string | null;
  text_languages_description: string | null;
  text_multi_pair_offer: string | null;
  text_book_now: string | null;
  text_book_exam: string | null;
  text_try_demo: string | null;
  text_booking_request_appointment: string | null;
  text_get_directions: string | null;
  text_eyecare_center_and_doctors: string | null;
  text_view_eyecare_center: string | null;
  text_meet_the_eye_doctor: string | null;
  text_call_now: string | null;
  text_contact_us: string | null;
  text_opening_hours: string | null;
  text_optician_offer_opening_hours_Sunday: string | null;
  text_optician_offer_opening_hours_Monday:  string | null;
  text_optician_offer_opening_hours_Tuesday:  string | null;
  text_optician_offer_opening_hours_Wednesday:  string | null;
  text_optician_offer_opening_hours_Thursday:  string | null;
  text_optician_offer_opening_hours_Friday:  string | null;
  text_optician_offer_opening_hours_Saturday:  string | null;
  text_open_now: string | null;
  text_closed: string | null;
  text_closes: string | null;
  text_today: string | null;
  text_insurance: string | null;
  text_current_offers: string | null;
  text_about: string | null;
  text_enable_location_to_use_this_function: string | null;
}