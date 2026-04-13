-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "googleId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "logDate" TIMESTAMP(3) NOT NULL,
    "moodRating" INTEGER NOT NULL,
    "anxietyLevel" INTEGER NOT NULL,
    "sleepHours" DOUBLE PRECISION NOT NULL,
    "sleepQuality" INTEGER NOT NULL,
    "sleepDisturbances" TEXT,
    "activityType" TEXT,
    "activityDurationMin" INTEGER NOT NULL,
    "socialFrequency" INTEGER NOT NULL,
    "stressLevel" INTEGER NOT NULL,
    "symptomsPresent" BOOLEAN NOT NULL DEFAULT false,
    "symptomsSeverity" INTEGER,
    "symptomsNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "DailyLog_userId_logDate_idx" ON "DailyLog"("userId", "logDate");

-- CreateIndex
CREATE UNIQUE INDEX "DailyLog_userId_logDate_key" ON "DailyLog"("userId", "logDate");

-- AddForeignKey
ALTER TABLE "DailyLog" ADD CONSTRAINT "DailyLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
