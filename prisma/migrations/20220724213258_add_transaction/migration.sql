/*
  Warnings:

  - A unique constraint covering the columns `[correctChoiceID]` on the table `F1Question` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `f1question` ADD COLUMN `correctChoiceID` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `balance` INTEGER NULL;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `creationTime` DATETIME(3) NOT NULL,
    `amount` INTEGER NOT NULL,
    `currency` ENUM('EUR', 'CZK', 'USD') NOT NULL DEFAULT 'CZK',
    `authorID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `F1Question_correctChoiceID_key` ON `F1Question`(`correctChoiceID`);

-- AddForeignKey
ALTER TABLE `F1Question` ADD CONSTRAINT `F1Question_correctChoiceID_fkey` FOREIGN KEY (`correctChoiceID`) REFERENCES `F1ChoiceType`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_authorID_fkey` FOREIGN KEY (`authorID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
