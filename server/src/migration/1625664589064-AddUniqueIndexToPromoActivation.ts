import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueIndexToPromoActivation1625664589064 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "indexUqActivePromotionForUserAndService" ON "public"."promo_activations" ("userId", "serviceId", "promoCodeId") WHERE "status"='active'`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."indexUqActivePromotionForUserAndService"`, undefined);

  }
}
