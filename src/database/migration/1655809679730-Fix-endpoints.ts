import {MigrationInterface, QueryRunner} from "typeorm";

export class FixEndpoints1655809679730 implements MigrationInterface {
    name = 'FixEndpoints1655809679730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" DROP CONSTRAINT "FK_bca892ad0e22921095b4bbd767a"`);
        await queryRunner.query(`ALTER TABLE "tutorial" ADD "apiId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "tutorialsId"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "tutorialsId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "tutorialsId"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "tutorialsId" uuid`);
        await queryRunner.query(`ALTER TABLE "tutorial" DROP COLUMN "apiId"`);
        await queryRunner.query(`ALTER TABLE "api" ADD CONSTRAINT "FK_bca892ad0e22921095b4bbd767a" FOREIGN KEY ("tutorialsId") REFERENCES "tutorial"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
