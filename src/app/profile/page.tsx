import { getServerSession } from "next-auth";
import NotFound from "../not-found";
import ProfileClient from "./client";
import { getCurrentUser } from "@/lib/auth";
import { Box, Callout, Flex, Text } from "@radix-ui/themes";
import { CrossCircledIcon } from "@radix-ui/react-icons";

export default async function RootLayout() {
  const session = await getServerSession();
  if (!session?.user) {
    return <NotFound></NotFound>;
  }

  const user = await getCurrentUser();

  if (!user) {
    return (
      <Box style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <br></br>
        <Flex direction="column" gap="4" align="center">
          <Text size="8" weight="bold" color="red">
            Unable to Load Profile
          </Text>
          <Callout.Root color="red">
            <Callout.Icon>
              <CrossCircledIcon />
            </Callout.Icon>
            <Callout.Text>
              Could not connect to the database. This is likely due to a MongoDB
              connection issue. Please check:
              <ul style={{ marginTop: "10px", marginBottom: "0" }}>
                <li>Your MongoDB Atlas connection is active</li>
                <li>Your IP address is whitelisted in MongoDB Atlas</li>
                <li>Your MONGODB_URI environment variable is correct</li>
                <li>
                  Consider downgrading to Node.js v20 LTS if using v22 (Windows
                  TLS compatibility issue)
                </li>
              </ul>
            </Callout.Text>
          </Callout.Root>
          <Text>
            You are logged in as: <strong>{session.user.email}</strong>
          </Text>
        </Flex>
      </Box>
    );
  }

  return (
    <>
      <br></br>
      <ProfileClient account={user}></ProfileClient>
    </>
  );
}

export const revalidate = 0;
