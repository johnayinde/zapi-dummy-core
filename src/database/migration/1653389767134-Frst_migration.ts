import {MigrationInterface, QueryRunner} from "typeorm";

export class FrstMigration1653389767134 implements MigrationInterface {
    name = 'FrstMigration1653389767134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "endpoint" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "title" character varying NOT NULL, "description" character varying, "route_type" character varying NOT NULL, "apiId" uuid, CONSTRAINT "PK_7785c5c2cf24e6ab3abb7a2e89f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "discussion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "author" character varying NOT NULL, "body" character varying NOT NULL, "apiId" uuid, CONSTRAINT "PK_b93169eb129e530c6a4c3b9fda1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tutorial" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "body" character varying NOT NULL, CONSTRAINT "PK_4d07a72cfa203b3b21bde6da1b3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "price_group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, CONSTRAINT "PK_baf66b2acb03206fb76891bbb48" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "user_id" character varying NOT NULL, "email" character varying NOT NULL, "picture" character varying NOT NULL, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "api" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "api_name" character varying NOT NULL, "description" character varying NOT NULL, "type" character varying NOT NULL, "subscribers" character varying, "popularity" integer DEFAULT '0', "about" character varying, "verified" character varying NOT NULL DEFAULT false, "rating" integer DEFAULT '0', "tutorialsId" uuid, "pricegroupId" uuid, "profileId" uuid, CONSTRAINT "UQ_fc7dbce3f828c6b5954f5177715" UNIQUE ("api_name"), CONSTRAINT "REL_ca0de60facc7245d1b6eb157f3" UNIQUE ("pricegroupId"), CONSTRAINT "REL_a97d009aa61e38179387196950" UNIQUE ("profileId"), CONSTRAINT "PK_12f6cbe9e79197c2bf4c79c009d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "endpoint" ADD CONSTRAINT "FK_1b1d6c8c9ae7c8ba7c18309f701" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discussion" ADD CONSTRAINT "FK_2b60252641016810191dfbb6a1e" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "api" ADD CONSTRAINT "FK_bca892ad0e22921095b4bbd767a" FOREIGN KEY ("tutorialsId") REFERENCES "tutorial"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "api" ADD CONSTRAINT "FK_ca0de60facc7245d1b6eb157f38" FOREIGN KEY ("pricegroupId") REFERENCES "price_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "api" ADD CONSTRAINT "FK_a97d009aa61e381793871969509" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" DROP CONSTRAINT "FK_a97d009aa61e381793871969509"`);
        await queryRunner.query(`ALTER TABLE "api" DROP CONSTRAINT "FK_ca0de60facc7245d1b6eb157f38"`);
        await queryRunner.query(`ALTER TABLE "api" DROP CONSTRAINT "FK_bca892ad0e22921095b4bbd767a"`);
        await queryRunner.query(`ALTER TABLE "discussion" DROP CONSTRAINT "FK_2b60252641016810191dfbb6a1e"`);
        await queryRunner.query(`ALTER TABLE "endpoint" DROP CONSTRAINT "FK_1b1d6c8c9ae7c8ba7c18309f701"`);
        await queryRunner.query(`DROP TABLE "api"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TABLE "price_group"`);
        await queryRunner.query(`DROP TABLE "tutorial"`);
        await queryRunner.query(`DROP TABLE "discussion"`);
        await queryRunner.query(`DROP TABLE "endpoint"`);
    }

}
