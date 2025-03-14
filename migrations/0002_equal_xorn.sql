ALTER TABLE "assessments" ALTER COLUMN "c1_value" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "c1_value" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "c2_value" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "c2_value" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "c3_value" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "c3_value" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "c4_value" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "c4_value" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "c5_value" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "c5_value" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "c1_score" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "c1_score" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "c2_score" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "c2_score" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "c3_score" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "c3_score" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "c4_score" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "c4_score" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "c5_score" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "c5_score" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "total_score" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "total_score" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "assessments" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "code" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "criteria_weights" ALTER COLUMN "course_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "criteria_weights" ALTER COLUMN "c1_weight" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "criteria_weights" ALTER COLUMN "c1_weight" SET DEFAULT 3;--> statement-breakpoint
ALTER TABLE "criteria_weights" ALTER COLUMN "c2_weight" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "criteria_weights" ALTER COLUMN "c2_weight" SET DEFAULT 2;--> statement-breakpoint
ALTER TABLE "criteria_weights" ALTER COLUMN "c3_weight" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "criteria_weights" ALTER COLUMN "c3_weight" SET DEFAULT 2;--> statement-breakpoint
ALTER TABLE "criteria_weights" ALTER COLUMN "c4_weight" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "criteria_weights" ALTER COLUMN "c4_weight" SET DEFAULT 2;--> statement-breakpoint
ALTER TABLE "criteria_weights" ALTER COLUMN "c5_weight" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "criteria_weights" ALTER COLUMN "c5_weight" SET DEFAULT 3;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "criteria_weights" ADD CONSTRAINT "criteria_weights_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "courses" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "criteria_weights" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "criteria_weights" DROP COLUMN "updated_at";