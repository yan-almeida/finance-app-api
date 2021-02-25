import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { PagedList } from '../@types/PagedList';

export const pagedList = async <T = any>(
  queryBuilder: Repository<T> | any,
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
