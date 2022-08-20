/*
  Warnings:

  - You are about to drop the column `endTime` on the `f1predictiontype` table. All the data in the column will be lost.
  - Added the required column `updatedTime` to the `F1Choice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `F1Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `f1choice` ADD COLUMN `updatedTime` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `f1predictiontype` DROP COLUMN `endTime`;

-- AlterTable
ALTER TABLE `f1question` ADD COLUMN `endTime` DATETIME(3) NOT NULL;
