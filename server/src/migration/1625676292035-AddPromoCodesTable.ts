import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPromoCodesTable1625676292035 implements MigrationInterface {
    name = 'AddPromoCodesTable1625676292035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."promo_codes_status_enum" AS ENUM('active', 'pending', 'canceled', 'expired')`);
        await queryRunner.query(`CREATE TABLE "public"."promo_codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "status" "public"."promo_codes_status_enum" NOT NULL, "discountValue" numeric(8,2) NOT NULL, "serviceId" uuid NOT NULL, CONSTRAINT "PK_7366a9522c9fb8d18e13b5e4414" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."promo_codes" ADD CONSTRAINT "FK_036dfb8e7865ac4437437172937" FOREIGN KEY ("serviceId") REFERENCES "public"."services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."promo_codes" DROP CONSTRAINT "FK_036dfb8e7865ac4437437172937"`);
        await queryRunner.query(`DROP TABLE "public"."promo_codes"`);
        await queryRunner.query(`DROP TYPE "public"."promo_codes_status_enum"`);
    }

}
