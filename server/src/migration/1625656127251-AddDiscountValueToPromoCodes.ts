import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDiscountValueToPromoCodes1625656127251 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."promo_codes" ADD "discountValue" numeric(8,2) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."promo_codes" DROP COLUMN "discountValue"`);
  }
}
