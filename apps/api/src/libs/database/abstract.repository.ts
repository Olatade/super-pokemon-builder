import {
  Repository,
  DataSource,
  SelectQueryBuilder,
  ObjectLiteral,
} from 'typeorm';

export type QueryParams = {
  limit?: string;
  offset?: string;
  fields?: string;
  [key: string]: string | undefined; // for filters
};

export abstract class AbstractRepository<T extends ObjectLiteral> {
  protected repository: Repository<T>;

  constructor(protected readonly dataSource: DataSource, entity: new () => T) {
    this.repository = this.dataSource.getRepository(entity);
  }

  async findAll(
    query: QueryParams,
    relations: string[] = []
  ): Promise<{ data: Partial<T>[]; meta: any }> {
    const alias = this.repository.metadata.tableName;

    const qb: SelectQueryBuilder<T> = this.repository.createQueryBuilder(alias);

    // Pagination defaults
    const limit = parseInt(query.limit || '150', 10);
    const offset = parseInt(query.offset || '0', 10);

    // Apply filters (any query param that's not limit, offset, fields)
    const filterableKeys = Object.keys(query).filter(
      (key) => !['limit', 'offset', 'fields'].includes(key)
    );

    for (const key of filterableKeys) {
      qb.andWhere(`${alias}.${key} = :${key}`, { [key]: query[key] });
    }

    // Select fields
    const selectedFields = query.fields?.split(',').map((f) => `${alias}.${f}`);
    if (selectedFields?.length) {
      qb.select(selectedFields);
    }

    // Count total (before pagination)
    const totalCount = await qb.getCount();

    // Apply relations
    for (const relation of relations) {
      const relationParts = relation.split('.');
      const aliasName = relationParts.length > 1 ? relationParts[relationParts.length - 1] : relation;
      const propertyName = relationParts.length > 1 ? relation : `${alias}.${relation}`;
      qb.leftJoinAndSelect(propertyName, aliasName);
    }

    // Apply pagination
    qb.skip(offset).take(limit);

    const data = await qb.getMany();

    return {
      data,
      meta: {
        totalCount,
        limit,
        offset,
        returnedCount: data.length,
      },
    };
  }

  async findById(id: any, relations: string[] = []): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as unknown as Partial<T>,
      relations,
    });
  }

  async create(data: import('typeorm').DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data) as T;
    return (await this.repository.save(entity)) as T;
  }

  async update(id: number | string, data: Partial<T>): Promise<T> {
    await this.repository.update(id, data);
    return this.findById(id) as Promise<T>;
  }

  async delete(id: number | string): Promise<void> {
    await this.repository.delete(id);
  }

  async save(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }
}
