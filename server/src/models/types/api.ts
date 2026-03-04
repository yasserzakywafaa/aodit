export interface PageResponse<TResult> {
  results: TResult[];
  paging: PagingInfo;
}

export interface PageErrorResponse<TResult> {
  message: TResult;
}

export interface PagingInfo {
  pageNumber?: number;
  pageSize?: number;
  totalCount?: number;
  totalPagesCount?: number;
}
