import {MigrationInterface, QueryRunner} from "typeorm";

export class endpoint1655328297537 implements MigrationInterface {
    name = 'endpoint1655328297537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "endpoint" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "endpoint" DROP COLUMN "http_method"`);
        await queryRunner.query(`ALTER TABLE "endpoint" DROP COLUMN "route_type"`);
        await queryRunner.query(`ALTER TABLE "endpoint" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."endpoint_method_enum" AS ENUM('get', 'post', 'put', 'delete', 'patch')`);
        await queryRunner.query(`ALTER TABLE "endpoint" ADD "method" "public"."endpoint_method_enum" DEFAULT 'get'`);
        await queryRunner.query(`ALTER TABLE "endpoint" ADD "headers" text array`);
        await queryRunner.query(`ALTER TABLE "endpoint" ADD "requestBody" jsonb DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "endpoint" DROP CONSTRAINT "FK_1b1d6c8c9ae7c8ba7c18309f701"`);
        await queryRunner.query(`ALTER TABLE "endpoint" ALTER COLUMN "apiId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "endpoint" ADD CONSTRAINT "FK_1b1d6c8c9ae7c8ba7c18309f701" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "endpoint" DROP CONSTRAINT "FK_1b1d6c8c9ae7c8ba7c18309f701"`);
        await queryRunner.query(`ALTER TABLE "endpoint" ALTER COLUMN "apiId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "endpoint" ADD CONSTRAINT "FK_1b1d6c8c9ae7c8ba7c18309f701" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "endpoint" DROP COLUMN "requestBody"`);
        await queryRunner.query(`ALTER TABLE "endpoint" DROP COLUMN "headers"`);
        await queryRunner.query(`ALTER TABLE "endpoint" DROP COLUMN "method"`);
        await queryRunner.query(`DROP TYPE "public"."endpoint_method_enum"`);
        await queryRunner.query(`ALTER TABLE "endpoint" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "endpoint" ADD "route_type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "endpoint" ADD "http_method" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "endpoint" ADD "title" character varying NOT NULL`);
    }

}
