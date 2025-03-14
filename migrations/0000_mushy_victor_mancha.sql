CREATE TABLE "assessment_periods" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"course_id" integer NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"candidate_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"c1_value" numeric NOT NULL,
	"c2_value" numeric NOT NULL,
	"c3_value" numeric NOT NULL,
	"c4_value" numeric NOT NULL,
	"c5_value" numeric NOT NULL,
	"c1_score" numeric NOT NULL,
	"c2_score" numeric NOT NULL,
	"c3_score" numeric NOT NULL,
	"c4_score" numeric NOT NULL,
	"c5_score" numeric NOT NULL,
	"total_score" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidates" (
	"id" serial PRIMARY KEY NOT NULL,
	"npm" varchar(20) NOT NULL,
	"name" varchar(100) NOT NULL,
	"semester" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "candidates_npm_unique" UNIQUE("npm")
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(20) NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "courses_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "criteria_weights" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"c1_weight" numeric DEFAULT '3' NOT NULL,
	"c2_weight" numeric DEFAULT '2' NOT NULL,
	"c3_weight" numeric DEFAULT '2' NOT NULL,
	"c4_weight" numeric DEFAULT '2' NOT NULL,
	"c5_weight" numeric DEFAULT '3' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
