-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerName" TEXT NOT NULL,
    "ownerPhone" TEXT NOT NULL,
    "locationLink" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "propertyType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
