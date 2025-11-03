import { pgTable, index, foreignKey, unique, check, uuid, varchar, integer, timestamp, text, numeric, boolean, date, serial, uniqueIndex } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const userProfiles = pgTable("user_profiles", {
	userId: uuid("user_id").primaryKey().notNull(),
	username: varchar({ length: 100 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	role: varchar({ length: 10 }).default('base').notNull(),
	almaMaterTeamId: integer("alma_mater_team_id"),
	almaMaterCustom: varchar("alma_mater_custom", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_user_profiles_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("idx_user_profiles_username").using("btree", table.username.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.almaMaterTeamId],
			foreignColumns: [teams.teamId],
			name: "fk_alma_mater_team"
		}),
	unique("user_profiles_username_key").on(table.username),
	unique("user_profiles_email_key").on(table.email),
	check("check_alma_mater_one_or_none", sql`alma_mater_team_id IS NOT NULL AND alma_mater_custom IS NULL) OR (alma_mater_team_id IS NULL AND alma_mater_custom IS NOT NULL) OR (alma_mater_team_id IS NULL AND alma_mater_custom IS NULL`),
	check("user_profiles_role_check", sql`CHECK (role::text = ANY(ARRAY['admin'::varchar, 'base'::varchar]::text[]`),
]);

export const teams = pgTable("teams", {
	teamId: integer("team_id").primaryKey().notNull(),
	school: varchar({ length: 255 }).notNull(),
	mascot: varchar({ length: 100 }),
	abbreviation: varchar({ length: 20 }),
	alternateNames: text("alternate_names").array(),
	conference: varchar({ length: 100 }),
	division: varchar({ length: 100 }),
	classification: varchar({ length: 50 }),
	color: varchar({ length: 50 }),
	alternateColor: varchar("alternate_color", { length: 50 }),
	logos: text().array(),
	twitter: varchar({ length: 100 }),
	venueName: varchar("venue_name", { length: 255 }),
	city: varchar({ length: 100 }),
	state: varchar({ length: 100 }),
	timezone: varchar({ length: 50 }),
	latitude: numeric({ precision: 10, scale:  8 }),
	longitude: numeric({ precision: 11, scale:  8 }),
	capacity: integer(),
	grass: boolean(),
	dome: boolean(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_teams_conference").using("btree", table.conference.asc().nullsLast().op("text_ops")),
	index("idx_teams_school").using("btree", table.school.asc().nullsLast().op("text_ops")),
]);

export const seasons = pgTable("seasons", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	nominalYear: integer("nominal_year").notNull(),
	startYear: integer("start_year").notNull(),
	endYear: integer("end_year").notNull(),
	startDate: date("start_date").notNull(),
	endDate: date("end_date").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	unique("seasons_nominal_year_key").on(table.nominalYear),
	unique("seasons_start_year_key").on(table.startYear),
	unique("seasons_end_year_key").on(table.endYear),
]);

export const polls = pgTable("polls", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	pollId: varchar("poll_id", { length: 20 }),
	seasonId: uuid("season_id").notNull(),
	weekNumber: integer("week_number").notNull(),
	pollDate: date("poll_date").notNull(),
	pollType: varchar("poll_type", { length: 50 }).default('AP'),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_polls_season").using("btree", table.seasonId.asc().nullsLast().op("int4_ops"), table.weekNumber.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.seasonId],
			foreignColumns: [seasons.id],
			name: "polls_season_id_fkey"
		}),
	unique("polls_poll_id_key").on(table.pollId),
]);

export const rankings = pgTable("rankings", {
	rankingId: serial("ranking_id").primaryKey().notNull(),
	pollId: varchar("poll_id", { length: 20 }).notNull(),
	teamId: integer("team_id").notNull(),
	rank: integer().notNull(),
	points: integer(),
	firstPlaceVotes: integer("first_place_votes").default(0),
	record: varchar({ length: 20 }),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_rankings_poll").using("btree", table.pollId.asc().nullsLast().op("text_ops")),
	index("idx_rankings_team").using("btree", table.teamId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.pollId],
			foreignColumns: [polls.pollId],
			name: "rankings_poll_id_fkey"
		}),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.teamId],
			name: "rankings_team_id_fkey"
		}),
	unique("rankings_poll_id_rank_key").on(table.pollId, table.rank),
	unique("rankings_poll_id_team_id_key").on(table.pollId, table.teamId),
]);

export const picks = pgTable("picks", {
	pickId: serial("pick_id").primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	teamId: integer("team_id").notNull(),
	seasonId: uuid("season_id").notNull(),
	predictionType: varchar("prediction_type", { length: 10 }).notNull(),
	startingRank: integer("starting_rank"),
	endingRank: integer("ending_rank"),
	pointsEarned: integer("points_earned").default(0),
	pickedAt: timestamp("picked_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_picks_season").using("btree", table.seasonId.asc().nullsLast().op("uuid_ops")),
	index("idx_picks_team_season").using("btree", table.teamId.asc().nullsLast().op("uuid_ops"), table.seasonId.asc().nullsLast().op("int4_ops")),
	index("idx_picks_user_season").using("btree", table.userId.asc().nullsLast().op("uuid_ops"), table.seasonId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [userProfiles.userId],
			name: "picks_user_id_fkey"
		}),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.teamId],
			name: "picks_team_id_fkey"
		}),
	foreignKey({
			columns: [table.seasonId],
			foreignColumns: [seasons.id],
			name: "picks_season_id_fkey"
		}),
	unique("picks_user_id_season_id_team_id_key").on(table.userId, table.teamId, table.seasonId),
	check("picks_prediction_type_check", sql`CHECK (prediction_type::text = ANY(ARRAY['IMPROVE'::varchar, 'WORSEN'::varchar]::text[]`),
]);

export const tenants = pgTable("tenants", {
	id: uuid().default(sql`public.uuid_generate_v7()`).notNull(),
	name: text(),
	created: timestamp({ mode: 'string' }).default(sql`LOCALTIMESTAMP`).notNull(),
	updated: timestamp({ mode: 'string' }).default(sql`LOCALTIMESTAMP`).notNull(),
	deleted: timestamp({ mode: 'string' }),
	computeId: uuid("compute_id"),
}, (table) => [
	uniqueIndex("tenants_pkey").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
]);
