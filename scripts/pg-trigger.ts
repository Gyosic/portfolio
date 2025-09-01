import "dotenv/config";
import { Pool } from "pg";

import { postgresql } from "../config";

export const pool = new Pool(postgresql);

(async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // PARTITION TRIGGER
    await client.query(`
      CREATE SCHEMA IF NOT EXISTS partition;

      CREATE OR REPLACE FUNCTION public.visits_insert_trigger() RETURNS trigger
          LANGUAGE plpgsql
          AS $_$
      DECLARE
          v_partition_suffix TEXT;
          v_partition_name text;
          v_exists BOOLEAN;
          create_table_part text;
          create_index_part text;
      BEGIN
          v_partition_suffix := TO_CHAR(NEW.timestamp, 'YYYY-MM');
          v_partition_name := 'visits_' || v_partition_suffix;

          SELECT EXISTS ( SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = v_partition_name ) INTO v_exists;

          IF NOT v_exists THEN
              create_table_part := format(
                  'CREATE TABLE IF NOT EXISTS partition.%I (
                      CHECK (
                          timestamp >= DATE ''%s-01'' AND timestamp < (DATE ''%s-01'' + INTERVAL ''1 month'')
                      )
                  ) INHERITS (public.visits)',
                  v_partition_name, v_partition_suffix, v_partition_suffix
              );

              -- 적절한 인덱스 생성 (예: timestamp 및 _id)',
              create_index_part := format(
                  'CREATE INDEX IF NOT EXISTS %I ON partition.%I (timestamp, _id)',
                  v_partition_name || '_idx', v_partition_name
              );

              EXECUTE create_table_part;
              EXECUTE create_index_part;
          END IF;

          -- 파티션 테이블에 INSERT
          EXECUTE format('INSERT INTO partition.%I VALUES ($1.*)', v_partition_name) USING NEW;

          RETURN NULL; -- 상위 테이블에는 삽입하지 않음
      END;
      $_$;
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS visits_insert_trigger ON public.visits;
    `);
    await client.query(`
      CREATE TRIGGER visits_insert_trigger
      BEFORE INSERT ON public.visits
      FOR EACH ROW
      EXECUTE FUNCTION public.visits_insert_trigger();
    `);

    await client.query("COMMIT");

    console.log(`✅ [Postgres] Partition & Trigger 생성 완료`);
  } catch (err) {
    await client.query("ROLLBACK");

    console.info("[Database Error]", err);

    throw err;
  } finally {
    client.release();
  }
})().then(() => process.exit(0));
