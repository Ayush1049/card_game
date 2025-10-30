-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "count_players" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "game" (
    "room_id" TEXT NOT NULL,
    "count_players" INTEGER NOT NULL,
    "players" TEXT[]
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_name_key" ON "user"("name");

-- CreateIndex
CREATE UNIQUE INDEX "room_id_key" ON "room"("id");

-- CreateIndex
CREATE UNIQUE INDEX "room_username_key" ON "room"("username");

-- CreateIndex
CREATE UNIQUE INDEX "game_room_id_key" ON "game"("room_id");
