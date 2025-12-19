/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "imageUrl",
ADD COLUMN     "hashtags" TEXT[],
ADD COLUMN     "imageUrls" TEXT[];
