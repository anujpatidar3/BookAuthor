import { Op, WhereOptions } from 'sequelize';

export interface BookFilterInput {
  title?: string;
  author?: string;
  author_id?: number;
  published_date_from?: Date;
  published_date_to?: Date;
  genres?: string[];
  rating_min?: number;
}

export interface AuthorFilterInput {
  name?: string;
  born_year_from?: number;
  born_year_to?: number;
}

export const buildBookWhereClause = (filter?: BookFilterInput): WhereOptions => {
  if (!filter) return {};

  const where: WhereOptions = {};

  if (filter.title) {
    where.title = {
      [Op.iLike]: `%${filter.title}%`,
    };
  }

  if (filter.author_id) {
    where.author_id = filter.author_id;
  }

  if (filter.published_date_from || filter.published_date_to) {
    where.published_date = {};
    if (filter.published_date_from) {
      where.published_date[Op.gte] = filter.published_date_from;
    }
    if (filter.published_date_to) {
      where.published_date[Op.lte] = filter.published_date_to;
    }
  }

  return where;
};

export const buildAuthorWhereClause = (filter?: AuthorFilterInput): WhereOptions => {
  if (!filter) return {};

  const where: WhereOptions = {};

  if (filter.name) {
    where.name = {
      [Op.iLike]: `%${filter.name}%`,
    };
  }

  if (filter.born_year_from || filter.born_year_to) {
    where.born_date = {};
    if (filter.born_year_from) {
      where.born_date[Op.gte] = new Date(`${filter.born_year_from}-01-01`);
    }
    if (filter.born_year_to) {
      where.born_date[Op.lte] = new Date(`${filter.born_year_to}-12-31`);
    }
  }

  return where;
};
