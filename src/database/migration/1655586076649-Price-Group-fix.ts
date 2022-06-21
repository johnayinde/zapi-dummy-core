import {MigrationInterface, QueryRunner} from "typeorm";

export class PriceGroupFix1655586076649 implements MigrationInterface {
    name = 'PriceGroupFix1655586076649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile_org" DROP CONSTRAINT "FK_432b14a27261ea8d706826424a9"`);
        await queryRunner.query(`ALTER TABLE "profile_org" DROP CONSTRAINT "FK_767a37e586746f3f9aaeb53d2bb"`);
        await queryRunner.query(`ALTER TABLE "profile_org" ALTER COLUMN "profileId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile_org" ALTER COLUMN "organisationId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organisation" DROP CONSTRAINT "FK_037ba4b170844c039e74aa22ecd"`);
        await queryRunner.query(`ALTER TABLE "organisation" ALTER COLUMN "profileId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile_org" ADD CONSTRAINT "FK_767a37e586746f3f9aaeb53d2bb" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile_org" ADD CONSTRAINT "FK_432b14a27261ea8d706826424a9" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation" ADD CONSTRAINT "FK_037ba4b170844c039e74aa22ecd" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organisation" DROP CONSTRAINT "FK_037ba4b170844c039e74aa22ecd"`);
        await queryRunner.query(`ALTER TABLE "profile_org" DROP CONSTRAINT "FK_432b14a27261ea8d706826424a9"`);
        await queryRunner.query(`ALTER TABLE "profile_org" DROP CONSTRAINT "FK_767a37e586746f3f9aaeb53d2bb"`);
        await queryRunner.query(`ALTER TABLE "organisation" ALTER COLUMN "profileId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organisation" ADD CONSTRAINT "FK_037ba4b170844c039e74aa22ecd" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile_org" ALTER COLUMN "organisationId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile_org" ALTER COLUMN "profileId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile_org" ADD CONSTRAINT "FK_767a37e586746f3f9aaeb53d2bb" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile_org" ADD CONSTRAINT "FK_432b14a27261ea8d706826424a9" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
