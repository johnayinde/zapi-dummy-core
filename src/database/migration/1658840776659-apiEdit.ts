import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1658840776659 implements MigrationInterface {
    name = 'migration1658840776659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" ADD "secretKey" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "secretKey"`);
    }

}
