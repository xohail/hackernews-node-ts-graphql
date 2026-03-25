-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Link" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Link" ("author", "createdAt", "description", "id", "url") SELECT coalesce("author", '') AS "author", "createdAt", "description", "id", "url" FROM "Link";
DROP TABLE "Link";
ALTER TABLE "new_Link" RENAME TO "Link";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
