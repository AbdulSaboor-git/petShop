/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Moderator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Moderator" DROP CONSTRAINT "Moderator_inventoryId_fkey";

-- DropForeignKey
ALTER TABLE "Moderator" DROP CONSTRAINT "Moderator_userId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_inventoryId_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Inventory";

-- DropTable
DROP TABLE "Moderator";

-- DropTable
DROP TABLE "Product";
