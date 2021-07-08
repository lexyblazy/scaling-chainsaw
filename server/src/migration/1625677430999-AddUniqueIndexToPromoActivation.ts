import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueIndexToPromoActivation1625677430999 implements MigrationInterface {
  name = 'AddUniqueIndexToPromoActivation1625677430999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "indexUqActivePromotionForUserAndService" ON "public"."promo_activations" ("userId", "serviceId", "promoCodeId") WHERE "status"='active'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."indexUqActivePromotionForUserAndService"`);
  }
}
