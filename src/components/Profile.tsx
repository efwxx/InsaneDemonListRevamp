import hexToRGB from "@/functions/hexToRGB";
import calc_points from "@/functions/points";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DotFilledIcon,
  DotsHorizontalIcon,
  ExclamationTriangleIcon,
  ExternalLinkIcon,
  InfoCircledIcon,
  SpeakerLoudIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons";
import {
  Badge,
  Box,
  Callout,
  Flex,
  Grid,
  HoverCard,
  IconButton,
  Popover,
  SegmentedControl,
  Table,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import dayjs from "dayjs";
import styles from "@/app/profile.module.css";
import { useState } from "react";
import AdComponent from "./Ad";

interface info {
  profile: Record<any, any>;
  metadata: Record<any, any>;
  nationality?: boolean;
  icons?: Array<string>;
  platformer: boolean;
}

export default function Profile({
  profile,
  metadata,
  nationality,
  icons,
  platformer,
}: info) {
  function secondsToTime(seconds: number) {
    let hours = (seconds - (seconds % 3600)) / 3600;
    let minutes = (seconds - hours * 3600 - (seconds % 60)) / 60;
    let secs = parseFloat((seconds - hours * 3600 - minutes * 60).toFixed(3));
    return `${hours ? `${hours}:` : ""}${hours || minutes ? `${!minutes ? "00" : minutes < 10 && hours ? `0${minutes}` : minutes}:` : ""}${!secs ? "00" : secs < 10 && (hours || minutes) ? `0${secs}` : secs}`;
  }
  let [type, setType] = useState<"classic" | "platformer">(
    platformer ? "platformer" : "classic",
  );
  let main = profile.records
    .sort((a: any, b: any) => a.level.position - b.level.position)
    .filter(
      (e: any, i: number, a: any) =>
        e.level.position < 76 && a[i - 1]?.level?.position != e.level.position,
    ).length;
  let extended = profile.records
    .sort((a: any, b: any) => a.level.position - b.level.position)
    .filter(
      (e: any, i: number, a: any) =>
        e.level.position > 75 &&
        e.level.position < 151 &&
        a[i - 1]?.level?.position != e.level.position,
    ).length;
  let legacy = profile.records
    .sort((a: any, b: any) => a.level.position - b.level.position)
    .filter(
      (e: any, i: number, a: any) =>
        e.level.position > 150 && a[i - 1]?.level?.position != e.level.position,
    ).length;
  return (
    <div className={styles.content}>
      <Grid style={{ placeItems: "center" }}>
        <SegmentedControl.Root
          size="3"
          defaultValue={platformer ? "platformer" : "classic"}
          onValueChange={(e) => setType(e as any)}
        >
          <SegmentedControl.Item value="classic">Classic</SegmentedControl.Item>
          <SegmentedControl.Item value="platformer">
            Platformer
          </SegmentedControl.Item>
        </SegmentedControl.Root>
        <br></br>
        <Grid style={{ width: "min(1000px, 100%)" }}>
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
        <Box
          style={{ padding: "30px", width: "min(1000px, 100%)" }}
          className={styles.hover}
        >
          <Flex justify={"center"} align="center" gap="9">
            {metadata.last[type] ? (
              <ChevronLeftIcon
                style={{ scale: 6 }}
                onClick={() =>
                  (window.location.href = `/${nationality ? "nationality" : "player"}/${metadata.last[type]}${type == "platformer" ? "?platformer=true" : ""}`)
                }
              ></ChevronLeftIcon>
            ) : (
              ""
            )}
            <Flex align="center" gap="3">
              <img
                src={
                  profile.nationality
                    ? `https://raw.githubusercontent.com/lipis/flag-icons/4f420bdd2e954f6da11220f1136fa181ed7019e7/flags/4x3/${profile.abbr}.svg`
                    : "https://github.com/ppy/osu-resources/blob/master/osu.Game.Resources/Textures/Flags/__.png?raw=true"
                }
                width="80"
                onClick={() => {
                  window.location.href = profile.nationality
                    ? `/nationality/${profile.abbr}${type == "platformer" ? "?platformer=true" : ""}`
                    : "#";
                }}
              ></img>
              <Flex align="center" gap="2">
                <Text
                  as="p"
                  align="center"
                  size="9"
                  weight="bold"
                  className={
                    type == "classic" && profile.hasAll150
                      ? "all-demons-gradient"
                      : ""
                  }
                >
                  {metadata[type]}. {profile.name}
                </Text>
                {type == "classic" && profile.hasAll150 ? (
                  <Tooltip content="Completed all 150 list demons!">
                    <Text
                      style={{
                        fontSize: "36px",
                        filter:
                          "drop-shadow(0 0 6px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 12px rgba(255, 165, 0, 0.7))",
                      }}
                    >
                      👑
                    </Text>
                  </Tooltip>
                ) : (
                  ""
                )}
              </Flex>
            </Flex>
            {metadata.next[type] ? (
              <ChevronRightIcon
                style={{ scale: 6 }}
                onClick={() =>
                  (window.location.href = `/${nationality ? "nationality" : "player"}/${metadata.next[type]}${type == "platformer" ? "?platformer=true" : ""}`)
                }
              ></ChevronRightIcon>
            ) : (
              ""
            )}
          </Flex>
          {profile.nationality ? (
            <>
              <br></br>
              <Flex align="center" gap="2" justify={"center"}>
                <Text as="p" align="center" size="6" weight="bold">
                  Nationality:{" "}
                  <a
                    href={`/nationality/${profile.abbr}${type == "platformer" ? "?platformer=true" : ""}`}
                    style={{ textDecoration: "none" }}
                  >
                    {profile.nationality.replaceAll("_", " ")}
                  </a>
                </Text>
                <img
                  src={
                    profile.nationality
                      ? `https://raw.githubusercontent.com/lipis/flag-icons/4f420bdd2e954f6da11220f1136fa181ed7019e7/flags/4x3/${profile.abbr}.svg`
                      : "https://github.com/ppy/osu-resources/blob/master/osu.Game.Resources/Textures/Flags/__.png?raw=true"
                  }
                  width="32"
                  onClick={() => {
                    window.location.href = profile.nationality
                      ? `/nationality/${profile.abbr}${type == "platformer" ? "?platformer=true" : ""}`
                      : "#";
                  }}
                ></img>
              </Flex>
            </>
          ) : (
            ""
          )}
          <br></br>
          {icons ? (
            <>
              <Flex gap={"7"} justify={"center"} align={"center"}>
                {icons.map((e) => (
                  <img key={e} src={e} width={"50"}></img>
                ))}
              </Flex>
              <br></br>
            </>
          ) : (
            ""
          )}
          <Flex
            gap="2"
            style={{ maxWidth: "100%" }}
            wrap="wrap"
            justify="center"
          >
            {profile.packs.filter((e: any) => e.type == type).length
              ? profile.packs
                  .filter((e: any) => e.type == type)
                  .map((e: any) => {
                    let rgb = hexToRGB(e.color);
                    return (
                      <Popover.Root key={e.id}>
                        <Popover.Trigger className={styles.pack}>
                          <Badge
                            style={{
                              backgroundColor: `rgba(${rgb?.r}, ${rgb?.g}, ${rgb?.b}, 0.5)`,
                              color: "white",
                              fontSize: "20px",
                              padding: "10px",
                              paddingRight: "17px",
                              borderRadius: "20px",
                            }}
                            key={e.name}
                          >
                            <DotFilledIcon></DotFilledIcon>
                            {e.name}
                          </Badge>
                        </Popover.Trigger>
                        <Popover.Content style={{ maxWidth: 200 }}>
                          <Text
                            size="5"
                            weight="bold"
                            style={{ textDecoration: "underline" }}
                          >
                            {e.name}
                          </Text>
                          <br></br>
                          <br></br>
                          {e.levels.map((x: any) => (
                            <div key={x.id}>
                              <Text size="5">
                                <a
                                  href={`/${e.type == "platformer" ? "platformer" : "level"}/${x.id}`}
                                  style={{ textDecoration: "none" }}
                                >
                                  {x.position > 150 ? "" : `#${x.position} - `}
                                  {x.name} by {x.publisher}
                                </a>
                              </Text>
                              <br></br>
                              <br></br>
                            </div>
                          ))}
                        </Popover.Content>
                      </Popover.Root>
                    );
                  })
              : ""}
          </Flex>
          <br></br>
          <IconButton
            style={{ position: "absolute", right: "10px", top: "10px" }}
            radius="full"
            color="teal"
            onClick={(e) => {
              e.target.dispatchEvent(
                new MouseEvent("contextmenu", {
                  bubbles: true,
                  clientX: e.currentTarget.getBoundingClientRect().x - 80,
                  clientY: e.currentTarget.getBoundingClientRect().y + 50,
                }),
              );
            }}
          >
            <DotsHorizontalIcon></DotsHorizontalIcon>
          </IconButton>
          {type == "classic" ? (
            <>
              <Text as="p" align="center" weight="bold">
                {main} mainlists, {extended} extended lists, {legacy} legacy
                lists, {main + extended} list levels, {main + extended + legacy}{" "}
                total
              </Text>
              {profile.hasAll150 ? (
                <>
                  <br></br>
                  <Callout.Root
                    color="gold"
                    style={{ maxWidth: "600px", margin: "0 auto" }}
                  >
                    <Callout.Icon>
                      <Text style={{ fontSize: "24px" }}>👑</Text>
                    </Callout.Icon>
                    <Callout.Text>
                      <Text weight="bold" size="4">
                        All 150 List Demons Completed!
                      </Text>
                      <br />
                      <Text size="2">
                        This player has beaten every demon on positions 1-150 of
                        the main list.
                      </Text>
                    </Callout.Text>
                  </Callout.Root>
                </>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </Box>
      </Grid>
      <br></br>
      <br></br>
      {type == "classic" ? (
        <>
          <Grid style={{ placeItems: "center" }}>
            <Box
              style={{
                padding: "20px",
                width: "min(1000px, 100%)",
                backgroundColor: "var(--light-blue)",
              }}
            >
              <Text
                size="9"
                as="p"
                align="center"
                weight="bold"
                style={{ textDecoration: "underline" }}
              >
                Verifications
              </Text>
              <br></br>
              <Grid style={{ placeItems: "center" }}>
                <Table.Root size="3" m="2" style={{ width: "90%" }}>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        #
                      </Table.ColumnHeaderCell>
                      {nationality ? (
                        <Table.ColumnHeaderCell
                          style={{ fontSize: "30px" }}
                          align="center"
                        >
                          Player
                        </Table.ColumnHeaderCell>
                      ) : (
                        ""
                      )}
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        Name
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        Link
                      </Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {profile.records
                      .filter((e: any) => e.verification)
                      .map((e: any) => (
                        <Table.Row key={e.id}>
                          <Table.RowHeaderCell
                            style={{ fontSize: "20px" }}
                            align="center"
                          >
                            {e.level.position}
                          </Table.RowHeaderCell>
                          {nationality ? (
                            <Table.RowHeaderCell
                              style={{ fontSize: "20px" }}
                              align="center"
                            >
                              <Flex align="center" gap="2" justify={"center"}>
                                <a
                                  href={`/player/${e.player.id}`}
                                  target="_self"
                                  style={{
                                    textDecoration: "none",
                                    lineBreak: "anywhere",
                                  }}
                                  className={styles.player}
                                >
                                  {e.player.name}
                                </a>
                                {e.beaten_when_weekly ? (
                                  <StarFilledIcon></StarFilledIcon>
                                ) : (
                                  ""
                                )}
                              </Flex>
                            </Table.RowHeaderCell>
                          ) : (
                            ""
                          )}
                          <Table.RowHeaderCell
                            style={{ fontSize: "20px" }}
                            align="center"
                          >
                            <a
                              href={`/level/${e.level.position}`}
                              target="_self"
                              style={{
                                textDecoration: "none",
                                lineBreak: "anywhere",
                              }}
                            >
                              {e.level.name}
                            </a>
                          </Table.RowHeaderCell>
                          <Table.RowHeaderCell
                            style={{ fontSize: "20px" }}
                            align="center"
                          >
                            <a href={e.link} target="_blank">
                              <IconButton color="violet">
                                <ExternalLinkIcon
                                  color="black"
                                  style={{ scale: "1.5" }}
                                ></ExternalLinkIcon>
                              </IconButton>
                            </a>
                          </Table.RowHeaderCell>
                        </Table.Row>
                      ))}
                  </Table.Body>
                </Table.Root>
              </Grid>
            </Box>
          </Grid>
          <br></br>
          <br></br>
          <Grid style={{ placeItems: "center" }}>
            <Box
              style={{
                padding: "20px",
                width: "min(1000px, 100%)",
                backgroundColor: "var(--light-blue)",
              }}
            >
              <Text
                size="9"
                as="p"
                align="center"
                weight="bold"
                style={{ textDecoration: "underline" }}
              >
                List Completions
              </Text>
              <br></br>
              <Grid style={{ placeItems: "center" }}>
                <Table.Root size="3" m="2" style={{ width: "90%" }}>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        #
                      </Table.ColumnHeaderCell>
                      {nationality ? (
                        <Table.ColumnHeaderCell
                          style={{ fontSize: "30px" }}
                          align="center"
                        >
                          Player
                        </Table.ColumnHeaderCell>
                      ) : (
                        ""
                      )}
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        Name
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        Link
                      </Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {profile.records
                      .filter(
                        (e: any) => e.level.position <= 150 && !e.verification,
                      )
                      .map((e: any, i: number, a: any) => {
                        let lastPos =
                          e.level.position == a.at(-1).level.position;
                        let between = !lastPos
                          ? [
                              a.findIndex(
                                (x: any) =>
                                  x.level.position == e.level.position,
                              ),
                              a.findLastIndex(
                                (x: any) =>
                                  x.level.position == e.level.position,
                              ),
                            ]
                          : a.findIndex(
                              (x: any, ind: number) =>
                                x.level.position == a.at(-1).level.position,
                            );
                        if (
                          (!lastPos && between[0] != i) ||
                          (lastPos && between != i)
                        )
                          return null;
                        return (
                          <Table.Row key={e.id}>
                            <Table.RowHeaderCell
                              style={{ fontSize: "20px" }}
                              align="center"
                            >
                              {e.level.position}
                            </Table.RowHeaderCell>
                            {nationality ? (
                              <Table.RowHeaderCell
                                style={{ fontSize: "20px" }}
                                align="center"
                              >
                                {(lastPos
                                  ? a.slice(between)
                                  : a.slice(i, between[1] + 1)
                                ).map((x: any) => (
                                  <div key={x.player.id}>
                                    <Flex
                                      align="center"
                                      gap="2"
                                      justify={"center"}
                                    >
                                      <a
                                        href={`/player/${x.player.id}`}
                                        target="_self"
                                        style={{
                                          textDecoration: "none",
                                          lineBreak: "anywhere",
                                        }}
                                        className={styles.player}
                                      >
                                        {x.player.name}
                                      </a>
                                      {x.beaten_when_weekly ? (
                                        <StarFilledIcon></StarFilledIcon>
                                      ) : (
                                        ""
                                      )}
                                    </Flex>
                                    <br></br>
                                  </div>
                                ))}
                              </Table.RowHeaderCell>
                            ) : (
                              ""
                            )}
                            <Table.RowHeaderCell
                              style={{ fontSize: "20px" }}
                              align="center"
                            >
                              <a
                                href={`/level/${e.level.position}`}
                                target="_self"
                                style={{
                                  textDecoration: "none",
                                  lineBreak: "anywhere",
                                }}
                                className={styles.player}
                              >
                                {e.level.name}
                              </a>
                            </Table.RowHeaderCell>
                            <Table.RowHeaderCell
                              style={{ fontSize: "20px" }}
                              align="center"
                            >
                              {(lastPos
                                ? a.slice(between)
                                : a.slice(i, between[1] + 1)
                              ).map((x: any) => (
                                <div key={x.link}>
                                  <a
                                    href={x.link}
                                    target="_blank"
                                    style={{
                                      paddingBottom: "16px",
                                      display: "inline-block",
                                    }}
                                  >
                                    <IconButton color="violet">
                                      <ExternalLinkIcon
                                        color="black"
                                        style={{ scale: "1.5" }}
                                      ></ExternalLinkIcon>
                                    </IconButton>
                                  </a>
                                  <br></br>
                                </div>
                              ))}
                            </Table.RowHeaderCell>
                          </Table.Row>
                        );
                      })
                      .filter((e: any) => e)}
                  </Table.Body>
                </Table.Root>
              </Grid>
            </Box>
          </Grid>
          <br></br>
          <br></br>
          <Grid style={{ placeItems: "center" }}>
            <Box
              style={{
                padding: "20px",
                width: "min(1000px, 100%)",
                backgroundColor: "var(--light-blue)",
              }}
            >
              <Text
                size="9"
                as="p"
                align="center"
                weight="bold"
                style={{ textDecoration: "underline" }}
              >
                Legacy Completions
              </Text>
              <br></br>
              <Grid style={{ placeItems: "center" }}>
                <Table.Root size="3" m="2" style={{ width: "90%" }}>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        #
                      </Table.ColumnHeaderCell>
                      {nationality ? (
                        <Table.ColumnHeaderCell
                          style={{ fontSize: "30px" }}
                          align="center"
                        >
                          Player
                        </Table.ColumnHeaderCell>
                      ) : (
                        ""
                      )}
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        Name
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        Link
                      </Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {profile.records
                      .filter(
                        (e: any) => e.level.position > 150 && !e.verification,
                      )
                      .map((e: any, i: number, a: any) => {
                        let lastPos =
                          e.level.position == a.at(-1).level.position;
                        let between = !lastPos
                          ? [
                              a.findIndex(
                                (x: any) =>
                                  x.level.position == e.level.position,
                              ),
                              a.findLastIndex(
                                (x: any) =>
                                  x.level.position == e.level.position,
                              ),
                            ]
                          : a.findIndex(
                              (x: any, ind: number) =>
                                x.level.position == a.at(-1).level.position,
                            );
                        if (
                          (!lastPos && between[0] != i) ||
                          (lastPos && between != i)
                        )
                          return null;
                        return (
                          <Table.Row key={e.id}>
                            <Table.RowHeaderCell
                              style={{ fontSize: "20px" }}
                              align="center"
                            >
                              {e.level.position}
                            </Table.RowHeaderCell>
                            {nationality ? (
                              <Table.RowHeaderCell
                                style={{ fontSize: "20px" }}
                                align="center"
                              >
                                {(lastPos
                                  ? a.slice(between)
                                  : a.slice(i, between[1] + 1)
                                ).map((x: any) => (
                                  <div key={x.player.id}>
                                    <Flex
                                      align="center"
                                      gap="2"
                                      justify={"center"}
                                    >
                                      <a
                                        href={`/player/${x.player.id}`}
                                        target="_self"
                                        style={{
                                          textDecoration: "none",
                                          lineBreak: "anywhere",
                                        }}
                                        className={styles.player}
                                      >
                                        {x.player.name}
                                      </a>
                                      {x.beaten_when_weekly ? (
                                        <StarFilledIcon></StarFilledIcon>
                                      ) : (
                                        ""
                                      )}
                                    </Flex>
                                    <br></br>
                                  </div>
                                ))}
                              </Table.RowHeaderCell>
                            ) : (
                              ""
                            )}
                            <Table.RowHeaderCell
                              style={{ fontSize: "20px" }}
                              align="center"
                            >
                              <a
                                href={`/level/${e.level.position}`}
                                target="_self"
                                style={{
                                  textDecoration: "none",
                                  lineBreak: "anywhere",
                                  display: "flex",
                                  gap: "5px",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                                className={styles.player}
                              >
                                {e.level.extreme ? (
                                  <img src="/extreme.png" width={30}></img>
                                ) : (
                                  ""
                                )}
                                {e.level.name}
                              </a>
                            </Table.RowHeaderCell>
                            <Table.RowHeaderCell
                              style={{ fontSize: "20px" }}
                              align="center"
                            >
                              {(lastPos
                                ? a.slice(between)
                                : a.slice(i, between[1] + 1)
                              ).map((x: any) => (
                                <div key={x.link}>
                                  <a
                                    href={x.link}
                                    target="_blank"
                                    style={{
                                      paddingBottom: "16px",
                                      display: "inline-block",
                                    }}
                                  >
                                    <IconButton color="violet">
                                      <ExternalLinkIcon
                                        color="black"
                                        style={{ scale: "1.5" }}
                                      ></ExternalLinkIcon>
                                    </IconButton>
                                  </a>
                                  <br></br>
                                </div>
                              ))}
                            </Table.RowHeaderCell>
                          </Table.Row>
                        );
                      })
                      .filter((e: any) => e)}
                  </Table.Body>
                </Table.Root>
              </Grid>
            </Box>
          </Grid>
        </>
      ) : (
        <>
          <Grid style={{ placeItems: "center" }}>
            <Box
              style={{
                padding: "20px",
                width: "min(1000px, 100%)",
                backgroundColor: "var(--light-blue)",
              }}
            >
              <Text
                size="9"
                as="p"
                align="center"
                weight="bold"
                style={{ textDecoration: "underline" }}
              >
                Verifications
              </Text>
              <br></br>
              <Grid style={{ placeItems: "center" }}>
                <Table.Root size="3" m="2" style={{ width: "90%" }}>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        #
                      </Table.ColumnHeaderCell>
                      {nationality ? (
                        <Table.ColumnHeaderCell
                          style={{ fontSize: "30px" }}
                          align="center"
                        >
                          Player
                        </Table.ColumnHeaderCell>
                      ) : (
                        ""
                      )}
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        Name
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        Time
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        Link
                      </Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {profile.platformers
                      .filter((e: any) => e.verification)
                      .map((e: any) => (
                        <Table.Row key={e.id}>
                          <Table.RowHeaderCell
                            style={{ fontSize: "20px" }}
                            align="center"
                          >
                            {e.level.position}
                          </Table.RowHeaderCell>
                          {nationality ? (
                            <Table.RowHeaderCell
                              style={{ fontSize: "20px" }}
                              align="center"
                            >
                              <Flex align="center" gap="2" justify={"center"}>
                                <a
                                  href={`/player/${e.player.id}?platformer=true`}
                                  target="_self"
                                  style={{
                                    textDecoration: "none",
                                    lineBreak: "anywhere",
                                  }}
                                  className={styles.player}
                                >
                                  {e.player.name}
                                </a>
                                {e.beaten_when_weekly ? (
                                  <StarFilledIcon></StarFilledIcon>
                                ) : (
                                  ""
                                )}
                              </Flex>
                            </Table.RowHeaderCell>
                          ) : (
                            ""
                          )}
                          <Table.RowHeaderCell
                            style={{ fontSize: "20px" }}
                            align="center"
                          >
                            <a
                              href={`/platformer/${e.level.position}`}
                              target="_self"
                              style={{
                                textDecoration: "none",
                                lineBreak: "anywhere",
                              }}
                            >
                              {e.level.name}
                            </a>
                          </Table.RowHeaderCell>
                          <Table.RowHeaderCell
                            style={{ fontSize: "20px" }}
                            align="center"
                          >
                            {secondsToTime(parseFloat(e.time))}
                          </Table.RowHeaderCell>
                          <Table.RowHeaderCell
                            style={{ fontSize: "20px" }}
                            align="center"
                          >
                            <a href={e.link} target="_blank">
                              <IconButton color="violet">
                                <ExternalLinkIcon
                                  color="black"
                                  style={{ scale: "1.5" }}
                                ></ExternalLinkIcon>
                              </IconButton>
                            </a>
                          </Table.RowHeaderCell>
                        </Table.Row>
                      ))}
                  </Table.Body>
                </Table.Root>
              </Grid>
            </Box>
          </Grid>
          <br></br>
          <br></br>
          <Grid style={{ placeItems: "center" }}>
            <Box
              style={{
                padding: "20px",
                width: "min(1000px, 100%)",
                backgroundColor: "var(--light-blue)",
              }}
            >
              <Text
                size="9"
                as="p"
                align="center"
                weight="bold"
                style={{ textDecoration: "underline" }}
              >
                List Completions
              </Text>
              <br></br>
              <Grid style={{ placeItems: "center" }}>
                <Table.Root size="3" m="2" style={{ width: "90%" }}>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        #
                      </Table.ColumnHeaderCell>
                      {nationality ? (
                        <Table.ColumnHeaderCell
                          style={{ fontSize: "30px" }}
                          align="center"
                        >
                          Player
                        </Table.ColumnHeaderCell>
                      ) : (
                        ""
                      )}
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        Name
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        Time
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        Link
                      </Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {profile.platformers
                      .filter(
                        (e: any) =>
                          e.level.position <=
                            parseInt(
                              process.env.NEXT_PUBLIC_PLATFORMERS || "20",
                            ) && !e.verification,
                      )
                      .map((e: any, i: number, a: any) => {
                        let lastPos =
                          e.level.position == a.at(-1).level.position;
                        let between = !lastPos
                          ? [
                              a.findIndex(
                                (x: any) =>
                                  x.level.position == e.level.position,
                              ),
                              a.findLastIndex(
                                (x: any) =>
                                  x.level.position == e.level.position,
                              ),
                            ]
                          : a.findIndex(
                              (x: any, ind: number) =>
                                x.level.position == a.at(-1).level.position,
                            );
                        if (
                          (!lastPos && between[0] != i) ||
                          (lastPos && between != i)
                        )
                          return null;
                        return (
                          <Table.Row key={e.id}>
                            <Table.RowHeaderCell
                              style={{ fontSize: "20px" }}
                              align="center"
                            >
                              {e.level.position}
                            </Table.RowHeaderCell>
                            {nationality ? (
                              <Table.RowHeaderCell
                                style={{ fontSize: "20px" }}
                                align="center"
                              >
                                {(lastPos
                                  ? a.slice(between)
                                  : a.slice(i, between[1] + 1)
                                ).map((x: any) => (
                                  <div key={x.player.id}>
                                    <Flex
                                      align="center"
                                      gap="2"
                                      justify={"center"}
                                    >
                                      <a
                                        href={`/player/${x.player.id}?platformer=true`}
                                        target="_self"
                                        style={{
                                          textDecoration: "none",
                                          lineBreak: "anywhere",
                                        }}
                                        className={styles.player}
                                      >
                                        {x.player.name}
                                      </a>
                                      {x.beaten_when_weekly ? (
                                        <StarFilledIcon></StarFilledIcon>
                                      ) : (
                                        ""
                                      )}
                                    </Flex>
                                    <br></br>
                                  </div>
                                ))}
                              </Table.RowHeaderCell>
                            ) : (
                              ""
                            )}
                            <Table.RowHeaderCell
                              style={{ fontSize: "20px" }}
                              align="center"
                            >
                              <a
                                href={`/platformer/${e.level.position}`}
                                target="_self"
                                style={{
                                  textDecoration: "none",
                                  lineBreak: "anywhere",
                                }}
                                className={styles.player}
                              >
                                {e.level.extreme ? (
                                  <img src="/extreme.png" width={30}></img>
                                ) : (
                                  ""
                                )}
                                {e.level.name}
                              </a>
                            </Table.RowHeaderCell>
                            <Table.RowHeaderCell
                              style={{ fontSize: "20px" }}
                              align="center"
                            >
                              {(lastPos
                                ? a.slice(between)
                                : a.slice(i, between[1] + 1)
                              ).map((x: any) => (
                                <div
                                  key={x.link}
                                  style={{ paddingBottom: "24px" }}
                                >
                                  {secondsToTime(parseFloat(x.time))}
                                  <br></br>
                                </div>
                              ))}
                            </Table.RowHeaderCell>
                            <Table.RowHeaderCell
                              style={{ fontSize: "20px" }}
                              align="center"
                            >
                              {(lastPos
                                ? a.slice(between)
                                : a.slice(i, between[1] + 1)
                              ).map((x: any) => (
                                <div key={x.link}>
                                  <a
                                    href={x.link}
                                    target="_blank"
                                    style={{
                                      paddingBottom: "16px",
                                      display: "inline-block",
                                    }}
                                  >
                                    <IconButton color="violet">
                                      <ExternalLinkIcon
                                        color="black"
                                        style={{ scale: "1.5" }}
                                      ></ExternalLinkIcon>
                                    </IconButton>
                                  </a>
                                  <br></br>
                                </div>
                              ))}
                            </Table.RowHeaderCell>
                          </Table.Row>
                        );
                      })
                      .filter((e: any) => e)}
                  </Table.Body>
                </Table.Root>
              </Grid>
            </Box>
          </Grid>
          <br></br>
          <br></br>
          <Grid style={{ placeItems: "center" }}>
            <Box
              style={{
                padding: "20px",
                width: "min(1000px, 100%)",
                backgroundColor: "var(--light-blue)",
              }}
            >
              <Text
                size="9"
                as="p"
                align="center"
                weight="bold"
                style={{ textDecoration: "underline" }}
              >
                Legacy Completions
              </Text>
              <br></br>
              <Grid style={{ placeItems: "center" }}>
                <Table.Root size="3" m="2" style={{ width: "90%" }}>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        #
                      </Table.ColumnHeaderCell>
                      {nationality ? (
                        <Table.ColumnHeaderCell
                          style={{ fontSize: "30px" }}
                          align="center"
                        >
                          Player
                        </Table.ColumnHeaderCell>
                      ) : (
                        ""
                      )}
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        Name
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        Time
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        Link
                      </Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {profile.platformers
                      .filter(
                        (e: any) =>
                          e.level.position >
                            parseInt(
                              process.env.NEXT_PUBLIC_PLATFORMERS || "20",
                            ) && !e.verification,
                      )
                      .map((e: any, i: number, a: any) => {
                        let lastPos =
                          e.level.position == a.at(-1).level.position;
                        let between = !lastPos
                          ? [
                              a.findIndex(
                                (x: any) =>
                                  x.level.position == e.level.position,
                              ),
                              a.findLastIndex(
                                (x: any) =>
                                  x.level.position == e.level.position,
                              ),
                            ]
                          : a.findIndex(
                              (x: any, ind: number) =>
                                x.level.position == a.at(-1).level.position,
                            );
                        if (
                          (!lastPos && between[0] != i) ||
                          (lastPos && between != i)
                        )
                          return null;
                        return (
                          <Table.Row key={e.id}>
                            <Table.RowHeaderCell
                              style={{ fontSize: "20px" }}
                              align="center"
                            >
                              {e.level.position}
                            </Table.RowHeaderCell>
                            {nationality ? (
                              <Table.RowHeaderCell
                                style={{ fontSize: "20px" }}
                                align="center"
                              >
                                {(lastPos
                                  ? a.slice(between)
                                  : a.slice(i, between[1] + 1)
                                ).map((x: any) => (
                                  <div key={x.player.id}>
                                    <Flex
                                      align="center"
                                      gap="2"
                                      justify={"center"}
                                    >
                                      <a
                                        href={`/player/${x.player.id}?platformer=true`}
                                        target="_self"
                                        style={{
                                          textDecoration: "none",
                                          lineBreak: "anywhere",
                                        }}
                                        className={styles.player}
                                      >
                                        {x.player.name}
                                      </a>
                                      {x.beaten_when_weekly ? (
                                        <StarFilledIcon></StarFilledIcon>
                                      ) : (
                                        ""
                                      )}
                                    </Flex>
                                    <br></br>
                                  </div>
                                ))}
                              </Table.RowHeaderCell>
                            ) : (
                              ""
                            )}
                            <Table.RowHeaderCell
                              style={{ fontSize: "20px" }}
                              align="center"
                            >
                              <a
                                href={`/platformer/${e.level.position}`}
                                target="_self"
                                style={{
                                  textDecoration: "none",
                                  lineBreak: "anywhere",
                                }}
                                className={styles.player}
                              >
                                {e.level.name}
                              </a>
                            </Table.RowHeaderCell>
                            <Table.RowHeaderCell
                              style={{ fontSize: "20px" }}
                              align="center"
                            >
                              {(lastPos
                                ? a.slice(between)
                                : a.slice(i, between[1] + 1)
                              ).map((x: any) => (
                                <div
                                  key={x.link}
                                  style={{ paddingBottom: "24px" }}
                                >
                                  {secondsToTime(parseFloat(x.time))}
                                  <br></br>
                                </div>
                              ))}
                            </Table.RowHeaderCell>
                            <Table.RowHeaderCell
                              style={{ fontSize: "20px" }}
                              align="center"
                            >
                              {(lastPos
                                ? a.slice(between)
                                : a.slice(i, between[1] + 1)
                              ).map((x: any) => (
                                <div key={x.link}>
                                  <a
                                    href={x.link}
                                    target="_blank"
                                    style={{
                                      paddingBottom: "16px",
                                      display: "inline-block",
                                    }}
                                  >
                                    <IconButton color="violet">
                                      <ExternalLinkIcon
                                        color="black"
                                        style={{ scale: "1.5" }}
                                      ></ExternalLinkIcon>
                                    </IconButton>
                                  </a>
                                  <br></br>
                                </div>
                              ))}
                            </Table.RowHeaderCell>
                          </Table.Row>
                        );
                      })
                      .filter((e: any) => e)}
                  </Table.Body>
                </Table.Root>
              </Grid>
            </Box>
          </Grid>
          <br></br>
          <br></br>
        </>
      )}
      {nationality ? (
        <>
          <br></br>
          <br></br>
          <Grid style={{ placeItems: "center" }}>
            <Box
              style={{
                padding: "20px",
                backgroundColor: "var(--light-blue)",
                width: "min(1000px, 100%)",
              }}
            >
              <Text
                size="9"
                as="p"
                align="center"
                weight="bold"
                style={{ textDecoration: "underline" }}
              >
                Missing Levels
              </Text>
              <br></br>
              <Grid style={{ placeItems: "center" }}>
                <Table.Root size="3" m="2" style={{ width: "90%" }}>
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        #
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        Name
                      </Table.ColumnHeaderCell>
                      <Table.ColumnHeaderCell
                        style={{ fontSize: "30px" }}
                        align="center"
                      >
                        Link
                      </Table.ColumnHeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {profile[`missing_${type}`].map((e: any) => (
                      <Table.Row key={e.id}>
                        <Table.RowHeaderCell
                          style={{ fontSize: "20px" }}
                          align="center"
                        >
                          {(
                            type == "platformer"
                              ? e.position >
                                parseInt(
                                  process.env.NEXT_PUBLIC_PLATFORMERS || "20",
                                )
                              : e.position > 150
                          )
                            ? ""
                            : e.position}
                        </Table.RowHeaderCell>
                        <Table.RowHeaderCell
                          style={{ fontSize: "20px" }}
                          align="center"
                        >
                          <a
                            href={`/${type == "platformer" ? "platformer" : "level"}/${e.position}`}
                            target="_self"
                            style={{
                              textDecoration: "none",
                              lineBreak: "anywhere",
                            }}
                          >
                            {e.name}
                          </a>
                        </Table.RowHeaderCell>
                        <Table.RowHeaderCell
                          style={{ fontSize: "20px" }}
                          align="center"
                        >
                          <a
                            href={`https://youtu.be/${e.ytcode}`}
                            target="_blank"
                            style={{
                              paddingBottom: "16px",
                              display: "inline-block",
                            }}
                          >
                            <IconButton color="violet">
                              <ExternalLinkIcon
                                color="black"
                                style={{ scale: "1.5" }}
                              ></ExternalLinkIcon>
                            </IconButton>
                          </a>
                        </Table.RowHeaderCell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Grid>
            </Box>
          </Grid>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
