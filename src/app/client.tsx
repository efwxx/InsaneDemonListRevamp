"use client";
import AdComponent from "@/components/Ad";
import InfoCard from "@/components/InfoCard";
import { Avatar, Box, Card, Flex, Grid, Text } from "@radix-ui/themes";
import Script from "next/script";
import { useEffect, useState } from "react";

interface info {
  admins: Record<any, any>;
}

export default function HomePage({ admins }: info) {
  let [width, setWidth] = useState(0);

  let getWidth = () => (typeof window === "undefined" ? 0 : window.innerWidth);

  useEffect(() => {
    setWidth(getWidth());
  });

  return (
    <main>
      <br></br>
      <Flex gap="4" style={{ placeItems: "center", justifyContent: "center" }}>
        <img
          src="/favicon.ico"
          style={{ width: "clamp(40px, 10vw, 70px)", height: "auto" }}
          alt="Logo"
        ></img>
        <Text size="9" className="header" style={{ display: "contents" }}>
          The Insane Demon List
        </Text>
        <img
          src="/favicon.ico"
          style={{ width: "clamp(40px, 10vw, 70px)", height: "auto" }}
          alt="Logo"
        ></img>
      </Flex>
      <br></br>
      <Grid style={{ width: "100%" }}>
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
      <br></br>
      <Text size="5" className="header">
        The Official Demonlist that has insane demons ranked based on
        difficulty!
      </Text>
      <Grid
        columns={width > 1200 ? "2" : "1"}
        gap="9"
        style={{
          marginTop: "60px",
          [width < 700 ? "paddingTop" : "padding"]: "50px",
          maxWidth: "1800px",
          margin: "auto",
        }}
      >
        <Box>
          <Text
            className="header"
            size="8"
            align="left"
            style={{ textAlign: "left !important" as any }}
          >
            Rules
          </Text>

          <Text size="4">
            <p>
              We have officially adopted most of the{" "}
              <a
                href="https://pointercrate.com/guidelines/index"
                target="_blank"
              >
                Pointercrate Demonlist&apos;s guidelines
              </a>
              . This means that your record must be acceptable on Pointercrate
              for it to be acceptable on this list! However, we also have some
              extra rules, specific to <abbr>IDL</abbr>, as well as some
              leniency changes:
            </p>
            <ul>
              <li>
                The level must be Rated &quot;Insane Demon&quot; for at least a
                week in order to be added. Also, a level needs to be rated to
                another difficulty for a week in order to be removed from the
                list. Levels that have been removed for a week will be seen at
                the &quot;Removed Levels&quot; section, which can be found at
                the bottom of the legacy list.
              </li>
              <li>
                You are <strong>required</strong> to have audible clicks/taps
                for the entire completion for it to be accepted. If you play on
                mobile and can not record your taps, you can enable the show
                taps settings on your phone.
              </li>
              <li>
                Raw footage is not required, but feel free to submit it,
                especially if your clicks/taps are difficult to hear on your
                completion.
              </li>
              <li>
                If you use a customized <abbr>LDM</abbr> for the level, we will
                review it ourselves and judge if it it acceptable. If you are
                uncertain whether or not it is acceptable, feel free to ask us
                in our Discord server.
              </li>
              <li>
                Please do not submit multiple records of the same record
                (don&apos;t submit dupes)!
              </li>
              <li>
                Levels completed with the use of Physics Bypass or levels
                completed using the 2.1 GDPS (or other GDPS&apos;) will not be
                accepted. An exception to the rule is if a level is completed
                prior to the release of 2.2.
              </li>
              <li>
                PLATFORM GUIDELINES: In levels with checkpoints, you may cut at
                each checkpoint. In levels without checkpoints do not cut (for
                example speedrun levels), unless it is a jump king styled level.
                In jump styled levels you can edit out big falls, as long as you
                have a connecting run. You do not need to show the prior death
                before each checkpoint. Raw footage is not required if you have
                clicks and appropriate cuts. We will not accept practice mode,
                or anything else that will normally be denied for classic
                levels. You may resubmit platformer levels for a better time if
                you want to. Platformer saving mod will NOT be accepted.
              </li>
              <li>
                Your record must show the previous attempt/death before the
                successful run in order to check for legitimacy.
              </li>
            </ul>
          </Text>
          <Box style={{ marginTop: "40px" }}>
            <Text
              className="header"
              size="8"
              align="left"
              style={{ textAlign: "left !important" as any }}
            >
              Discord Server
            </Text>
            <br></br>
            <Card
              style={{
                marginTop: "15px",
                width: "fit-content",
                padding: "20px",
              }}
            >
              <Grid>
                <Text size="7" as="p" align="center">
                  <a
                    href="https://discord.gg/7JbFjRqSQ4"
                    target="_blank"
                    style={{ textDecoration: "none" }}
                  >
                    Insane Demon List Discord
                  </a>
                </Text>
                <br></br>
                <iframe
                  src="https://discord.com/widget?id=820784322456977438&theme=dark"
                  width="350"
                  height="500"
                  frameBorder="0"
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                  style={{ borderRadius: "20px" }}
                ></iframe>
                <br></br>
                <Text size="1" style={{ maxWidth: "350px" }}>
                  If you wanna join our amazing discord community or want to DM
                  the staff personally about something, you can join by clicking
                  the link!
                </Text>
              </Grid>
            </Card>
          </Box>
        </Box>
        <Box>
          <Text
            className="header"
            size="7"
            align="left"
            style={{ textAlign: "left !important" as any }}
          >
            List Leaders
          </Text>
          <Flex wrap="wrap" gap="3">
            {admins.leaders.map((e: Record<any, any>) => (
              <InfoCard
                name={e.name}
                tag={e.tag}
                channel={e.channel}
                avatar={e.avatar}
                key={e.id}
                id={e.id}
              ></InfoCard>
            ))}
          </Flex>
          <Text
            className="header"
            size="7"
            align="left"
            style={{ marginTop: "30px", textAlign: "left !important" as any }}
          >
            List Moderators
          </Text>
          <Flex wrap="wrap" gap="3">
            {admins.moderators.map((e: Record<any, any>) => (
              <InfoCard
                name={e.name}
                tag={e.tag}
                channel={e.channel}
                avatar={e.avatar}
                key={e.id}
                id={e.id}
              ></InfoCard>
            ))}
          </Flex>
          <Text
            className="header"
            size="7"
            align="left"
            style={{ marginTop: "30px", textAlign: "left !important" as any }}
          >
            Platformer Helpers
          </Text>
          <Flex wrap="wrap" gap="3">
            {admins.plat_helpers.map((e: Record<any, any>) => (
              <InfoCard
                name={e.name}
                tag={e.tag}
                channel={e.channel}
                avatar={e.avatar}
                key={e.id}
                id={e.id}
              ></InfoCard>
            ))}
          </Flex>
          <Text
            className="header"
            size="7"
            align="left"
            style={{ marginTop: "30px", textAlign: "left !important" as any }}
          >
            List Helpers
          </Text>
          <Flex wrap="wrap" gap="3">
            {admins.helpers.map((e: Record<any, any>) => (
              <InfoCard
                name={e.name}
                tag={e.tag}
                channel={e.channel}
                avatar={e.avatar}
                key={e.id}
                id={e.id}
              ></InfoCard>
            ))}
          </Flex>
          <Text
            className="header"
            size="7"
            align="left"
            style={{ marginTop: "30px", textAlign: "left !important" as any }}
          >
            Server Administrators
          </Text>
          <Flex wrap="wrap" gap="3">
            {admins.server_admins.map((e: Record<any, any>) => (
              <InfoCard
                name={e.name}
                tag={e.tag}
                channel={e.channel}
                avatar={e.avatar}
                key={e.id}
                id={e.id}
              ></InfoCard>
            ))}
          </Flex>
          <Text
            className="header"
            size="7"
            align="left"
            style={{ marginTop: "30px", textAlign: "left !important" as any }}
          >
            Server Moderators
          </Text>
          <Flex wrap="wrap" gap="3">
            {admins.server_mods.map((e: Record<any, any>) => (
              <InfoCard
                name={e.name}
                tag={e.tag}
                channel={e.channel}
                avatar={e.avatar}
                key={e.id}
                id={e.id}
              ></InfoCard>
            ))}
          </Flex>
          <Text
            className="header"
            size="7"
            align="left"
            style={{ marginTop: "30px", textAlign: "left !important" as any }}
          >
            Developers
          </Text>
          <Flex wrap="wrap" gap="3">
            {admins.developers.map((e: Record<any, any>) => (
              <InfoCard
                name={e.name}
                tag={e.tag}
                channel={e.channel}
                avatar={e.avatar}
                key={e.id}
                id={e.id}
              ></InfoCard>
            ))}
          </Flex>
        </Box>
      </Grid>
    </main>
  );
}

export const revalidate = 0;
