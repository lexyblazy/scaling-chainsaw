import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPromoCodesTable1625644482252 implements MigrationInterface {
  name = 'AddPromoCodesTable1625644482252';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."promo_codes_status_enum" AS ENUM('active', 'pending', 'canceled', 'expired')`);
    await queryRunner.query(
      `CREATE TABLE "public"."promo_codes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "code" character varying NOT NULL,
        "status" "public"."promo_codes_status_enum" NOT NULL,
        CONSTRAINT "PK_7366a9522c9fb8d18e13b5e4414" PRIMARY KEY ("id")
    )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "public"."promo_codes"`);
    await queryRunner.query(`DROP TYPE "public"."promo_codes_status_enum"`);
  }
}
