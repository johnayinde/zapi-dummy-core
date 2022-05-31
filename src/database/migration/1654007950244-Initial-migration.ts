import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1654007950244 implements MigrationInterface {
    name = 'InitialMigration1654007950244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organisation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "name" character varying(200) NOT NULL, "number_of_seats" integer NOT NULL DEFAULT '4', "number_of_employees" character varying, "mail_extension" character varying, "price_per_month" integer NOT NULL DEFAULT '0', "profileId" uuid, CONSTRAINT "UQ_d9428f9c8e3052d6617e3aab0ed" UNIQUE ("name"), CONSTRAINT "REL_037ba4b170844c039e74aa22ec" UNIQUE ("profileId"), CONSTRAINT "PK_c725ae234ef1b74cce43d2d00c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."profile_org_role_enum" AS ENUM('admin', 'developer')`);
        await queryRunner.query(`CREATE TABLE "profile_org" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "role" "public"."profile_org_role_enum" NOT NULL DEFAULT 'developer', "organisationId" uuid, "profileId" uuid, CONSTRAINT "PK_b1458cef545c7429a278d89d7d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "api" ADD "category_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "base_url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organisation" ADD CONSTRAINT "FK_037ba4b170844c039e74aa22ecd" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile_org" ADD CONSTRAINT "FK_767a37e586746f3f9aaeb53d2bb" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile_org" ADD CONSTRAINT "FK_432b14a27261ea8d706826424a9" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_org" DROP CONSTRAINT "FK_432b14a27261ea8d706826424a9"`);
        await queryRunner.query(`ALTER TABLE "profile_org" DROP CONSTRAINT "FK_767a37e586746f3f9aaeb53d2bb"`);
        await queryRunner.query(`ALTER TABLE "organisation" DROP CONSTRAINT "FK_037ba4b170844c039e74aa22ecd"`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "base_url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "type" SET DEFAULT 'private'`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "category_id"`);
        await queryRunner.query(`DROP TABLE "profile_org"`);
        await queryRunner.query(`DROP TYPE "public"."profile_org_role_enum"`);
        await queryRunner.query(`DROP TABLE "organisation"`);
    }

}
