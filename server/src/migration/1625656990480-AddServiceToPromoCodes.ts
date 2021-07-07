import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddServiceToPromoCodes1625656990480 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."promo_codes" ADD "serviceId" UUID NOT NULL`);

    await queryRunner.query(
      `ALTER TABLE "public"."promo_codes" ADD CONSTRAINT "FK_Sa5wBi31SFTbUlNSZbmnC" FOREIGN KEY ("serviceId") REFERENCES "public"."services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."promo_codes" DROP CONSTRAINT "FK_Sa5wBi31SFTbUlNSZbmnC"`);
    await queryRunner.query(`ALTER TABLE "public"."promo_codes" DROP COLUMN "serviceId"`);
  }
}
