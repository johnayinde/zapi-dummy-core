import { MigrationInterface, QueryRunner } from "typeorm";

export class filetr1656658175698 implements MigrationInterface {
    name = 'filetr1656658175698'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" ADD "testColumn" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "testColumn"`);
    }

}
