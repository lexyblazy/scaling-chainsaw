import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPromoActivationsTable1625677110482 implements MigrationInterface {
    name = 'AddPromoActivationsTable1625677110482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."promo_activations_status_enum" AS ENUM('active', 'pending', 'canceled', 'expired')`);
        await queryRunner.query(`CREATE TABLE "public"."promo_activations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."promo_activations_status_enum" NOT NULL, "userId" uuid NOT NULL, "serviceId" uuid NOT NULL, "promoCodeId" uuid NOT NULL, CONSTRAINT "PK_a94b1f84c0ff99c8baa86d72ded" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."promo_activations" ADD CONSTRAINT "FK_519f901566f5f8e4fb628e96041" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."promo_activations" ADD CONSTRAINT "FK_fea6910b2d249535bec4b4d0764" FOREIGN KEY ("serviceId") REFERENCES "public"."services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."promo_activations" ADD CONSTRAINT "FK_9302d7023029519eeb9a1e33351" FOREIGN KEY ("promoCodeId") REFERENCES "public"."promo_codes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."promo_activations" DROP CONSTRAINT "FK_9302d7023029519eeb9a1e33351"`);
        await queryRunner.query(`ALTER TABLE "public"."promo_activations" DROP CONSTRAINT "FK_fea6910b2d249535bec4b4d0764"`);
        await queryRunner.query(`ALTER TABLE "public"."promo_activations" DROP CONSTRAINT "FK_519f901566f5f8e4fb628e96041"`);
        await queryRunner.query(`DROP TABLE "public"."promo_activations"`);
        await queryRunner.query(`DROP TYPE "public"."promo_activations_status_enum"`);
    }

}
