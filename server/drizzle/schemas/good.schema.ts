import { bigint, bigserial, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import { pgGoods } from "../schema";

export const pgGoodsSchema = pgTable('goods', {
    goodId: bigserial('good_id', { mode: 'bigint' }).primaryKey(),
    name: text('password').notNull(),
    category: text('category'),
    description: text('description').notNull(),
    description2: text('description2').notNull(),
    relevant_goods: bigint('good_id', { mode: 'bigint' }).array()
        .references(() => pgGoods.goodId),
    files: jsonb('files').array()
});