import {MigrationInterface, QueryRunner} from "typeorm";

export class Subscription1656359941692 implements MigrationInterface {
    name = 'Subscription1656359941692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" DROP CONSTRAINT "FK_a97d009aa61e381793871969509"`);
        await queryRunner.query(`ALTER TABLE "api" RENAME COLUMN "subscribers" TO "subscriptionId"`);
        await queryRunner.query(`CREATE TABLE "subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "apiId" uuid NOT NULL, "profileId" uuid NOT NULL, CONSTRAINT "REL_0253e1137348aa4ec36b503b00" UNIQUE ("apiId"), CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "subscriptions" text array DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "subscriptionId"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "subscriptionId" uuid`);
        await queryRunner.query(`ALTER TABLE "api" ADD CONSTRAINT "UQ_566ecab4594846c59bfdb5856f9" UNIQUE ("subscriptionId")`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_0253e1137348aa4ec36b503b006" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_8f632af010f4f7b49d362eabbb4" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "api" ADD CONSTRAINT "FK_a97d009aa61e381793871969509" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "api" ADD CONSTRAINT "FK_566ecab4594846c59bfdb5856f9" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" DROP CONSTRAINT "FK_566ecab4594846c59bfdb5856f9"`);
        await queryRunner.query(`ALTER TABLE "api" DROP CONSTRAINT "FK_a97d009aa61e381793871969509"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_8f632af010f4f7b49d362eabbb4"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_0253e1137348aa4ec36b503b006"`);
        await queryRunner.query(`ALTER TABLE "api" DROP CONSTRAINT "UQ_566ecab4594846c59bfdb5856f9"`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "subscriptionId"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "subscriptionId" text array DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "subscriptions"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`ALTER TABLE "api" RENAME COLUMN "subscriptionId" TO "subscribers"`);
        await queryRunner.query(`ALTER TABLE "api" ADD CONSTRAINT "FK_a97d009aa61e381793871969509" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
