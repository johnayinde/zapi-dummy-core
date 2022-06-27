import {MigrationInterface, QueryRunner} from "typeorm";

export class ApiDtoFix1656332907435 implements MigrationInterface {
    name = 'ApiDtoFix1656332907435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "subscriptions"`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "subscriptions"`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."api_type_enum"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "subscribers" text array DEFAULT '{}'`);
        await queryRunner.query(`CREATE TYPE "public"."api_visibility_enum" AS ENUM('public', 'private')`);
        await queryRunner.query(`ALTER TABLE "api" ADD "visibility" "public"."api_visibility_enum" NOT NULL DEFAULT 'private'`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "base_url" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "base_url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "visibility"`);
        await queryRunner.query(`DROP TYPE "public"."api_visibility_enum"`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "subscribers"`);
        await queryRunner.query(`CREATE TYPE "public"."api_type_enum" AS ENUM('public', 'private')`);
        await queryRunner.query(`ALTER TABLE "api" ADD "type" "public"."api_type_enum" NOT NULL DEFAULT 'private'`);
        await queryRunner.query(`ALTER TABLE "api" ADD "subscriptions" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "subscriptions" text array NOT NULL DEFAULT '{}'`);
    }

}
