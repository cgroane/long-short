import db from ".."

export const isConnected = async () => {
  await db.$client.options
}