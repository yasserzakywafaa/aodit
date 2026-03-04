export interface Integrations {
  wordPress: IntegrationWordPress[]; // Support multiple WordPress sites
  ghost: IntegrationGhost;
}

export interface IntegrationBaseParams {
  isIntegrated: boolean;
  isWebsiteValid: boolean;
  autoPublish: boolean;
}

// Integration WordPress
export interface IntegrationWordPress extends IntegrationBaseParams {
  id: string;
  label?: string;
  credentials: IntegrationWordpressCredentials;
}

export type IntegrationWordPressPostStatus =
  | "publish"
  | "draft"
  | "pending"
  | "private"
  | "future";
export type IntegrationWordPressPostFormat =
  | "standard"
  | "aside"
  | "chat"
  | "gallery"
  | "link"
  | "image"
  | "quote"
  | "status"
  | "video"
  | "audio";
export type IntegrationWordPressCommentStatus = "open" | "closed";
export type IntegrationWordPressPingStatus = "open" | "closed";

export interface IntegrationWordpressCredentials {
  websiteUrl: string;
  username: string;
  password: string;
}

export interface PublishToWordPressPayload {
  credentials: IntegrationWordpressCredentials;
  content: PublishToWordPressPayloadContent;
}

export interface PublishToWordPressPayloadContent {
  // Required fields
  title: string;
  content: string;
  status: IntegrationWordPressPostStatus;

  // Optional fields from WordPress REST API
  date?: string; // ISO8601 datetime format
  date_gmt?: string; // ISO8601 datetime format
  slug?: string;
  password?: string;
  author?: number; // Author ID
  excerpt?: string;
  featured_media?: number; // Featured media ID
  comment_status?: IntegrationWordPressCommentStatus;
  ping_status?: IntegrationWordPressPingStatus;
  format?: IntegrationWordPressPostFormat;
  meta?: Record<string, any>; // Meta fields object
  sticky?: boolean;
  template?: string;
  categories?: number[]; // Array of category IDs
  tags?: number[]; // Array of tag IDs
  // Custom field for language-country prefix (e.g., "de-de")
  // Used to create WordPress category for /%category%/%postname% permalink structure
  languageCountry?: string;
}

export interface PublishToWordPressResponse {
  isPublished: boolean;
  link: string;
  id: string;
  status: string;
  type: IntegrationWordPressPostStatus;
}

// Integration Ghost
export interface IntegrationGhost extends IntegrationBaseParams {
  credentials: IntegrationGhostCredentials;
}

export type IntegrationGhostPostStatus = "published" | "draft" | "scheduled";
export interface IntegrationGhostCredentials {
  websiteUrl: string;
  apiKey: string;
}

export interface PublishToGhostPayload {
  credentials: IntegrationGhostCredentials;
  content: {
    title: string;
    content: string;
    status: IntegrationGhostPostStatus;
  };
}

export interface PublishToGhostResponse {
  isPublished: boolean;
  link: string;
  id: string;
  status: string;
  type: IntegrationGhostPostStatus;
}
