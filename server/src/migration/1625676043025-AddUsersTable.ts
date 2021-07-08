import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUsersTable1625676043025 implements MigrationInterface {
    name = 'AddUsersTable1625676043025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "public"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "normalizedEmail" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_5a7f69f1943309147e3cf901c44" UNIQUE ("normalizedEmail"), CONSTRAINT "UQ_5a7f69f1943309147e3cf901c44" UNIQUE ("normalizedEmail"), CONSTRAINT "PK_a6cc71bedf15a41a5f5ee8aea97" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "public"."users"`);
    }

}
