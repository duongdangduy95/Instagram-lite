-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "sharedFromId" TEXT;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_sharedFromId_fkey" FOREIGN KEY ("sharedFromId") REFERENCES "Blog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
