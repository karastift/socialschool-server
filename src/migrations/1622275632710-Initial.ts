import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1622275632710 implements MigrationInterface {
    name = 'Initial1622275632710'

    public async up(_: QueryRunner): Promise<void> {
        // await queryRunner.query(`CREATE TABLE "post_comment" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "creatorId" integer NOT NULL, "postId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3f09d6c1e169396ad02363460bc" PRIMARY KEY ("id", "creatorId", "postId"))`);
        // await queryRunner.query(`CREATE TABLE "upvote" ("value" integer NOT NULL, "userId" integer NOT NULL, "postId" integer NOT NULL, CONSTRAINT "PK_802ac6b9099f86aa24eb22d9c05" PRIMARY KEY ("userId", "postId"))`);
        // await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "text" character varying NOT NULL, "status" character varying NOT NULL, "points" integer NOT NULL DEFAULT '0', "creatorId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        // await queryRunner.query(`CREATE TABLE "school" ("id" SERIAL NOT NULL, "schoolName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9eb00e0accde5ee2d96e86570b3" UNIQUE ("schoolName"), CONSTRAINT "PK_57836c3fe2f2c7734b20911755e" PRIMARY KEY ("id"))`);
        // await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "schoolId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        // await queryRunner.query(`CREATE TABLE "grade" ("id" SERIAL NOT NULL, "grade" integer NOT NULL, "subject" character varying NOT NULL, "thoughts" character varying NOT NULL, "creatorId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_58c2176c3ae96bf57daebdbcb5e" PRIMARY KEY ("id"))`);
        // await queryRunner.query(`ALTER TABLE "post_comment" ADD CONSTRAINT "FK_d13bfb7c06f51815643605824bd" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE "post_comment" ADD CONSTRAINT "FK_c7fb3b0d1192f17f7649062f672" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE "upvote" ADD CONSTRAINT "FK_3abd9f37a94f8db3c33bda4fdae" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE "upvote" ADD CONSTRAINT "FK_efc79eb8b81262456adfcb87de1" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_9e91e6a24261b66f53971d3f96b" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_709e51110daa2b560f0fc32367b" FOREIGN KEY ("schoolId") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE "grade" ADD CONSTRAINT "FK_2d18d9e28b149862ec1371daa4e" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(_: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "grade" DROP CONSTRAINT "FK_2d18d9e28b149862ec1371daa4e"`);
        // await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_709e51110daa2b560f0fc32367b"`);
        // await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_9e91e6a24261b66f53971d3f96b"`);
        // await queryRunner.query(`ALTER TABLE "upvote" DROP CONSTRAINT "FK_efc79eb8b81262456adfcb87de1"`);
        // await queryRunner.query(`ALTER TABLE "upvote" DROP CONSTRAINT "FK_3abd9f37a94f8db3c33bda4fdae"`);
        // await queryRunner.query(`ALTER TABLE "post_comment" DROP CONSTRAINT "FK_c7fb3b0d1192f17f7649062f672"`);
        // await queryRunner.query(`ALTER TABLE "post_comment" DROP CONSTRAINT "FK_d13bfb7c06f51815643605824bd"`);
        // await queryRunner.query(`DROP TABLE "grade"`);
        // await queryRunner.query(`DROP TABLE "user"`);
        // await queryRunner.query(`DROP TABLE "school"`);
        // await queryRunner.query(`DROP TABLE "post"`);
        // await queryRunner.query(`DROP TABLE "upvote"`);
        // await queryRunner.query(`DROP TABLE "post_comment"`);
    }

}
