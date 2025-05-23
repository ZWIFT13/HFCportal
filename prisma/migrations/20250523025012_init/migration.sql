-- RedefineTables: drop เฉพาะคอลัมน์ progressStatus
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Property" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "ownerName" TEXT NOT NULL,
  "ownerPhone" TEXT NOT NULL,
  "propertyType" TEXT,
  "agentName" TEXT,
  "investor" TEXT,
  "estimatedPrice" INTEGER,
  "approvedPrice" INTEGER,
  "locationLink" TEXT,
  "mapEmbedLink" TEXT,
  "province" TEXT,                  -- รักษาไว้
  "status" TEXT,                    -- รักษาไว้
  "images" TEXT NOT NULL DEFAULT '[]',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "new_Property" (
  "createdAt",
  "id",
  "ownerName",
  "ownerPhone",
  "propertyType",
  "agentName",
  "investor",
  "estimatedPrice",
  "approvedPrice",
  "locationLink",
  "mapEmbedLink",
  "province",                       -- รักษาไว้
  "status"                          -- รักษาไว้
)
SELECT
  "createdAt",
  "id",
  "ownerName",
  "ownerPhone",
  "propertyType",
  "agentName",
  "investor",
  "estimatedPrice",
  "approvedPrice",
  "locationLink",
  "mapEmbedLink",
  "province",                       -- รักษาไว้
  "status"                          -- รักษาไว้
FROM "Property";

DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
