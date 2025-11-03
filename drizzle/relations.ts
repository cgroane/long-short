import { relations } from "drizzle-orm/relations";
import { teams, userProfiles, seasons, polls, rankings, picks } from "./schema";

export const userProfilesRelations = relations(userProfiles, ({one, many}) => ({
	team: one(teams, {
		fields: [userProfiles.almaMaterTeamId],
		references: [teams.teamId]
	}),
	picks: many(picks),
}));

export const teamsRelations = relations(teams, ({many}) => ({
	userProfiles: many(userProfiles),
	rankings: many(rankings),
	picks: many(picks),
}));

export const pollsRelations = relations(polls, ({one, many}) => ({
	season: one(seasons, {
		fields: [polls.seasonId],
		references: [seasons.id]
	}),
	rankings: many(rankings),
}));

export const seasonsRelations = relations(seasons, ({many}) => ({
	polls: many(polls),
	picks: many(picks),
}));

export const rankingsRelations = relations(rankings, ({one}) => ({
	poll: one(polls, {
		fields: [rankings.pollId],
		references: [polls.pollId]
	}),
	team: one(teams, {
		fields: [rankings.teamId],
		references: [teams.teamId]
	}),
}));

export const picksRelations = relations(picks, ({one}) => ({
	userProfile: one(userProfiles, {
		fields: [picks.userId],
		references: [userProfiles.userId]
	}),
	team: one(teams, {
		fields: [picks.teamId],
		references: [teams.teamId]
	}),
	season: one(seasons, {
		fields: [picks.seasonId],
		references: [seasons.id]
	}),
}));