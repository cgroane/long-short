import { getUsers } from "./[profile]/actions";

export default async function AccountPage() {
  const usersData = await getUsers();
  console.log("Users Data:", usersData);
  return (
    <div>
      <h1>Account Page</h1>
      <pre>{JSON.stringify(usersData, null, 2)}</pre>
    </div>
  );

}