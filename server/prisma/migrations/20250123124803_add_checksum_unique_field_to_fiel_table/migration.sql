/*
  Warnings:

  - A unique constraint covering the columns `[checksum]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `File_checksum_key` ON `File`(`checksum`);
