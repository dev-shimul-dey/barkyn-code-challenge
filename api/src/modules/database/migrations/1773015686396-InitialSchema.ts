import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1773015686396 implements MigrationInterface {
    name = 'InitialSchema1773015686396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "course" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "totalSeats" integer NOT NULL, "occupiedSeats" integer NOT NULL DEFAULT '0', "prerequisiteCourseId" integer, "categoryId" integer, CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c6c48d73b3b32e47e9cc1cfc4c" ON "course" ("categoryId") `);
        await queryRunner.query(`CREATE TABLE "enrollment" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "completed" boolean NOT NULL DEFAULT false, "userId" integer, "courseId" integer, CONSTRAINT "PK_7e200c699fa93865cdcdd025885" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "course" ADD CONSTRAINT "FK_c6c48d73b3b32e47e9cc1cfc4c4" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course" ADD CONSTRAINT "FK_269a26d9de372542e0593efe96f" FOREIGN KEY ("prerequisiteCourseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollment" ADD CONSTRAINT "FK_e97ecbf11356b5173ce7fb0b060" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollment" ADD CONSTRAINT "FK_d1a599a7740b4f4bd1120850f04" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrollment" DROP CONSTRAINT "FK_d1a599a7740b4f4bd1120850f04"`);
        await queryRunner.query(`ALTER TABLE "enrollment" DROP CONSTRAINT "FK_e97ecbf11356b5173ce7fb0b060"`);
        await queryRunner.query(`ALTER TABLE "course" DROP CONSTRAINT "FK_269a26d9de372542e0593efe96f"`);
        await queryRunner.query(`ALTER TABLE "course" DROP CONSTRAINT "FK_c6c48d73b3b32e47e9cc1cfc4c4"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "enrollment"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c6c48d73b3b32e47e9cc1cfc4c"`);
        await queryRunner.query(`DROP TABLE "course"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
