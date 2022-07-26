import { MigrationInterface, QueryRunner } from "typeorm";

export class ApiSecretKey1658868535525 implements MigrationInterface {
    name = 'ApiSecretKey1658868535525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" ADD "secretKey" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "secretKey"`);
    }

}
