import {MigrationInterface, QueryRunner} from "typeorm";

export class ManyOneFix1656427371911 implements MigrationInterface {
    name = 'ManyOneFix1656427371911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api" DROP CONSTRAINT "FK_566ecab4594846c59bfdb5856f9"`);
        await queryRunner.query(`ALTER TABLE "api" RENAME COLUMN "subscriptionId" TO "subscriptions"`);
        await queryRunner.query(`ALTER TABLE "api" RENAME CONSTRAINT "UQ_566ecab4594846c59bfdb5856f9" TO "UQ_a06773f2ba9ec2133b6b355b4bc"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_0253e1137348aa4ec36b503b006"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "REL_0253e1137348aa4ec36b503b00"`);
        await queryRunner.query(`ALTER TABLE "api" DROP CONSTRAINT "UQ_a06773f2ba9ec2133b6b355b4bc"`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "subscriptions"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "subscriptions" text array DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_0253e1137348aa4ec36b503b006" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_0253e1137348aa4ec36b503b006"`);
        await queryRunner.query(`ALTER TABLE "api" DROP COLUMN "subscriptions"`);
        await queryRunner.query(`ALTER TABLE "api" ADD "subscriptions" uuid`);
        await queryRunner.query(`ALTER TABLE "api" ADD CONSTRAINT "UQ_a06773f2ba9ec2133b6b355b4bc" UNIQUE ("subscriptions")`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "REL_0253e1137348aa4ec36b503b00" UNIQUE ("apiId")`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_0253e1137348aa4ec36b503b006" FOREIGN KEY ("apiId") REFERENCES "api"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "api" RENAME CONSTRAINT "UQ_a06773f2ba9ec2133b6b355b4bc" TO "UQ_566ecab4594846c59bfdb5856f9"`);
        await queryRunner.query(`ALTER TABLE "api" RENAME COLUMN "subscriptions" TO "subscriptionId"`);
        await queryRunner.query(`ALTER TABLE "api" ADD CONSTRAINT "FK_566ecab4594846c59bfdb5856f9" FOREIGN KEY ("subscriptionId") REFERENCES "subscription"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
