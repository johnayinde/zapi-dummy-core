import { MigrationInterface, QueryRunner } from "typeorm";

export class EndpointUpdate1657009416892 implements MigrationInterface {
    name = 'EndpointUpdate1657009416892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "endpoint" ALTER COLUMN "headers" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "endpoint" ALTER COLUMN "headers" SET DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "endpoint" ALTER COLUMN "headers" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "endpoint" ALTER COLUMN "headers" DROP DEFAULT`);
    }

}
