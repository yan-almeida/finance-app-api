import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { SelectQueryBuilder } from 'typeorm';
import { PagedList } from '../@types/PagedList';

export const pagedList = async <T = any>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions
): Promise<PagedList<T>> => {
  const paged = await paginate<T>(queryBuilder, options);

  return {
    items: paged.items,
    ...paged.meta,
    hasPreviousPage: paged.meta.currentPage > 1,
    hasNextPage: paged.meta.currentPage < paged.meta.totalPages,
  };
};
