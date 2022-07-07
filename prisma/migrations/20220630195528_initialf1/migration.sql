-- AlterTable
ALTER TABLE `User` ADD COLUMN `f1Points` INTEGER NULL;

-- CreateTable
CREATE TABLE `F1Prediction` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `f1PredictionTypeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `F1PredictionType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `F1Question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `f1PredictionTypeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `F1Choice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `choiceTypeId` INTEGER NOT NULL,
    `predictionID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `F1ChoiceType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `questionID` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `F1Prediction` ADD CONSTRAINT `F1Prediction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `F1Prediction` ADD CONSTRAINT `F1Prediction_f1PredictionTypeId_fkey` FOREIGN KEY (`f1PredictionTypeId`) REFERENCES `F1PredictionType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `F1Question` ADD CONSTRAINT `F1Question_f1PredictionTypeId_fkey` FOREIGN KEY (`f1PredictionTypeId`) REFERENCES `F1PredictionType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `F1Choice` ADD CONSTRAINT `F1Choice_predictionID_fkey` FOREIGN KEY (`predictionID`) REFERENCES `F1Prediction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `F1Choice` ADD CONSTRAINT `F1Choice_choiceTypeId_fkey` FOREIGN KEY (`choiceTypeId`) REFERENCES `F1ChoiceType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `F1ChoiceType` ADD CONSTRAINT `F1ChoiceType_questionID_fkey` FOREIGN KEY (`questionID`) REFERENCES `F1Question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
