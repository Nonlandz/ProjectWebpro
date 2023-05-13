-- DropForeignKey
ALTER TABLE `PostFav` DROP FOREIGN KEY `PostFav_postId_fkey`;

-- DropForeignKey
ALTER TABLE `PostFav` DROP FOREIGN KEY `PostFav_userId_fkey`;

-- DropIndex
DROP INDEX `PostFav_userId_postId_key` ON `PostFav`;

-- AlterTable
ALTER TABLE `PostFav` MODIFY `userId` VARCHAR(191) NULL,
    MODIFY `postId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `PostFav` ADD CONSTRAINT `PostFav_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PostFav` ADD CONSTRAINT `PostFav_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
