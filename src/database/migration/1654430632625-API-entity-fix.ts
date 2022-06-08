import {MigrationInterface, QueryRunner} from "typeorm";

export class APIEntityFix1654430632625 implements MigrationInterface {
    name = 'APIEntityFix1654430632625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" DROP CONSTRAINT "FK_a97d009aa61e381793871969509"`);
        await queryRunner.query(`ALTER TABLE "api" DROP CONSTRAINT "FK_85a54167d077f66ff2612ebb62c"`);
        await queryRunner.query(`ALTER TABLE "api" DROP CONSTRAINT "UQ_fc7dbce3f828c6b5954f5177715"`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "api_name"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "UQ_dab3b9cd30b5940f3a808316991"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "category"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" ADD CONSTRAINT "UQ_8ce91749da904c1cb16bb4e06c1" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "api" ADD "service_level" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "api" ADD "latency" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "category" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "type" SET DEFAULT 'private'`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "base_url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "subscribers"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "subscribers" text array DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "popularity" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" DROP CONSTRAINT "REL_a97d009aa61e38179387196950"`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "profileId"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "profileId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "categoryId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "verified"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "rating" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "rating" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "verified"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "verified" character varying NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "categoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "profileId"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "profileId" uuid`);
        await queryRunner.query(`ALTER TABLE "api" ADD CONSTRAINT "REL_a97d009aa61e38179387196950" UNIQUE ("profileId")`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "popularity" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "subscribers"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "subscribers" character varying`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "base_url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "UQ_23c05c292c439d77b0de816b500"`);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "latency"`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "service_level"`);
        await queryRunner.query(`ALTER TABLE "api" DROP CONSTRAINT "UQ_8ce91749da904c1cb16bb4e06c1"`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "category" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "UQ_dab3b9cd30b5940f3a808316991" UNIQUE ("category")`);
        await queryRunner.query(`ALTER TABLE "api" ADD "api_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" ADD CONSTRAINT "UQ_fc7dbce3f828c6b5954f5177715" UNIQUE ("api_name")`);
        await queryRunner.query(`ALTER TABLE "api" ADD CONSTRAINT "FK_85a54167d077f66ff2612ebb62c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "api" ADD CONSTRAINT "FK_a97d009aa61e381793871969509" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
