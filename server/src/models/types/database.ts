import { PagingInfo } from "./api";
import { WithId } from "mongodb";

export type DocumentWithId = WithId<Document>;

export interface Metadata {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface AggregationResult<T> {
  metadata: Metadata[];
  results: T[];
  paging?: PagingInfo;
}

export interface BaseFilters {
  pageNumber: number;
  pageSize: number;
}
