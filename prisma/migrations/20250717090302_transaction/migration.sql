-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "category" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "title" VARCHAR NOT NULL,
    "nominal" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_category_key" ON "categories"("category");

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
