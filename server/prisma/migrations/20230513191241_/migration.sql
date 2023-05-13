/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `PostFav` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `PostFav_userId_postId_key` ON `PostFav`(`userId`, `postId`);
