/*
  Warnings:

  - Added the required column `checksum` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `File` ADD COLUMN `checksum` VARCHAR(191) NOT NULL;
