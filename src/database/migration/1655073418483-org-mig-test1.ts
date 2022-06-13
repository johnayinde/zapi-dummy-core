import {MigrationInterface, QueryRunner} from "typeorm";

export class orgMigTest11655073418483 implements MigrationInterface {
    name = 'orgMigTest11655073418483'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organisation" ADD "profileId" uuid`);
        await queryRunner.query(`ALTER TABLE "organisation" ADD CONSTRAINT "FK_037ba4b170844c039e74aa22ecd" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organisation" DROP CONSTRAINT "FK_037ba4b170844c039e74aa22ecd"`);
        await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "profileId"`);
    }

}
