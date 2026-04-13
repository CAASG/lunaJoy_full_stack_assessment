-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "googleId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DailyLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "logDate" DATETIME NOT NULL,
    "moodRating" INTEGER NOT NULL,
    "anxietyLevel" INTEGER NOT NULL,
    "sleepHours" REAL NOT NULL,
    "sleepQuality" INTEGER NOT NULL,
    "sleepDisturbances" TEXT,
    "activityType" TEXT,
    "activityDurationMin" INTEGER NOT NULL,
    "socialFrequency" INTEGER NOT NULL,
    "stressLevel" INTEGER NOT NULL,
    "symptomsPresent" BOOLEAN NOT NULL DEFAULT false,
    "symptomsSeverity" INTEGER,
    "symptomsNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailyLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "DailyLog_userId_logDate_idx" ON "DailyLog"("userId", "logDate");

-- CreateIndex
CREATE UNIQUE INDEX "DailyLog_userId_logDate_key" ON "DailyLog"("userId", "logDate");
