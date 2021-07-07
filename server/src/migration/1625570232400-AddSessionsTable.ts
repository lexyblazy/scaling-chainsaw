import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSessionsTable1625570232400 implements MigrationInterface {
  name = 'AddSessionsTable1625570232400';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "public"."sessions" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            "token" character varying NOT NULL,
            "userId" uuid NOT NULL,
            CONSTRAINT "PK_0b14e7e9a1db4f630dc08380099" PRIMARY KEY ("id")
        )`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."sessions" ADD CONSTRAINT "FK_1f5aba4889a4382263f4482ec4f" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "public"."sessions" DROP CONSTRAINT "FK_1f5aba4889a4382263f4482ec4f"`);
    await queryRunner.query(`DROP TABLE "public"."sessions"`);
  }
}
