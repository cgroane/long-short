"use server";

import { teams } from "@/drizzle/schema";
import { db } from "@/src/lib/db";

export const getAllTeams = async () => {
  try {
    const res = await db.select().from(teams);
    return res;
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
};