import { TRPCError } from '@trpc/server';
import { eq, ilike } from 'drizzle-orm';
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
    const createdGood = result[0] as TGood;

    return createdGood;
  }

  static async getGoodById(id: bigint): Promise<TGood> {
    const result = await db
      .select()
      .from(pgGoods)
      .where(eq(pgGoods.goodId, id));
    const good = result[0] as TGood;
    if (!good || !good.goodId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'good by id had not been found',
      });
    }
    return good;
  }

  static async getGoods(filters:TFiltersGood): Promise<TFiltersGoodResponse> {
    const allGoodsDb = await db.select().from(pgGoods) as TGood[];
    const filtersobj =
      filters.name? ilike(pgGoods.name, `%${filters.name}%`) : undefined

    const filtered = await db.select().from(pgGoods).where(filtersobj) as TGood[]
    return {
      allGoods: allGoodsDb, 
      filtered
    }
  }

  static async updateGood(updatedGood: TGood): Promise<bigint> {
    const result = await db
      .update(pgGoods)
      .set(updatedGood)
      .where(eq(pgGoods.goodId, updatedGood.goodId))
      .returning();
    const good = result[0] as TGood;
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
