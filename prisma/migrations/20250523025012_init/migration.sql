/*
  Warnings:

  - You are about to drop the column `isNew` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `transactionType` on the `Property` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerName" TEXT NOT NULL,
    "ownerPhone" TEXT NOT NULL,
    "propertyType" TEXT,
    "agentName" TEXT,
    "progressStatus" TEXT,
    "investor" TEXT,
    "estimatedPrice" INTEGER,
    "approvedPrice" INTEGER,
    "locationLink" TEXT,
    "mapEmbedLink" TEXT,
    "images" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Property" ("createdAt", "id", "locationLink", "ownerName", "ownerPhone", "propertyType") SELECT "createdAt", "id", "locationLink", "ownerName", "ownerPhone", "propertyType" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
