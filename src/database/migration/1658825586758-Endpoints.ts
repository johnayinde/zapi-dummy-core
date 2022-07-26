import { MigrationInterface, QueryRunner } from "typeorm";

export class Endpoints1658825586758 implements MigrationInterface {
    name = 'Endpoints1658825586758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "endpoint" ALTER COLUMN "requestBody" SET DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "endpoint" ALTER COLUMN "requestBody" SET DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "endpoint" ALTER COLUMN "requestBody" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "endpoint" ALTER COLUMN "requestBody" SET DEFAULT '{}'`);
    }

}
