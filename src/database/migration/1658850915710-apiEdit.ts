import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1658850915710 implements MigrationInterface {
    name = 'migration1658850915710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "secretKey" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "secretKey" SET NOT NULL`);
    }

}
