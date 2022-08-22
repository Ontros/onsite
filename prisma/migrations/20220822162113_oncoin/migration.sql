-- AlterTable
ALTER TABLE `f1question` ADD COLUMN `authorID` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `onCoinAmount` INTEGER NULL;

-- CreateTable
CREATE TABLE `f1weekendpart` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `predictionTypeId` INTEGER NOT NULL,
    `endTime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cointransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fromUserId` VARCHAR(191) NOT NULL,
    `toUserId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `currency` ENUM('OnCoin') NOT NULL,
    `valid` BOOLEAN NOT NULL DEFAULT false,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_F1QuestionTof1weekendpart` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_F1QuestionTof1weekendpart_AB_unique`(`A`, `B`),
    INDEX `_F1QuestionTof1weekendpart_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `F1Question` ADD CONSTRAINT `F1Question_authorID_fkey` FOREIGN KEY (`authorID`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `f1weekendpart` ADD CONSTRAINT `f1weekendpart_predictionTypeId_fkey` FOREIGN KEY (`predictionTypeId`) REFERENCES `F1PredictionType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cointransaction` ADD CONSTRAINT `cointransaction_fromUserId_fkey` FOREIGN KEY (`fromUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cointransaction` ADD CONSTRAINT `cointransaction_toUserId_fkey` FOREIGN KEY (`toUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_F1QuestionTof1weekendpart` ADD CONSTRAINT `_F1QuestionTof1weekendpart_A_fkey` FOREIGN KEY (`A`) REFERENCES `F1Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_F1QuestionTof1weekendpart` ADD CONSTRAINT `_F1QuestionTof1weekendpart_B_fkey` FOREIGN KEY (`B`) REFERENCES `f1weekendpart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
