CREATE TYPE "public"."payment_method" AS ENUM('cash', 'pix', 'credit_card', 'debit_card', 'meal_voucher');--> statement-breakpoint
CREATE TABLE "product_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "product_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "company_payment_methods" (
	"company_id" uuid NOT NULL,
	"method" "payment_method" NOT NULL,
	CONSTRAINT "company_payment_methods_company_id_method_pk" PRIMARY KEY("company_id","method")
);
--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "logo_file_name" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "category_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "company_payment_methods" ADD CONSTRAINT "company_payment_methods_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE restrict ON UPDATE no action;