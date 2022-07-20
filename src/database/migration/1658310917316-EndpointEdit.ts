import { MigrationInterface, QueryRunner } from "typeorm";

export class EndpointEdit1658310917316 implements MigrationInterface {
    name = 'EndpointEdit1658310917316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "endpoint" DROP COLUMN "requestBody"`);
        await queryRunner.query(`ALTER TABLE "endpoint" ADD "requestBody" jsonb array DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "endpoint" DROP COLUMN "requestBody"`);
        await queryRunner.query(`ALTER TABLE "endpoint" ADD "requestBody" jsonb NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "endpoint" DROP COLUMN "requestBody"`);
        await queryRunner.query(`ALTER TABLE "endpoint" ADD "requestBody" jsonb array DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "endpoint" DROP COLUMN "requestBody"`);
        await queryRunner.query(`ALTER TABLE "endpoint" ADD "requestBody" jsonb NOT NULL DEFAULT '{}'`);
    }

}
