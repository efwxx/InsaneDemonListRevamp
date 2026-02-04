"use client";
import hexToRGB from "@/functions/hexToRGB";
import {
  CrossCircledIcon,
  CheckIcon,
  InfoCircledIcon,
  Link1Icon,
  PersonIcon,
  VideoIcon,
  LetterCaseCapitalizeIcon,
  DotFilledIcon,
  MinusIcon,
  PlusIcon,
  FileIcon,
  ExternalLinkIcon,
  StarFilledIcon,
  DrawingPinFilledIcon,
  TrashIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import {
  Badge,
  Box,
  Button,
  Callout,
  Card,
  Dialog,
  DropdownMenu,
  Flex,
  Grid,
  IconButton,
  SegmentedControl,
  Select,
  Separator,
  Table,
  Text,
  TextField,
} from "@radix-ui/themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../../app/submit.module.css";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

interface info {
  authData: Record<any, any>;
  leaderboards: Array<Record<any, any>>;
}

export default function EditLevels({ authData, leaderboards }: info) {
  dayjs.extend(utc);

  let [originalLevels, setOriginalLevels] = useState<Array<Record<any, any>>>(
    [],
  );
  let [filteredLevels, setFilteredLevels] = useState<Array<Record<any, any>>>(
    [],
  );
  let [level, setLevel] = useState<Record<any, any>>({});
  let [edits, setEdits] = useState<Array<Record<any, any>>>([]);
  let [error, setError] = useState({ color: "red", message: "" });
  let [packHover, setPackHover] = useState<string | null>(null);
  let [editedRecords, setEditedRecords] = useState<Array<Record<any, any>>>([]);
  let [deletedRecords, setDeletedRecords] = useState<Array<Record<any, any>>>(
    [],
  );
  let [record, setRecord] = useState<number | null>(null);
  let [filteredPlayers, setFilteredPlayers] = useState<Array<Record<any, any>>>(
    [],
  );
  let [type, setType] = useState<"level" | "platformer">("level");
  let [packs, setPacks] = useState<Array<Record<any, any>>>([]);
  let [intersectLevels, setIntersectLevels] =
    useState<Array<Record<any, any>>>();
  let [intersect, setIntersect] = useState({
    levels: [],
    players: [],
  });
  let [search, setSearch] = useState({
    name: "",
    publisher: "",
  });
  let [openLevels, setOpenLevels] = useState(false);
  let [openPlayers, setOpenPlayers] = useState(false);

  let [width, setWidth] = useState(0);

  let getWidth = () => (typeof window === "undefined" ? 0 : window.innerWidth);

  useEffect(() => {
    setWidth(getWidth());
  });

  useEffect(() => {
    (async () => {
      let req = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/${type}s?start=0`,
      );
      let json = await req.json();
      setOriginalLevels(json);
      setFilteredLevels(json);
      let req1 = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/packs${type == "level" ? "" : `/${type}`}`,
      );
      let json1 = await req1.json();
      setPacks(json1);
    })();
  }, [type]);

  function getYoutubeVideoId(link: string) {
    const text = link.trim();
    let urlPattern =
      /https?:\/\/(?:www\.)?[\w\.-]+(?:\/[\w\.-]*)*(?:\?[\w\.\-]+=[\w\.\-]+(?:&[\w\.\-]+=[\w\.\-]+)*)?\/?/g;
    let url = text.match(urlPattern);

    if (url && (url[0].includes("youtube") || url[0].includes("youtu.be"))) {
      const youtubeRegExp =
        /http(?:s?):\/\/(?:m\.|www\.)?(?:m\.)?youtu(?:be\.com\/(?:watch\?v=|embed\/|shorts\/)|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?\=]*)?/;
      const match = text.match(youtubeRegExp);
      const fullLink = url[0];
      let videoId = null;
      if (match) {
        videoId = match[1];
      }
      return {
        fullLink,
        videoId,
        hasExtraText: text.replace(fullLink, "").trim().length > 0,
      };
    } else {
      return { fullLink: null, videoId: null, hasExtraText: true };
    }
  }

  function allowDrop(ev: any) {
    ev.preventDefault();
  }

  function drag(ev: any) {
    ev.dataTransfer.setData("pos", ev.target.id);
  }

  function drop(ev: any) {
    ev.preventDefault();
    let levPos = parseInt(
      filteredLevels.find((e) => e.id == ev.dataTransfer.getData("pos"))
        ?.position,
    );
    let newLevPos = parseInt(
      filteredLevels.find((e) => e.id == ev.currentTarget.id)?.position,
    );
    let levels = structuredClone(filteredLevels);
    setEdits([
      ...edits,
      {
        id: ev.dataTransfer.getData("pos"),
        position: newLevPos,
      },
    ]);
    levels
      .filter((e) => e.difference)
      .map((x) => {
        if (x.position >= newLevPos && levPos > x.position) {
          x.difference--;
        }
        if (x.position < newLevPos && levPos < x.position) {
          x.difference++;
        }
        return x;
      });
    for (
      let i = Math.min(levPos, newLevPos) - 1;
      i < Math.max(levPos, newLevPos);
      i++
    ) {
      if (i == levPos - 1) {
        levels[i].difference =
          originalLevels.find((x) => x.id == levels[i].id)?.position -
          newLevPos;
        levels[i].position = newLevPos;
        continue;
      }
      if (levPos > newLevPos) {
        levels[i].position += 1;
        continue;
      }
      if (levPos < newLevPos) {
        levels[i].position -= 1;
        continue;
      }
    }
    setFilteredLevels(levels.sort((a, b) => a.position - b.position));
  }

  return (
    <Box>
      <Flex gap="4" style={{ placeItems: "center", justifyContent: "center" }}>
        <img
          src="/favicon.ico"
          style={{ width: "clamp(40px, 10vw, 70px)", height: "auto" }}
          alt="Logo"
        ></img>
        <Text size="9" className="header" style={{ display: "contents" }}>
          Level Editor
        </Text>
        <img
          src="/favicon.ico"
          style={{ width: "clamp(40px, 10vw, 70px)", height: "auto" }}
          alt="Logo"
        ></img>
      </Flex>
      <br></br>
      <Grid style={{ placeItems: "center" }}>
        <SegmentedControl.Root
          size="3"
          defaultValue="level"
          onValueChange={(e) => setType(e as any)}
        >
          <SegmentedControl.Item value="level">Classic</SegmentedControl.Item>
          <SegmentedControl.Item value="platformer">
            Platformer
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      </Grid>
      <br></br>
      <Flex justify="center" gap="9">
        <Button
          size="4"
          disabled={!filteredLevels.find((e) => e.difference)}
          onClick={async () => {
            setError({ color: "blue", message: "Loading..." });
            let req = await fetch(`/api/${type}s`, {
              method: "PATCH",
              headers: {
                "content-type": "application/json",
                authorization: authData.token,
              },
              body: JSON.stringify(edits),
            });
            try {
              let data = await req.json();
              setError({ color: "red", message: data.message });
            } catch (_) {
              setError({
                color: "blue",
                message: "Fetching new information...",
              });
              let req = await fetch(`/api/${type}s?start=0`, {
                headers: {
                  authorization: authData.token,
                },
              });
              let levels = await req.json();
              setError({
                color: "green",
                message: `Successfully edited all level positions`,
              });
              setFilteredLevels(levels);
              setOriginalLevels(levels);
              setEdits([]);
              setTimeout(() => {
                setError({ color: "red", message: "" });
              }, 3000);
            }
          }}
        >
          Save
        </Button>
        <Dialog.Root
          onOpenChange={(_) => {
            let obj = {
              id: "level_addition",
              position: filteredLevels.length + 1,
              name: "",
              publisher: "",
              ytcode: "",
              packs: [],
              list: [],
            };
            if (_) {
              setLevel(obj);
              setFilteredLevels([...filteredLevels, obj]);
            } else {
              setLevel({});
              setFilteredLevels(originalLevels);
            }
          }}
        >
          <Dialog.Trigger>
            <IconButton
              size="4"
              disabled={!!filteredLevels.find((e) => e.difference)}
            >
              +
            </IconButton>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title as="h1" align="center" style={{ fontSize: "30px" }}>
              Level Addition
            </Dialog.Title>
            <br></br>
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Publisher</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              {!level.hide ? (
                <Table.Body>
                  <Table.Row>
                    <Table.RowHeaderCell
                      style={{
                        fontWeight: level.position == 1 ? "bold" : "initial",
                      }}
                    >
                      {level.position == 1
                        ? 1
                        : filteredLevels.find((e: any) =>
                            level.position == filteredLevels.length
                              ? e.position == level.position - 2
                              : e.position == level.position - 1,
                          )?.position}
                    </Table.RowHeaderCell>
                    <Table.Cell
                      style={{
                        fontWeight: level.position == 1 ? "bold" : "initial",
                      }}
                    >
                      {
                        filteredLevels.find((e: any) =>
                          level.position == 1
                            ? e.id == level.id
                            : level.position == filteredLevels.length
                              ? e.position == level.position - 2
                              : e.position == level.position - 1,
                        )?.name
                      }
                    </Table.Cell>
                    <Table.Cell
                      style={{
                        fontWeight: level.position == 1 ? "bold" : "initial",
                      }}
                    >
                      {
                        filteredLevels.find((e: any) =>
                          level.position == 1
                            ? e.id == level.id
                            : level.position == filteredLevels.length
                              ? e.position == level.position - 2
                              : e.position == level.position - 1,
                        )?.publisher
                      }
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.RowHeaderCell
                      style={{
                        fontWeight:
                          level.position != 1 &&
                          level.position != filteredLevels.length
                            ? "bold"
                            : "initial",
                      }}
                    >
                      {level.position != 1 &&
                      level.position != filteredLevels.length
                        ? level.position
                        : filteredLevels.find((e: any) =>
                            level.position == 1
                              ? e.position == 2
                              : e.position == level.position - 1,
                          )?.position}
                    </Table.RowHeaderCell>
                    <Table.Cell
                      style={{
                        fontWeight:
                          level.position != 1 &&
                          level.position != filteredLevels.length
                            ? "bold"
                            : "initial",
                      }}
                    >
                      {
                        filteredLevels.find((e: any) =>
                          level.position == 1
                            ? e.position == 2
                            : level.position == filteredLevels.length
                              ? e.position == level.position - 1
                              : e.id == level.id,
                        )?.name
                      }
                    </Table.Cell>
                    <Table.Cell
                      style={{
                        fontWeight:
                          level.position != 1 &&
                          level.position != filteredLevels.length
                            ? "bold"
                            : "initial",
                      }}
                    >
                      {
                        filteredLevels.find((e: any) =>
                          level.position == 1
                            ? e.position == 2
                            : level.position == filteredLevels.length
                              ? e.position == level.position - 1
                              : e.id == level.id,
                        )?.publisher
                      }
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.RowHeaderCell
                      style={{
                        fontWeight:
                          level.position == filteredLevels.length
                            ? "bold"
                            : "initial",
                      }}
                    >
                      {level.position == filteredLevels.length
                        ? level.position
                        : filteredLevels.find((e: any) =>
                            level.position == 1
                              ? e.position == 3
                              : e.position == level.position + 1,
                          )?.position}
                    </Table.RowHeaderCell>
                    <Table.Cell
                      style={{
                        fontWeight:
                          level.position == filteredLevels.length
                            ? "bold"
                            : "initial",
                      }}
                    >
                      {
                        filteredLevels.find((e: any) =>
                          level.position == 1
                            ? e.position == 3
                            : level.position == filteredLevels.length
                              ? e.id == level.id
                              : e.position == level.position + 1,
                        )?.name
                      }
                    </Table.Cell>
                    <Table.Cell
                      style={{
                        fontWeight:
                          level.position == filteredLevels.length
                            ? "bold"
                            : "initial",
                      }}
                    >
                      {
                        filteredLevels.find((e: any) =>
                          level.position == 1
                            ? e.position == 3
                            : level.position == filteredLevels.length
                              ? e.id == level.id
                              : e.position == level.position + 1,
                        )?.publisher
                      }
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ) : (
                ""
              )}
            </Table.Root>
            <br></br>
            <TextField.Root
              onChange={(e) => {
                let levPos = level.position;
                let newLevPos = parseInt(e.target.value);
                if (
                  !newLevPos ||
                  newLevPos < 1 ||
                  newLevPos > filteredLevels.length
                ) {
                  setLevel({ ...level, hide: true });
                  return;
                }
                let levels = structuredClone(filteredLevels);
                for (
                  let i = Math.min(levPos, newLevPos) - 1;
                  i < Math.max(levPos, newLevPos);
                  i++
                ) {
                  if (i == levPos - 1) {
                    levels[i].position = newLevPos;
                    continue;
                  }
                  if (levPos > newLevPos) {
                    levels[i].position += 1;
                    continue;
                  }
                  if (levPos < newLevPos) {
                    levels[i].position -= 1;
                    continue;
                  }
                }
                setFilteredLevels(
                  levels.sort((a, b) => a.position - b.position),
                );
                setLevel({
                  ...level,
                  position: parseInt(e.target.value),
                  hide: false,
                });
              }}
              type="number"
            >
              <TextField.Slot>Position</TextField.Slot>
            </TextField.Root>
            <br></br>
            <TextField.Root
              onChange={(e) => {
                setLevel({ ...level, name: e.target.value });
                setFilteredLevels(
                  [
                    ...filteredLevels.filter((x) => x.id != "level_addition"),
                    { ...level, name: e.target.value },
                  ].sort((a, b) => a.position - b.position),
                );
              }}
              placeholder="Name..."
            >
              <TextField.Slot>
                <LetterCaseCapitalizeIcon></LetterCaseCapitalizeIcon>
              </TextField.Slot>
            </TextField.Root>
            <br></br>
            <TextField.Root
              onChange={(e) => {
                setLevel({ ...level, publisher: e.target.value });
                setFilteredLevels(
                  [
                    ...filteredLevels.filter((x) => x.id != "level_addition"),
                    { ...level, publisher: e.target.value },
                  ].sort((a, b) => a.position - b.position),
                );
              }}
              placeholder="Publisher..."
            >
              <TextField.Slot>
                <PersonIcon></PersonIcon>
              </TextField.Slot>
            </TextField.Root>
            <br></br>
            <TextField.Root
              onChange={(e) => {
                setLevel({ ...level, ytcode: e.target.value });
                setFilteredLevels(
                  [
                    ...filteredLevels.filter((x) => x.id != "level_addition"),
                    { ...level, ytcode: e.target.value },
                  ].sort((a, b) => a.position - b.position),
                );
              }}
              placeholder="Ytcode..."
            >
              <TextField.Slot>
                <VideoIcon></VideoIcon>
              </TextField.Slot>
            </TextField.Root>
            <br></br>
            <Grid style={{ placeItems: "center" }}>
              <iframe
                src={`https://www.youtube.com/embed/${level.ytcode}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </Grid>
            <br></br>
            <Dialog.Close>
              <Flex gap="9" justify={"center"}>
                <Button
                  size="4"
                  disabled={
                    !level.name ||
                    !level.position ||
                    !level.publisher ||
                    level.ytcode.length < 11
                  }
                  onClick={async () => {
                    setError({ color: "blue", message: "Loading..." });
                    let req = await fetch(`/api/${type}s`, {
                      method: "POST",
                      headers: {
                        "content-type": "application/json",
                        authorization: authData.token,
                      },
                      body: JSON.stringify(level),
                    });
                    try {
                      if (req.status == 201) throw new Error();
                      let data = await req.json();
                      setError({ color: "red", message: data.message });
                    } catch (_) {
                      setError({
                        color: "blue",
                        message: "Fetching new information...",
                      });
                      let req = await fetch(`/api/${type}s?start=0`, {
                        headers: {
                          authorization: authData.token,
                        },
                      });
                      let levels = await req.json();
                      setError({
                        color: "green",
                        message: `Successfully added level ${level.name} by ${level.publisher} at #${level.position}`,
                      });
                      setFilteredLevels(levels);
                      setOriginalLevels(levels);
                      setLevel([]);
                      setTimeout(() => {
                        setError({ color: "red", message: "" });
                      }, 3000);
                    }
                  }}
                >
                  Add
                </Button>
                <Button size="4" color="red">
                  Cancel
                </Button>
              </Flex>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>
        <Button
          size="4"
          disabled={!filteredLevels.find((e) => e.difference)}
          color="red"
          onClick={() => {
            setFilteredLevels(originalLevels);
            setEdits([]);
          }}
        >
          Cancel
        </Button>
      </Flex>
      <br></br>
      <Grid style={{ placeItems: "center" }}>
        <Dialog.Root
          onOpenChange={(_) => {
            setIntersectLevels([]);
            setOpenLevels(false);
            setIntersect({
              levels: [],
              players: [],
            });
          }}
        >
          <Dialog.Trigger>
            <Button size="3" color="blue">
              Check intersection
            </Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Grid style={{ placeItems: "center" }}>
              <Dialog.Title as="h1" size="8">
                Check Record Intersection
              </Dialog.Title>
              <Flex gap="4" align="center" mt="4">
                <TextField.Root
                  style={{ width: 225 }}
                  placeholder="Level Name..."
                  id="level"
                  onClick={(e) => {
                    setOpenLevels(true);
                  }}
                  onChange={(e) => {
                    setSearch({
                      ...search,
                      name: e.target.value,
                    });
                  }}
                >
                  <TextField.Slot style={{ paddingRight: "8px" }}>
                    <FileIcon></FileIcon>
                  </TextField.Slot>
                </TextField.Root>
                <Text>By</Text>
                <TextField.Root
                  placeholder="Publisher..."
                  id="publisher"
                  onClick={(e) => {
                    setOpenLevels(true);
                  }}
                  onChange={(e) => {
                    setSearch({
                      ...search,
                      publisher: e.target.value,
                    });
                  }}
                ></TextField.Root>
              </Flex>
              <Card
                style={{
                  display: openLevels ? "block" : "none",
                  maxHeight: "300px",
                  overflowY: "scroll",
                  overflowX: "hidden",
                  animation: "ease-in-out 1s",
                }}
              >
                <div style={{ marginBottom: "10px" }}></div>
                {originalLevels
                  .filter((e) => !intersectLevels?.find((x) => x.id == e.id))
                  .filter(
                    (e) =>
                      e.name
                        .toLowerCase()
                        .includes(search.name.toLowerCase()) &&
                      e.publisher
                        .toLowerCase()
                        .includes(search.publisher.toLowerCase()),
                  )
                  .map((e: any, i: number) => (
                    <Box key={i}>
                      {i ? <Separator my="3" size="4" /> : ""}
                      <Text
                        className={styles.option}
                        size="3"
                        as="p"
                        style={{ margin: "-8px" }}
                        onClick={() => {
                          (document.getElementById("level") as any).value = "";
                          (document.getElementById("publisher") as any).value =
                            "";
                          setSearch({
                            name: "",
                            publisher: "",
                          });
                          setIntersectLevels([...(intersectLevels as any), e]);
                          setOpenLevels(false);
                        }}
                      >
                        <Text color="gray" mr="6">
                          #{e.position}
                        </Text>{" "}
                        {e.name} by {e.publisher}
                      </Text>
                    </Box>
                  ))}
              </Card>
              <br></br>

              <Button
                size="3"
                disabled={!intersectLevels?.length}
                onClick={async () => {
                  let req = await fetch(`/api/levels/intersection`, {
                    method: "POST",
                    headers: {
                      "content-type": "application/json",
                    },
                    body: JSON.stringify({
                      levels: intersectLevels?.map((e) => e.id.toString()),
                    }),
                  });
                  let body = await req.json();
                  setIntersect({
                    levels: intersectLevels as any,
                    players: body,
                  });
                }}
              >
                Check
              </Button>
              <br></br>
              <Flex wrap={"wrap"} gap={"2"}>
                {intersectLevels?.map((e) => (
                  <Card
                    draggable={true}
                    onDragStart={drag}
                    onDragOver={allowDrop}
                    onDrop={drop}
                    id={e.id}
                    className="infoCard"
                    key={e.id}
                  >
                    <Text size="3">
                      <b>#{e.position}: </b>
                      {e.name} by {e.publisher}{" "}
                      <TrashIcon
                        color="red"
                        style={{ scale: 1.3 }}
                        onClick={() => {
                          setIntersectLevels(
                            intersectLevels.filter((x) => x.id != e.id),
                          );
                        }}
                      ></TrashIcon>
                    </Text>
                  </Card>
                ))}
              </Flex>
              <br></br>
              {intersect.levels.length ? (
                <Callout.Root style={{ alignItems: "center" }}>
                  <Callout.Icon style={{ height: "25px" }}>
                    <InfoCircledIcon style={{ scale: "2" }} />
                  </Callout.Icon>
                  <Callout.Text size="4" ml="1">
                    Showing intersection between levels:{" "}
                    {intersect.levels?.map((e: any) => e.name).join(", ")}
                  </Callout.Text>
                </Callout.Root>
              ) : (
                ""
              )}
              <br></br>
              <Box
                style={{ padding: "20px", width: "100%" }}
                className={styles.back}
              >
                <Grid style={{ placeItems: "center" }}>
                  <Table.Root size="3" m="2" style={{ width: "90%" }}>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeaderCell
                          style={{ fontSize: "30px" }}
                          align="center"
                        >
                          <img
                            src="https://github.com/ppy/osu-resources/blob/master/osu.Game.Resources/Textures/Flags/__.png?raw=true"
                            width="32px"
                          ></img>
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
                          Reliable?
                        </Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {intersect.players
                        .map((e: any) => {
                          return leaderboards.find((x) => x.id == e.id);
                        })
                        .toSorted(
                          (a: any, b: any) =>
                            (!!b.reliable ? 1 : 0) - (!!a.reliable ? 1 : 0),
                        )
                        .map((e: any) => (
                          <Table.Row key={e.id}>
                            <Table.RowHeaderCell
                              style={{ fontSize: "20px" }}
                              align="center"
                            >
                              <img
                                src={
                                  e.nationality
                                    ? `https://raw.githubusercontent.com/lipis/flag-icons/4f420bdd2e954f6da11220f1136fa181ed7019e7/flags/4x3/${e.abbr}.svg`
                                    : "https://github.com/ppy/osu-resources/blob/master/osu.Game.Resources/Textures/Flags/__.png?raw=true"
                                }
                                width="32"
                                onClick={() => {
                                  window.location.href = e.player.nationality
                                    ? `/nationality/${e.abbr}`
                                    : "#";
                                }}
                              ></img>
                            </Table.RowHeaderCell>
                            <Table.RowHeaderCell
                              style={{ fontSize: "20px" }}
                              align="center"
                            >
                              <Flex align={"center"} gap="2" justify={"center"}>
                                <a
                                  href={`/player/${e.id}`}
                                  target="_self"
                                  style={{
                                    textDecoration: "none",
                                    lineBreak: "anywhere",
                                  }}
                                  className={styles.player}
                                >
                                  {e.name}
                                </a>
                              </Flex>
                            </Table.RowHeaderCell>
                            <Table.RowHeaderCell align="center">
                              {e.reliable ? (
                                <CheckIcon
                                  style={{ scale: 2 }}
                                  color="lightgreen"
                                ></CheckIcon>
                              ) : (
                                <Cross2Icon
                                  style={{ scale: 2 }}
                                  color="red"
                                ></Cross2Icon>
                              )}
                            </Table.RowHeaderCell>
                          </Table.Row>
                        ))}
                    </Table.Body>
                  </Table.Root>
                </Grid>
              </Box>
              <br></br>
              <Dialog.Close>
                <Button color="red" size="4">
                  Close
                </Button>
              </Dialog.Close>
            </Grid>
          </Dialog.Content>
        </Dialog.Root>
        {error.message ? (
          <>
            <Callout.Root
              color={error.color as any}
              style={{ width: "min(600px, 100%)" }}
            >
              <Callout.Icon>
                {error.color == "red" ? (
                  <CrossCircledIcon style={{ scale: 1.5 }}></CrossCircledIcon>
                ) : error.color == "green" ? (
                  <CheckIcon style={{ scale: 1.5 }}></CheckIcon>
                ) : (
                  <InfoCircledIcon style={{ scale: 1.5 }}></InfoCircledIcon>
                )}
              </Callout.Icon>
              <Callout.Text size="3" ml="-1">
                {error.message}
              </Callout.Text>
            </Callout.Root>
            <br></br>
          </>
        ) : (
          ""
        )}
      </Grid>
      <br></br>
      <Grid style={{ placeItems: "center" }}>
        <Grid
          columns={
            width > 1200
              ? "6"
              : width > 1000
                ? "5"
                : width > 800
                  ? "4"
                  : width > 600
                    ? "3"
                    : width > 400
                      ? "2"
                      : "1"
          }
          gap="4"
          style={{ width: "min(2500px, 100%)" }}
        >
          {filteredLevels.map((e: any) => (
            <Dialog.Root
              key={e.id}
              onOpenChange={async (open) => {
                if (open) {
                  let req = await fetch(`/api/${type}/${e.id}`);
                  let level = await req.json();
                  setLevel(level);
                } else {
                  setFilteredLevels(originalLevels);
                  setLevel({});
                  setRecord(null);
                  setEditedRecords([]);
                  setDeletedRecords([]);
                  setOpenPlayers(false);
                }
              }}
            >
              <Dialog.Trigger>
                <Card
                  draggable={true}
                  onDragStart={drag}
                  onDragOver={allowDrop}
                  onDrop={drop}
                  id={e.id}
                  className="infoCard"
                  key={e.id}
                  onClick={(e) => {
                    if (!!filteredLevels.find((e) => e.difference))
                      e.preventDefault();
                  }}
                >
                  <Text size="4">
                    <b>#{e.position}: </b>
                    {e.name} by {e.publisher}{" "}
                    {!e.difference ? (
                      ""
                    ) : (
                      <Text size="4" color={e.difference < 0 ? "red" : "green"}>
                        {e.difference < 0 ? "-" : "+"}
                        {Math.abs(e.difference)}
                      </Text>
                    )}
                  </Text>
                </Card>
              </Dialog.Trigger>
              <Dialog.Content>
                {level.id ? (
                  <>
                    <Dialog.Title
                      as="h1"
                      style={{ fontSize: "30px" }}
                      align={"center"}
                    >
                      #{level.position}: {level.name} by {level.publisher}
                    </Dialog.Title>
                    {level.formerRank ? (
                      <Dialog.Description align="center">
                        Formerly #{level.formerRank}, Removed on{" "}
                        {new Date(level.removalDate).toDateString()}
                      </Dialog.Description>
                    ) : (
                      ""
                    )}
                    <br></br>
                    <Text size="5" weight={"bold"} as="p" align="center">
                      Weekly
                    </Text>
                    <Flex gap="2" align="center" justify={"center"}>
                      <TextField.Root
                        defaultValue={
                          level.weekly
                            ? dayjs(level.weekly.date)
                                .utc(false)
                                .format("YYYY-MM-DDTHH:mm:ss")
                            : ""
                        }
                        type="datetime-local"
                        onChange={(e) => {
                          setLevel({
                            ...level,
                            weekly: level.weekly
                              ? {
                                  ...level.weekly,
                                  date: new Date(e.target.value).toISOString(),
                                }
                              : {
                                  color: "#000000",
                                  date: new Date(e.target.value).toISOString(),
                                },
                          });
                        }}
                      ></TextField.Root>
                      <input
                        defaultValue={level.weekly?.color}
                        type="color"
                        style={{ width: "revert" }}
                        onChange={(e) => {
                          setLevel({
                            ...level,
                            weekly: level.weekly
                              ? { ...level.weekly, color: e.target.value }
                              : {
                                  color: e.target.value,
                                  date: new Date(Date.now()).toISOString(),
                                },
                          });
                        }}
                      ></input>
                    </Flex>
                    <br></br>
                    <Flex gap="2" align="center" justify={"center"}>
                      <Text size="5" weight={"bold"}>
                        Packs
                      </Text>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                          <IconButton size="1">
                            <PlusIcon></PlusIcon>
                          </IconButton>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          {packs
                            .filter(
                              (x) =>
                                !level.packs.find((y: any) => y.name == x.name),
                            )
                            .map((x: any) => (
                              <DropdownMenu.Item
                                key={x.id}
                                onClick={(_) => {
                                  setLevel({
                                    ...level,
                                    packs: [...level.packs, x].sort(
                                      (a, b) => a.position - b.position,
                                    ),
                                  });
                                }}
                              >
                                {x.name}
                              </DropdownMenu.Item>
                            ))}
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </Flex>
                    <br></br>
                    <Flex
                      gap="2"
                      style={{ maxWidth: "100%" }}
                      wrap="wrap"
                      justify="center"
                    >
                      {level.packs.length
                        ? level.packs
                            .sort((a: any, b: any) => a.position - b.positon)
                            .map((e: any) => {
                              let rgb = hexToRGB(e.color);
                              return (
                                <Badge
                                  style={{
                                    backgroundColor:
                                      packHover != e.id
                                        ? `rgba(${rgb?.r}, ${rgb?.g}, ${rgb?.b}, 0.5)`
                                        : "rgba(191, 15, 27)",
                                    color: "white",
                                    fontSize: "20px",
                                    padding: "10px",
                                    paddingRight: "17px",
                                    borderRadius: "20px",
                                  }}
                                  key={e.name}
                                  onMouseOver={(_) => setPackHover(e.id)}
                                  onMouseLeave={(_) => setPackHover(null)}
                                  onClick={(_) => {
                                    if (packHover == e.id) {
                                      setLevel({
                                        ...level,
                                        packs: level.packs.filter(
                                          (x: any) => x.id != e.id,
                                        ),
                                      });
                                      setPackHover(null);
                                    }
                                  }}
                                >
                                  {packHover == e.id ? (
                                    <MinusIcon></MinusIcon>
                                  ) : (
                                    <DotFilledIcon></DotFilledIcon>
                                  )}
                                  {e.name}
                                </Badge>
                              );
                            })
                        : ""}
                    </Flex>
                    <br></br>
                    <Table.Root variant="surface">
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell>#</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell>
                            Publisher
                          </Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      {!level.hide ? (
                        <Table.Body>
                          <Table.Row>
                            <Table.RowHeaderCell
                              style={{
                                fontWeight:
                                  level.position == 1 ? "bold" : "initial",
                              }}
                            >
                              {level.position == 1
                                ? 1
                                : filteredLevels.find((e: any) =>
                                    level.position == filteredLevels.length
                                      ? e.position == level.position - 2
                                      : e.position == level.position - 1,
                                  )?.position}
                            </Table.RowHeaderCell>
                            <Table.Cell
                              style={{
                                fontWeight:
                                  level.position == 1 ? "bold" : "initial",
                              }}
                            >
                              {
                                filteredLevels.find((e: any) =>
                                  level.position == 1
                                    ? e.id == level.id
                                    : level.position == filteredLevels.length
                                      ? e.position == level.position - 2
                                      : e.position == level.position - 1,
                                )?.name
                              }
                            </Table.Cell>
                            <Table.Cell
                              style={{
                                fontWeight:
                                  level.position == 1 ? "bold" : "initial",
                              }}
                            >
                              {
                                filteredLevels.find((e: any) =>
                                  level.position == 1
                                    ? e.id == level.id
                                    : level.position == filteredLevels.length
                                      ? e.position == level.position - 2
                                      : e.position == level.position - 1,
                                )?.publisher
                              }
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.RowHeaderCell
                              style={{
                                fontWeight:
                                  level.position != 1 &&
                                  level.position != filteredLevels.length
                                    ? "bold"
                                    : "initial",
                              }}
                            >
                              {level.position != 1 &&
                              level.position != filteredLevels.length
                                ? level.position
                                : filteredLevels.find((e: any) =>
                                    level.position == 1
                                      ? e.position == 2
                                      : e.position == level.position - 1,
                                  )?.position}
                            </Table.RowHeaderCell>
                            <Table.Cell
                              style={{
                                fontWeight:
                                  level.position != 1 &&
                                  level.position != filteredLevels.length
                                    ? "bold"
                                    : "initial",
                              }}
                            >
                              {
                                filteredLevels.find((e: any) =>
                                  level.position == 1
                                    ? e.position == 2
                                    : level.position == filteredLevels.length
                                      ? e.position == level.position - 1
                                      : e.id == level.id,
                                )?.name
                              }
                            </Table.Cell>
                            <Table.Cell
                              style={{
                                fontWeight:
                                  level.position != 1 &&
                                  level.position != filteredLevels.length
                                    ? "bold"
                                    : "initial",
                              }}
                            >
                              {
                                filteredLevels.find((e: any) =>
                                  level.position == 1
                                    ? e.position == 2
                                    : level.position == filteredLevels.length
                                      ? e.position == level.position - 1
                                      : e.id == level.id,
                                )?.publisher
                              }
                            </Table.Cell>
                          </Table.Row>
                          <Table.Row>
                            <Table.RowHeaderCell
                              style={{
                                fontWeight:
                                  level.position == filteredLevels.length
                                    ? "bold"
                                    : "initial",
                              }}
                            >
                              {level.position == filteredLevels.length
                                ? level.position
                                : filteredLevels.find((e: any) =>
                                    level.position == 1
                                      ? e.position == 3
                                      : e.position == level.position + 1,
                                  )?.position}
                            </Table.RowHeaderCell>
                            <Table.Cell
                              style={{
                                fontWeight:
                                  level.position == filteredLevels.length
                                    ? "bold"
                                    : "initial",
                              }}
                            >
                              {
                                filteredLevels.find((e: any) =>
                                  level.position == 1
                                    ? e.position == 3
                                    : level.position == filteredLevels.length
                                      ? e.id == level.id
                                      : e.position == level.position + 1,
                                )?.name
                              }
                            </Table.Cell>
                            <Table.Cell
                              style={{
                                fontWeight:
                                  level.position == filteredLevels.length
                                    ? "bold"
                                    : "initial",
                              }}
                            >
                              {
                                filteredLevels.find((e: any) =>
                                  level.position == 1
                                    ? e.position == 3
                                    : level.position == filteredLevels.length
                                      ? e.id == level.id
                                      : e.position == level.position + 1,
                                )?.publisher
                              }
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      ) : (
                        ""
                      )}
                    </Table.Root>
                    <br></br>
                    <TextField.Root
                      defaultValue={level.position}
                      type="number"
                      onChange={(e) => {
                        let levPos = level.position;
                        let newLevPos = parseInt(e.target.value);
                        if (
                          !newLevPos ||
                          newLevPos < 1 ||
                          newLevPos > filteredLevels.length
                        ) {
                          setLevel({ ...level, hide: true });
                          return;
                        }
                        let levels = structuredClone(filteredLevels);
                        for (
                          let i = Math.min(levPos, newLevPos) - 1;
                          i < Math.max(levPos, newLevPos);
                          i++
                        ) {
                          if (i == levPos - 1) {
                            levels[i].position = newLevPos;
                            continue;
                          }
                          if (levPos > newLevPos) {
                            levels[i].position += 1;
                            continue;
                          }
                          if (levPos < newLevPos) {
                            levels[i].position -= 1;
                            continue;
                          }
                        }
                        setFilteredLevels(
                          levels.sort((a, b) => a.position - b.position),
                        );
                        setLevel({
                          ...level,
                          position: parseInt(e.target.value),
                          hide: false,
                        });
                      }}
                    >
                      <TextField.Slot>#</TextField.Slot>
                    </TextField.Root>
                    <br></br>
                    <TextField.Root
                      defaultValue={level.name}
                      onChange={(e) =>
                        setLevel({ ...level, name: e.target.value })
                      }
                    >
                      <TextField.Slot>
                        <LetterCaseCapitalizeIcon></LetterCaseCapitalizeIcon>
                      </TextField.Slot>
                    </TextField.Root>
                    <br></br>
                    <TextField.Root
                      defaultValue={level.publisher}
                      onChange={(e) =>
                        setLevel({ ...level, publisher: e.target.value })
                      }
                    >
                      <TextField.Slot>
                        <PersonIcon></PersonIcon>
                      </TextField.Slot>
                    </TextField.Root>
                    <br></br>
                    <TextField.Root
                      defaultValue={level.ytcode}
                      onChange={(e) =>
                        setLevel({ ...level, ytcode: e.target.value })
                      }
                    >
                      <TextField.Slot>
                        <VideoIcon></VideoIcon>
                      </TextField.Slot>
                    </TextField.Root>
                    <br></br>
                    <Grid style={{ placeItems: "center" }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${level.ytcode}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </Grid>
                    <br></br>
                    {level.formerRank ? (
                      <>
                        <TextField.Root
                          defaultValue={level.removalReason}
                          onChange={(e) =>
                            setLevel({
                              ...level,
                              removalReason: e.target.value,
                            })
                          }
                        >
                          <TextField.Slot>Removal Reason</TextField.Slot>
                        </TextField.Root>
                        <br></br>
                      </>
                    ) : (
                      ""
                    )}
                    <Flex gap="2" align="center" justify={"center"}>
                      <Text size="6" as="p" weight="bold" align="center">
                        Records
                      </Text>
                      <Select.Root
                        defaultValue="lol"
                        onValueChange={(e) => {
                          if (e == "lol") return setRecord(null);
                          setRecord(null);
                          setOpenPlayers(false);
                          setTimeout(() => {
                            setRecord(parseInt(e));
                          }, 0);
                        }}
                      >
                        <Select.Trigger></Select.Trigger>
                        <Select.Content>
                          <Select.Group>
                            <Select.Item value={"lol"}>
                              Select Record
                            </Select.Item>
                            {level.list.map((x: any, i: number) => (
                              <Select.Item key={i} value={i.toString()}>
                                {x.player.name}
                              </Select.Item>
                            ))}
                          </Select.Group>
                        </Select.Content>
                      </Select.Root>
                    </Flex>
                    <br></br>
                    {record !== null ? (
                      <Box>
                        <TextField.Root
                          mt="4"
                          defaultValue={level.list[record].player.name}
                          placeholder="Player Name..."
                          id="player"
                          onClick={(e) => {
                            setFilteredPlayers(
                              leaderboards.filter((x: any) =>
                                x.name
                                  .toLowerCase()
                                  .includes(
                                    level.list[
                                      record as any
                                    ].player.name.toLowerCase(),
                                  ),
                              ),
                            );
                            setOpenPlayers(true);
                          }}
                          onChange={(e) => {
                            setEditedRecords([
                              ...editedRecords.filter(
                                (x) => x.id != level.list[record as any].id,
                              ),
                              {
                                id: level.list[record as any].id,
                                name: e.target.value,
                                link: level.list[record as any].link,
                                verification:
                                  level.list[record as any].verification,
                                beaten_when_weekly:
                                  level.list[record as any].beaten_when_weekly,
                              },
                            ]);
                            setLevel({
                              ...level,
                              list: level.list.map((x: any, i: number) => {
                                if (record != i) return x;
                                x.player.name = e.target.value;
                                return x;
                              }),
                            });
                            setFilteredPlayers(
                              leaderboards.filter((x: any) =>
                                x.name
                                  .toLowerCase()
                                  .includes(e.target.value.toLowerCase()),
                              ),
                            );
                          }}
                        >
                          <TextField.Slot style={{ paddingRight: "8px" }}>
                            <PersonIcon></PersonIcon>
                          </TextField.Slot>
                        </TextField.Root>
                        <Card
                          style={{
                            display: openPlayers ? "block" : "none",
                            maxHeight: "300px",
                            overflowY: "scroll",
                            overflowX: "hidden",
                            animation: "ease-in-out 1s",
                          }}
                        >
                          <div style={{ marginBottom: "10px" }}></div>
                          {filteredPlayers
                            .filter(
                              (x) =>
                                !level.list.find(
                                  (y: any, i: number) =>
                                    y.player.id == x.id && record != i,
                                ),
                            )
                            .map((e: any, i: number) => (
                              <Box key={i}>
                                {i ? <Separator my="3" size="4" /> : ""}
                                <Text
                                  className={styles.option}
                                  size="3"
                                  as="p"
                                  style={{ margin: "-8px" }}
                                  onClick={() => {
                                    setEditedRecords([
                                      ...editedRecords.filter(
                                        (x) =>
                                          x.id != level.list[record as any].id,
                                      ),
                                      {
                                        id: level.list[record as any].id,
                                        name: e.name,
                                        link: level.list[record as any].link,
                                        verification:
                                          level.list[record as any]
                                            .verification,
                                        beaten_when_weekly:
                                          level.list[record as any]
                                            .beaten_when_weekly,
                                      },
                                    ]);
                                    setLevel({
                                      ...level,
                                      list: level.list.map(
                                        (x: any, i: number) => {
                                          if (record != i) return x;
                                          x.player.name = e.name;
                                          return x;
                                        },
                                      ),
                                    });
                                    (
                                      document.getElementById("player") as any
                                    ).value = e.name;
                                    setOpenPlayers(false);
                                  }}
                                >
                                  <Text color="gray" mr="6">
                                    #{e.position}
                                  </Text>{" "}
                                  {e.name} ({e.records} points)
                                </Text>
                              </Box>
                            ))}
                        </Card>
                        <br></br>
                        <TextField.Root
                          defaultValue={level.list[record].link}
                          onChange={(e) => {
                            setEditedRecords([
                              ...editedRecords.filter(
                                (x) => x.id != level.list[record as any].id,
                              ),
                              {
                                id: level.list[record as any].id,
                                name: level.list[record as any].player.name,
                                link: e.target.value,
                                verification:
                                  level.list[record as any].verification,
                                beaten_when_weekly:
                                  level.list[record as any].beaten_when_weekly,
                              },
                            ]);
                            setLevel({
                              ...level,
                              list: level.list.map((x: any, i: number) => {
                                if (record != i) return x;
                                x.link = e.target.value;
                                return x;
                              }),
                            });
                          }}
                        >
                          <TextField.Slot>
                            <Link1Icon></Link1Icon>
                          </TextField.Slot>
                        </TextField.Root>
                        <br></br>
                        <Grid style={{ placeItems: "center" }}>
                          <iframe
                            src={`https://www.youtube.com/embed/${getYoutubeVideoId(level.list[record as any].link).videoId}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          ></iframe>
                        </Grid>
                        <br></br>
                        <Flex gap="3">
                          <TextField.Slot>Verification</TextField.Slot>
                          <Select.Root
                            defaultValue={JSON.stringify(
                              !!level.list[record].verification,
                            )}
                            onValueChange={(e) => {
                              setEditedRecords([
                                ...editedRecords.filter(
                                  (x) => x.id != level.list[record as any].id,
                                ),
                                {
                                  id: level.list[record as any].id,
                                  name: level.list[record as any].player.name,
                                  link: level.list[record as any].link,
                                  verification: JSON.parse(e),
                                  beaten_when_weekly:
                                    level.list[record as any]
                                      .beaten_when_weekly,
                                },
                              ]);
                              setLevel({
                                ...level,
                                list: level.list.map((x: any, i: number) => {
                                  if (record != i) return x;
                                  x.verification = JSON.parse(e);
                                  return x;
                                }),
                              });
                            }}
                          >
                            <Select.Trigger></Select.Trigger>
                            <Select.Content>
                              <Select.Group>
                                <Select.Item value={"true"}>true</Select.Item>
                                <Select.Item value={"false"}>false</Select.Item>
                              </Select.Group>
                            </Select.Content>
                          </Select.Root>
                        </Flex>
                        <br></br>
                        <Flex gap="3">
                          <TextField.Slot>Beaten When Weekly</TextField.Slot>
                          <Select.Root
                            defaultValue={JSON.stringify(
                              !!level.list[record].beaten_when_weekly,
                            )}
                            onValueChange={(e) => {
                              setEditedRecords([
                                ...editedRecords.filter(
                                  (x) => x.id != level.list[record as any].id,
                                ),
                                {
                                  id: level.list[record as any].id,
                                  name: level.list[record as any].player.name,
                                  link: level.list[record as any].link,
                                  verification:
                                    level.list[record as any].verification,
                                  beaten_when_weekly: JSON.parse(e),
                                },
                              ]);
                              setLevel({
                                ...level,
                                list: level.list.map((x: any, i: number) => {
                                  if (record != i) return x;
                                  x.beaten_when_weekly = JSON.parse(e);
                                  return x;
                                }),
                              });
                            }}
                          >
                            <Select.Trigger></Select.Trigger>
                            <Select.Content>
                              <Select.Group>
                                <Select.Item value={"true"}>true</Select.Item>
                                <Select.Item value={"false"}>false</Select.Item>
                              </Select.Group>
                            </Select.Content>
                          </Select.Root>
                        </Flex>
                        <br></br>
                        <Grid style={{ placeItems: "center" }}>
                          <Button
                            color="red"
                            onClick={() => {
                              setRecord(null);
                              setDeletedRecords([
                                ...deletedRecords,
                                level.list[record as any].id,
                              ]);
                              setEditedRecords(
                                editedRecords.filter(
                                  (x) => x.id != level.list[record as any].id,
                                ),
                              );
                              setLevel({
                                ...level,
                                list: level.list.filter(
                                  (x: any) =>
                                    x.id != level.list[record as any].id,
                                ),
                              });
                            }}
                          >
                            Delete
                          </Button>
                        </Grid>
                      </Box>
                    ) : (
                      ""
                    )}
                    <br></br>
                    <Flex justify={"center"} gap="9">
                      <Button
                        size="4"
                        onClick={async () => {
                          document.getElementById("close")?.click();
                          let obj: any = {
                            ...level,
                            editedRecords,
                            deletedRecords,
                          };
                          delete obj.hide;
                          delete obj.list;
                          setError({ color: "blue", message: "Loading..." });
                          let req = await fetch(`/api/${type}/` + level.id, {
                            method: "PATCH",
                            headers: {
                              "content-type": "application/json",
                              authorization: authData.token,
                            },
                            body: JSON.stringify(obj),
                          });
                          try {
                            let data = await req.json();
                            setError({ color: "red", message: data.message });
                          } catch (_) {
                            setError({
                              color: "blue",
                              message: "Fetching new information...",
                            });
                            let req = await fetch(`/api/${type}s?start=0`, {
                              headers: {
                                authorization: authData.token,
                              },
                            });
                            let levels = await req.json();
                            setError({
                              color: "green",
                              message: `Successfully edited level ${obj.name} by ${obj.publisher}`,
                            });
                            setFilteredLevels(levels);
                            setOriginalLevels(levels);
                            setTimeout(() => {
                              setError({ color: "red", message: "" });
                            }, 3000);
                          }
                        }}
                        id="submit"
                      >
                        Submit
                      </Button>
                      <Dialog.Root>
                        <Dialog.Trigger>
                          <Button size="4" color="red">
                            Delete
                          </Button>
                        </Dialog.Trigger>
                        <Dialog.Content>
                          <Dialog.Title
                            style={{ fontSize: "30px" }}
                            weight="bold"
                            as="h1"
                            align="center"
                          >
                            Reason?
                          </Dialog.Title>
                          <Dialog.Description align="center">
                            Do <b>NOT</b> specify if you don&apos;t want this
                            level to move to legacy
                          </Dialog.Description>
                          <br></br>
                          <TextField.Root id="reason">
                            <TextField.Slot>Reason</TextField.Slot>
                          </TextField.Root>
                          <br></br>
                          <Dialog.Close>
                            <Flex gap="9" justify="center">
                              <Button
                                color="red"
                                size="3"
                                onClick={async (_) => {
                                  document.getElementById("close")?.click();
                                  let obj = {
                                    id: level.id,
                                    removalReason: (
                                      document.getElementById("reason") as any
                                    ).value,
                                  };
                                  setError({
                                    color: "blue",
                                    message: "Loading...",
                                  });
                                  let req = await fetch(
                                    `/api/${type}/` + level.id,
                                    {
                                      method: "DELETE",
                                      headers: {
                                        "content-type": "application/json",
                                        authorization: authData.token,
                                      },
                                      body: JSON.stringify(obj),
                                    },
                                  );
                                  try {
                                    let data = await req.json();
                                    setError({
                                      color: "red",
                                      message: data.message,
                                    });
                                  } catch (_) {
                                    setError({
                                      color: "blue",
                                      message: "Fetching new information...",
                                    });
                                    let req = await fetch(
                                      `/api/${type}s?start=0`,
                                      {
                                        headers: {
                                          authorization: authData.token,
                                        },
                                      },
                                    );
                                    let levels = await req.json();
                                    setError({
                                      color: "green",
                                      message: `Successfully deleted level ${level.name} by ${level.publisher}`,
                                    });
                                    setFilteredLevels(levels);
                                    setOriginalLevels(levels);
                                    setTimeout(() => {
                                      setError({ color: "red", message: "" });
                                    }, 3000);
                                  }
                                }}
                              >
                                Continue
                              </Button>
                              <Button
                                color="red"
                                onClick={(_) =>
                                  setLevel({ ...level, removalReason: null })
                                }
                                size="3"
                              >
                                Close
                              </Button>
                            </Flex>
                          </Dialog.Close>
                        </Dialog.Content>
                      </Dialog.Root>
                    </Flex>
                    <br></br>
                    <br></br>

                    <Dialog.Close>
                      <Flex justify={"center"} gap="9">
                        <Button color="red" size="3" id="close">
                          Close
                        </Button>
                      </Flex>
                    </Dialog.Close>
                  </>
                ) : (
                  <Dialog.Title as="h1" style={{ fontSize: "30px" }}>
                    Loading level...
                  </Dialog.Title>
                )}
              </Dialog.Content>
            </Dialog.Root>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}
