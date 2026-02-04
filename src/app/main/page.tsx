import AdComponent from "@/components/Ad";
import Level from "@/components/LevelCard";
import { Flex, Grid, Text } from "@radix-ui/themes";

export default async function Home() {
  let req = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/levels?start=0&end=75`,
    { cache: "no-cache" },
  );

  if (!req.ok) {
    return (
      <main>
        <br></br>
        <Flex
          direction="column"
          gap="4"
          align="center"
          style={{ padding: "20px" }}
        >
          <Text size="8" color="red">
            Error Loading Levels
          </Text>
          <Text size="4">Status: {req.status}</Text>
          <Text size="3">
            The database connection failed. Please check your MongoDB
            connection.
          </Text>
        </Flex>
      </main>
    );
  }

  let levels = [];
  try {
    const text = await req.text();
    if (text) {
      levels = JSON.parse(text);
    }
  } catch (error) {
    return (
      <main>
        <br></br>
        <Flex
          direction="column"
          gap="4"
          align="center"
          style={{ padding: "20px" }}
        >
          <Text size="8" color="red">
            Error Parsing Response
          </Text>
          <Text size="3">
            Failed to parse API response. The server may be experiencing issues.
          </Text>
        </Flex>
      </main>
    );
  }

  return (
    <main>
      <br></br>
      <Flex
        gap="4"
        style={{
          placeItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          padding: "0 10px",
        }}
      >
        <img
          src="/favicon.ico"
          height="70px"
          alt="Logo"
          style={{ width: "clamp(40px, 10vw, 70px)", height: "auto" }}
        ></img>
        <Text
          size="9"
          className="header"
          style={{ display: "contents", fontSize: "clamp(2rem, 6vw, 3rem)" }}
        >
          Main List
        </Text>
        <img
          src="/favicon.ico"
          height="70px"
          alt="Logo"
          style={{ width: "clamp(40px, 10vw, 70px)", height: "auto" }}
        ></img>
      </Flex>
      <br></br>
      <Text
        size="5"
        className="header"
        style={{ fontSize: "clamp(1rem, 3vw, 1.5rem)", padding: "0 15px" }}
      >
        This part of the list shows the top 75 hardest insane demons on the
        list!
      </Text>
      <br></br>
      <br></br>
      {levels.map((e: Record<any, any>) => (
        <Grid
          style={{
            placeItems: "center",
            width: "100%",
            maxWidth: "1650px",
            margin: "0 auto",
          }}
          key={e.id}
        >
          {(e.position - 1) % 5 == 0 ? (
            <Grid style={{ width: "min(100%, 1650px)" }}>
              <AdComponent>
                <ins
                  className="adsbygoogle"
                  style={{ display: "block" }}
                  data-ad-client="ca-pub-4543250064393866"
                  data-ad-slot="4403955848"
                  data-ad-format="auto"
                  data-full-width-responsive="true"
                ></ins>
              </AdComponent>
            </Grid>
          ) : (
            ""
          )}
          <Level level={e}></Level>
          <br></br>
        </Grid>
      ))}
    </main>
  );
}

export const revalidate = 0;
