-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "user_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar(10) DEFAULT 'base' NOT NULL,
	"alma_mater_team_id" integer,
	"alma_mater_custom" varchar(255),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "user_profiles_username_key" UNIQUE("username"),
	CONSTRAINT "user_profiles_email_key" UNIQUE("email"),
	CONSTRAINT "check_alma_mater_one_or_none" CHECK (alma_mater_team_id IS NOT NULL AND alma_mater_custom IS NULL) OR (alma_mater_team_id IS NULL AND alma_mater_custom IS NOT NULL) OR (alma_mater_team_id IS NULL AND alma_mater_custom IS NULL),
	CONSTRAINT "user_profiles_role_check" CHECK (CHECK (role::text = ANY(ARRAY['admin'::varchar, 'base'::varchar]::text[])
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"team_id" integer PRIMARY KEY NOT NULL,
	"school" varchar(255) NOT NULL,
	"mascot" varchar(100),
	"abbreviation" varchar(20),
	"alternate_names" text[],
	"conference" varchar(100),
	"division" varchar(100),
	"classification" varchar(50),
	"color" varchar(50),
	"alternate_color" varchar(50),
	"logos" text[],
	"twitter" varchar(100),
	"venue_name" varchar(255),
	"city" varchar(100),
	"state" varchar(100),
	"timezone" varchar(50),
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"capacity" integer,
	"grass" boolean,
	"dome" boolean,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "seasons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nominal_year" integer NOT NULL,
	"start_year" integer NOT NULL,
	"end_year" integer NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "seasons_nominal_year_key" UNIQUE("nominal_year"),
	CONSTRAINT "seasons_start_year_key" UNIQUE("start_year"),
	CONSTRAINT "seasons_end_year_key" UNIQUE("end_year")
);
--> statement-breakpoint
CREATE TABLE "polls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"poll_id" varchar(20),
	"season_id" uuid NOT NULL,
	"week_number" integer NOT NULL,
	"poll_date" date NOT NULL,
	"poll_type" varchar(50) DEFAULT 'AP',
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "polls_poll_id_key" UNIQUE("poll_id")
);
--> statement-breakpoint
CREATE TABLE "rankings" (
	"ranking_id" serial PRIMARY KEY NOT NULL,
	"poll_id" varchar(20) NOT NULL,
	"team_id" integer NOT NULL,
	"rank" integer NOT NULL,
	"points" integer,
	"first_place_votes" integer DEFAULT 0,
	"record" varchar(20),
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "rankings_poll_id_rank_key" UNIQUE("poll_id","rank"),
	CONSTRAINT "rankings_poll_id_team_id_key" UNIQUE("poll_id","team_id")
);
--> statement-breakpoint
CREATE TABLE "picks" (
	"pick_id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"team_id" integer NOT NULL,
	"season_id" uuid NOT NULL,
	"prediction_type" varchar(10) NOT NULL,
	"starting_rank" integer,
	"ending_rank" integer,
	"points_earned" integer DEFAULT 0,
	"picked_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "picks_user_id_season_id_team_id_key" UNIQUE("user_id","team_id","season_id"),
	CONSTRAINT "picks_prediction_type_check" CHECK (CHECK (prediction_type::text = ANY(ARRAY['IMPROVE'::varchar, 'WORSEN'::varchar]::text[])
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid DEFAULT public.uuid_generate_v7() NOT NULL,
	"name" text,
	"created" timestamp DEFAULT LOCALTIMESTAMP NOT NULL,
	"updated" timestamp DEFAULT LOCALTIMESTAMP NOT NULL,
	"deleted" timestamp,
	"compute_id" uuid
);
--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "fk_alma_mater_team" FOREIGN KEY ("alma_mater_team_id") REFERENCES "public"."teams"("team_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "polls" ADD CONSTRAINT "polls_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rankings" ADD CONSTRAINT "rankings_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("poll_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rankings" ADD CONSTRAINT "rankings_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("team_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "picks" ADD CONSTRAINT "picks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "picks" ADD CONSTRAINT "picks_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("team_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "picks" ADD CONSTRAINT "picks_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_user_profiles_email" ON "user_profiles" USING btree ("email" text_ops);--> statement-breakpoint
CREATE INDEX "idx_user_profiles_username" ON "user_profiles" USING btree ("username" text_ops);--> statement-breakpoint
CREATE INDEX "idx_teams_conference" ON "teams" USING btree ("conference" text_ops);--> statement-breakpoint
CREATE INDEX "idx_teams_school" ON "teams" USING btree ("school" text_ops);--> statement-breakpoint
CREATE INDEX "idx_polls_season" ON "polls" USING btree ("season_id" int4_ops,"week_number" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_rankings_poll" ON "rankings" USING btree ("poll_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_rankings_team" ON "rankings" USING btree ("team_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_picks_season" ON "picks" USING btree ("season_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_picks_team_season" ON "picks" USING btree ("team_id" uuid_ops,"season_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_picks_user_season" ON "picks" USING btree ("user_id" uuid_ops,"season_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "tenants_pkey" ON "tenants" USING btree ("id" uuid_ops);
*/