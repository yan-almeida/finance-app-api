export type PagedList<T> = {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  items: T[];
};
