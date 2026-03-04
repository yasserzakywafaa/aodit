export interface ApiRequestParams {
  filters?: string;
  pageSize?: number;
  pageNumber?: number;
}

export interface ApiResponse<TResult> {
  results: TResult;
}

export interface ApiResponseWithPaging<TResult> {
  results: TResult;
  paging: PagingInfo;
}

export interface PagingInfo {
  pageNumber: number;
  pageSize: number;
  totalCount?: number;
  totalPagesCount?: number;
}

export interface UserName {
  givenName: string;
  familyName: string;
}

export interface Testimonial {
  author: string;
  authorTitle?: string;
  reviewBody: string;
  rating: number;
  datePublished?: Date | string;
}

export type AuthType = "register" | "login";

export enum LoaderVariantEnum {
  Dots = "dots",
  CircularProgress = "circular-progress",
  SplittingRectangle = "splitting-rectangle",
}

export enum LoaderSizeEnum {
  Small = "small",
  Medium = "medium",
  Large = "large",
}
