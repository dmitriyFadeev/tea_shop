import { TRPCError } from '@trpc/server';
import { and, eq, gte, inArray, lte, or } from 'drizzle-orm';
import { pgGoods } from '../drizzle/schema';
import db from '../../db';
import type {
  TCreateGood,
  TGood,
  TFiltersGood,
  TFiltersGoodResponse,
} from '../models/good.model';

export class GoodRepository {

  static async insertGood(good: TCreateGood): Promise<TGood> {
    const result = await db
      .insert(pgGoods)
      .values(good)
      .returning();
    const createdGood = result[0];

    return createdGood;
  }

  static async getGoodById(id: bigint): Promise<TGood> {
    const result = await db
      .select()
      .from(pgGoods)
      .where(eq(pgGoods.goodId, id));
    const good:TGood = result[0];
    if (!good || !good.goodId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'good by id had not been found',
      });
    }
    return good;
  }

  static async getGoods(filters:TFiltersGood): Promise<TFiltersGoodResponse> {
    const allGoodsDb = await db.select().from(pgGoods);
    const filtersobj = and(
      filters.dateFrom? gte(pgGoods.date, filters.dateFrom): undefined,
      filters.dateTo? lte(pgGoods.date, filters.dateTo): undefined,
      filters.freeSpaces? gte(pgGoods.freeSpaces, 1): undefined,
      filters.onWater? eq(pgGoods.onWater, true): undefined,
      filters.location? eq(pgGoods.location, filters.location): undefined,
      filters.interests.length > 0 ?
        inArray(pgGoods.interest, filters.interests): undefined
    )
    const filtered: TGood[] = await db.select().from(pgGoods).where(filtersobj)
    const allGoods: TGood[] = allGoodsDb;
    return {
      allGoods, 
      filtered
    }
  }

  static async updateGood(updatedGood: TGood): Promise<bigint> {
    const result = await db
      .update(pgGoods)
      .set(updatedGood)
      .where(eq(pgGoods.goodId, updatedGood.goodId))
      .returning();
    const good:TGood = result[0];
    if (!good || !good.goodId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'good by email had not been found',
      });
    }
    return good.goodId;
  }

  static async deleteGood(id: bigint): Promise<void> {
    const result = await db.delete(pgGoods).where(eq(pgGoods.goodId, id));
    if (!result)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'good by id had not been found',
      });
  }
}
