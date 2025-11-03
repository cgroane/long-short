"use server";

import { nile } from "@/src/app/api/[...nile]/nile";

export const getUsers = async () => {
  try {
    const users = await nile.db.query("SELECT * FROM users");
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}