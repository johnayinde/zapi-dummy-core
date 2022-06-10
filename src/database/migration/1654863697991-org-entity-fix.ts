import {MigrationInterface, QueryRunner} from "typeorm";

export class orgEntityFix1654863697991 implements MigrationInterface {
    name = 'orgEntityFix1654863697991'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organisation" DROP CONSTRAINT "FK_037ba4b170844c039e74aa22ecd"`);
        await queryRunner.query(`ALTER TABLE "organisation" DROP CONSTRAINT "REL_037ba4b170844c039e74aa22ec"`);
        await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "profileId"`);
        await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "number_of_employees"`);
        await queryRunner.query(`ALTER TABLE "organisation" ADD "number_of_employees" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organisation" DROP COLUMN "number_of_employees"`);
        await queryRunner.query(`ALTER TABLE "organisation" ADD "number_of_employees" character varying`);
        await queryRunner.query(`ALTER TABLE "organisation" ADD "profileId" uuid`);
        await queryRunner.query(`ALTER TABLE "organisation" ADD CONSTRAINT "REL_037ba4b170844c039e74aa22ec" UNIQUE ("profileId")`);
        await queryRunner.query(`ALTER TABLE "organisation" ADD CONSTRAINT "FK_037ba4b170844c039e74aa22ecd" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
