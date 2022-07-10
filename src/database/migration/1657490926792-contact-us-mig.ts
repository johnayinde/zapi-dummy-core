import { MigrationInterface, QueryRunner } from "typeorm";

export class contactUsMig1657490926792 implements MigrationInterface {
    name = 'contactUsMig1657490926792'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "discussion" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "author" character varying NOT NULL, "body" character varying NOT NULL, "apiId" uuid, CONSTRAINT "PK_b93169eb129e530c6a4c3b9fda1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pricing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "planName" character varying NOT NULL, "planPrice" character varying NOT NULL, "requestDuration" character varying NOT NULL, CONSTRAINT "PK_4f6e9c88033106a989aa7ce9dee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "price_group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "apiId" uuid, "pricingId" uuid, CONSTRAINT "REL_11608f5bfd1ff9485e35a5e36a" UNIQUE ("pricingId"), CONSTRAINT "PK_baf66b2acb03206fb76891bbb48" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."profile_org_role_enum" AS ENUM('admin', 'developer')`);
        await queryRunner.query(`CREATE TABLE "profile_org" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "organisationId" uuid NOT NULL, "profileId" uuid NOT NULL, "role" "public"."profile_org_role_enum" NOT NULL DEFAULT 'developer', CONSTRAINT "PK_b1458cef545c7429a278d89d7d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organisation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "name" character varying(200) NOT NULL, "number_of_seats" integer NOT NULL DEFAULT '4', "number_of_employees" integer, "mail_extension" character varying, "price_per_month" integer NOT NULL DEFAULT '0', "profileId" uuid NOT NULL, CONSTRAINT "UQ_d9428f9c8e3052d6617e3aab0ed" UNIQUE ("name"), CONSTRAINT "PK_c725ae234ef1b74cce43d2d00c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "apiId" uuid NOT NULL, "profileId" uuid NOT NULL, CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "email" character varying NOT NULL, "user_id" character varying NOT NULL, "subscriptions" text array DEFAULT '{}', "picture" character varying, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "name" character varying NOT NULL, "description" character varying, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."api_status_enum" AS ENUM('verified', 'unverified')`);
        await queryRunner.query(`CREATE TYPE "public"."api_visibility_enum" AS ENUM('public', 'private')`);
        await queryRunner.query(`CREATE TABLE "api" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "name" character varying NOT NULL, "description" character varying NOT NULL, "base_url" character varying NOT NULL, "popularity" integer NOT NULL DEFAULT '0', "about" character varying, "subscriptions" text array DEFAULT '{}', "status" "public"."api_status_enum" NOT NULL DEFAULT 'unverified', "visibility" "public"."api_visibility_enum" NOT NULL DEFAULT 'private', "rating" integer NOT NULL DEFAULT '0', "service_level" integer NOT NULL DEFAULT '0', "latency" integer NOT NULL DEFAULT '0', "categoryId" uuid NOT NULL, "profileId" uuid NOT NULL, "tutorialsId" character varying, "discussionsId" character varying, "priceGroupId" character varying, CONSTRAINT "UQ_8ce91749da904c1cb16bb4e06c1" UNIQUE ("name"), CONSTRAINT "PK_12f6cbe9e79197c2bf4c79c009d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact_us" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "phoneNo" character varying NOT NULL, "businessEmail" character varying NOT NULL, "countryName" character varying NOT NULL, "topicName" character varying NOT NULL, "additionalInfo" character varying NOT NULL, CONSTRAINT "PK_b61766a4d93470109266b976cfe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."endpoint_method_enum" AS ENUM('get', 'post', 'put', 'patch', 'delete')`);
        await queryRunner.query(`CREATE TABLE "endpoint" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "name" character varying NOT NULL, "method" "public"."endpoint_method_enum" DEFAULT 'get', "route" character varying NOT NULL, "apiId" character varying NOT NULL, "description" character varying NOT NULL, "headers" text array, "requestBody" jsonb NOT NULL DEFAULT '{}', CONSTRAINT "PK_7785c5c2cf24e6ab3abb7a2e89f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tutorial" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "title" character varying NOT NULL, "body" character varying NOT NULL, "apiId" character varying NOT NULL, CONSTRAINT "PK_4d07a72cfa203b3b21bde6da1b3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact_us_country" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "countryName" character varying NOT NULL, CONSTRAINT "PK_3b1a58a9af1426ef65b07e115f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact_us_topic" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdOn" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedOn" TIMESTAMP, "updatedBy" character varying, "deletedOn" TIMESTAMP WITH TIME ZONE, "deletedBy" character varying, "topicName" character varying NOT NULL, CONSTRAINT "PK_05476c950dcd3923c3d6d9590f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "discussion" ADD CONSTRAINT "FK_2b60252641016810191dfbb6a1e" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "price_group" ADD CONSTRAINT "FK_78a5352493260ea77604c25399f" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "price_group" ADD CONSTRAINT "FK_11608f5bfd1ff9485e35a5e36a6" FOREIGN KEY ("pricingId") REFERENCES "pricing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile_org" ADD CONSTRAINT "FK_767a37e586746f3f9aaeb53d2bb" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile_org" ADD CONSTRAINT "FK_432b14a27261ea8d706826424a9" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organisation" ADD CONSTRAINT "FK_037ba4b170844c039e74aa22ecd" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_0253e1137348aa4ec36b503b006" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_8f632af010f4f7b49d362eabbb4" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "api" ADD CONSTRAINT "FK_a97d009aa61e381793871969509" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "api" ADD CONSTRAINT "FK_85a54167d077f66ff2612ebb62c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" DROP CONSTRAINT "FK_85a54167d077f66ff2612ebb62c"`);
        await queryRunner.query(`ALTER TABLE "api" DROP CONSTRAINT "FK_a97d009aa61e381793871969509"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_8f632af010f4f7b49d362eabbb4"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_0253e1137348aa4ec36b503b006"`);
        await queryRunner.query(`ALTER TABLE "organisation" DROP CONSTRAINT "FK_037ba4b170844c039e74aa22ecd"`);
        await queryRunner.query(`ALTER TABLE "profile_org" DROP CONSTRAINT "FK_432b14a27261ea8d706826424a9"`);
        await queryRunner.query(`ALTER TABLE "profile_org" DROP CONSTRAINT "FK_767a37e586746f3f9aaeb53d2bb"`);
        await queryRunner.query(`ALTER TABLE "price_group" DROP CONSTRAINT "FK_11608f5bfd1ff9485e35a5e36a6"`);
        await queryRunner.query(`ALTER TABLE "price_group" DROP CONSTRAINT "FK_78a5352493260ea77604c25399f"`);
        await queryRunner.query(`ALTER TABLE "discussion" DROP CONSTRAINT "FK_2b60252641016810191dfbb6a1e"`);
        await queryRunner.query(`DROP TABLE "contact_us_topic"`);
        await queryRunner.query(`DROP TABLE "contact_us_country"`);
        await queryRunner.query(`DROP TABLE "tutorial"`);
        await queryRunner.query(`DROP TABLE "endpoint"`);
        await queryRunner.query(`DROP TYPE "public"."endpoint_method_enum"`);
        await queryRunner.query(`DROP TABLE "contact_us"`);
        await queryRunner.query(`DROP TABLE "api"`);
        await queryRunner.query(`DROP TYPE "public"."api_visibility_enum"`);
        await queryRunner.query(`DROP TYPE "public"."api_status_enum"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
        await queryRunner.query(`DROP TABLE "organisation"`);
        await queryRunner.query(`DROP TABLE "profile_org"`);
        await queryRunner.query(`DROP TYPE "public"."profile_org_role_enum"`);
        await queryRunner.query(`DROP TABLE "price_group"`);
        await queryRunner.query(`DROP TABLE "pricing"`);
        await queryRunner.query(`DROP TABLE "discussion"`);
    }

}
