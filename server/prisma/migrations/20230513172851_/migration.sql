/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `PostFav` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `PostFav` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postId` on table `PostFav` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `PostFav` DROP FOREIGN KEY `PostFav_postId_fkey`;

-- DropForeignKey
ALTER TABLE `PostFav` DROP FOREIGN KEY `PostFav_userId_fkey`;

-- AlterTable
ALTER TABLE `PostFav` MODIFY `userId` VARCHAR(191) NOT NULL,
    MODIFY `postId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `PostFav_userId_postId_key` ON `PostFav`(`userId`, `postId`);

-- AddForeignKey
ALTER TABLE `PostFav` ADD CONSTRAINT `PostFav_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostFav` ADD CONSTRAINT `PostFav_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
