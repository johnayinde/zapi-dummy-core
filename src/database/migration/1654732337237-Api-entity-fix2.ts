import {MigrationInterface, QueryRunner} from "typeorm";

export class ApiEntityFix21654732337237 implements MigrationInterface {
    name = 'ApiEntityFix21654732337237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "verified"`);
        await queryRunner.query(`CREATE TYPE "public"."api_status_enum" AS ENUM('verified', 'unverified')`);
        await queryRunner.query(`ALTER TABLE "api" ADD "status" "public"."api_status_enum" NOT NULL DEFAULT 'unverified'`);
        await queryRunner.query(`ALTER TABLE "api" ADD "endpointsId" character varying`);
        await queryRunner.query(`ALTER TABLE "api" ADD "discussionsId" character varying`);
        await queryRunner.query(`ALTER TABLE "api" ADD "priceGroupId" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "picture" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "base_url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE TYPE "public"."api_type_enum" AS ENUM('public', 'private')`);
        await queryRunner.query(`ALTER TABLE "api" ADD "type" "public"."api_type_enum" NOT NULL DEFAULT 'public'`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "categoryId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "profileId"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "profileId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" ADD CONSTRAINT "FK_a97d009aa61e381793871969509" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "api" ADD CONSTRAINT "FK_85a54167d077f66ff2612ebb62c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" DROP CONSTRAINT "FK_85a54167d077f66ff2612ebb62c"`);
        await queryRunner.query(`ALTER TABLE "api" DROP CONSTRAINT "FK_a97d009aa61e381793871969509"`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "profileId"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "profileId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "categoryId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."api_type_enum"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "type" character varying NOT NULL DEFAULT 'private'`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "base_url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "picture" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "priceGroupId"`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "discussionsId"`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "endpointsId"`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."api_status_enum"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "verified" boolean NOT NULL DEFAULT false`);
    }

}
