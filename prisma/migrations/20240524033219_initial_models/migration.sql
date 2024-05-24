-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "monthly_income" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "susep" TEXT NOT NULL,
    "end_date_to_hire" TIMESTAMP(3) NOT NULL,
    "min_first_contribution" DOUBLE PRECISION NOT NULL,
    "min_extra_contribution" DOUBLE PRECISION NOT NULL,
    "min_age_for_contract" INTEGER NOT NULL,
    "min_age_for_benefit" INTEGER NOT NULL,
    "first_withdrawal_period" INTEGER NOT NULL,
    "withdrawal_period" INTEGER NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "first_contribution" DOUBLE PRECISION NOT NULL,
    "hired_at" TIMESTAMP(3) NOT NULL,
    "age_for_retirement" INTEGER NOT NULL,
    "last_withdrawal_at" TIMESTAMP(3) NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clients_cpf_email_idx" ON "clients"("cpf", "email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_cpf_email_key" ON "clients"("cpf", "email");

-- CreateIndex
CREATE INDEX "products_susep_idx" ON "products"("susep");

-- CreateIndex
CREATE UNIQUE INDEX "products_susep_key" ON "products"("susep");

-- CreateIndex
CREATE INDEX "plans_productId_clientId_idx" ON "plans"("productId", "clientId");

-- AddForeignKey
ALTER TABLE "plans" ADD CONSTRAINT "plans_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plans" ADD CONSTRAINT "plans_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
