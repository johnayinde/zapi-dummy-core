import {MigrationInterface, QueryRunner} from "typeorm";

export class subscription1656280084548 implements MigrationInterface {
    name = 'subscription1656280084548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" RENAME COLUMN "subscribers" TO "subscriptions"`);
        await queryRunner.query(`CREATE TABLE "subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "apiId" uuid NOT NULL, "profileId" uuid NOT NULL, CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "subscriptions" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "subscriptions" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_0253e1137348aa4ec36b503b006" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_8f632af010f4f7b49d362eabbb4" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_8f632af010f4f7b49d362eabbb4"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_0253e1137348aa4ec36b503b006"`);
        await queryRunner.query(`ALTER TABLE "api" ALTER COLUMN "subscriptions" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "subscriptions"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`ALTER TABLE "api" RENAME COLUMN "subscriptions" TO "subscribers"`);
    }

}
