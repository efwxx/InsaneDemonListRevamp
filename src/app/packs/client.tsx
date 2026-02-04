'use client';
import hexToRGB from "@/functions/hexToRGB";
import { CrossCircledIcon, CheckIcon, InfoCircledIcon, Link1Icon, PersonIcon, VideoIcon, LetterCaseCapitalizeIcon, DotFilledIcon, MinusIcon, PlusIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { Box, Button, Card, Dialog, Flex, Grid, SegmentedControl, Separator, Table, Text, TextField} from "@radix-ui/themes"
import { useEffect, useState } from "react"
import styles from "../../app/submit.module.css"

export default function Packs() {
    let [type, setType] = useState<"classic" | "platformer">("classic")
    let [packs, setPacks] = useState<Array<Record<any, any>>>([])
    let [pack, setPack] = useState<Record<any, any> | null>(null)
    let [leaderboards, setLeaderboards] = useState([])
    useEffect(() => {
        (async () => {
            let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/leaderboards${type == "platformer" ? "/platformer" : ""}?all=true`)
            let json = await req.json()
            setLeaderboards(json)
        })()
    }, [type])

    let [width, setWidth] = useState(0)

    let getWidth = () => typeof window === 'undefined' ? 0 : window.innerWidth
  
    useEffect(() => {
      setWidth(getWidth())
    })

    let [openPlayers, setOpenPlayers] = useState(false)
    let [profile, setProfile] = useState<Record<any, any> | null>(null)
    let [search, setSearch] = useState("")
    let [filteredPlayers, setFilteredPlayers] = useState(leaderboards)
    useEffect(() => {
        document.addEventListener("click", (e) => {
            if((e.target as any)?.classList?.contains?.("rt-TextFieldInput")) return;
            setOpenPlayers(false)
        })
    })
        useEffect(() => {
            (async () => {
                let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/packs${type == "classic" ? "" : "/platformer"}`)
                let json = await req.json()
                setPacks(json)
            })()
        }, [type])

    return (
        <Box>
            <Flex gap="4" style={{ placeItems: "center", justifyContent: "center" }}>
            <img src="/favicon.ico" style={{ width: "clamp(40px, 10vw, 70px)", height: "auto" }} alt="Logo"></img>
                <Text size="9" className="header" style={{ display: "contents" }}>Packs</Text>
                <img src="/favicon.ico" style={{ width: "clamp(40px, 10vw, 70px)", height: "auto" }} alt="Logo"></img>
            </Flex>
            <br></br>
            <Grid style={{placeItems: "center"}}>
            <SegmentedControl.Root size="3" defaultValue="classic" onValueChange={e => setType(e as any)}>
                <SegmentedControl.Item value="classic">Classic</SegmentedControl.Item>
                <SegmentedControl.Item value="platformer">Platformer</SegmentedControl.Item>
            </SegmentedControl.Root>
            <br></br>
            <Card style={{padding: "10px", width: "min(100%, 600px)"}}>
            <Text size="7" weight="bold">Select Player</Text>
            {profile == null ? "" : <><br></br>
            <Grid style={{placeItems: "center"}}>
                <Button variant="soft" color="gray" onClick={() => {
                    setSearch("");
                    (document.getElementById("player") as any).value = ""
                    setProfile(null)
                }}>Remove Selection</Button>
            </Grid></>}
            <TextField.Root mt="4" placeholder="Player Name..." id="player" onClick={(e) => {
                    setFilteredPlayers(leaderboards.filter((x:any) => x.name.toLowerCase().includes(search.toLowerCase())))
                    setOpenPlayers(true)
                }} onChange={(e) => {
                    setSearch(e.target.value)
                setFilteredPlayers(leaderboards.filter((x:any) => x.name.toLowerCase().includes(e.target.value.toLowerCase())))
            }}>
                <TextField.Slot style={{paddingRight: "8px"}}><PersonIcon></PersonIcon></TextField.Slot>
            </TextField.Root>
            <Card style={{display: openPlayers ? "block" : "none", maxHeight: "300px", overflowY: "scroll", overflowX: "hidden", animation: "ease-in-out 1s"}}>
            <div style={{marginBottom: "10px"}}></div>
            {filteredPlayers.map((e:any, i: number) => <Box key={i}>{i ? <Separator my="3" size="4" /> : ""}<Text className={styles.option} size="3" as="p" style={{margin: "-8px"}} onClick={async () => {
                let prof = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/leaderboard/${e.id}`, {cache: "no-cache"});
                let json = await prof.json();
                setProfile(json);
                setSearch(e.name);
                (document.getElementById("player") as any).value = e.name
                setOpenPlayers(false)
            }}><Text color="gray" mr="6">#{e.position}</Text> {e.name} ({e.records} points)</Text></Box>)}
            </Card>
        </Card>
            </Grid>
        <br></br>
            <Grid style={{placeItems: "center"}}>
            <Grid columns={width > 1200 ? "6" : width > 1000 ? "5" : width > 800 ? "4" : width > 600 ? "3" : width > 400 ? "2" : "1"} gap="4" style={{width: "min(2500px, 100%)"}}>
                {packs.sort((a: any, b: any) => profile != null ? ((!!(profile as any)?.packs?.find?.((i:any) => i.id == a.id)) as any) - ((!!(profile as any)?.packs?.find?.((i:any) => i.id == b.id)) as any) : a.position - b.position).map((e: any) => <Dialog.Root key={e.id} onOpenChange={async open => {
                    if(open) {
                        let req = await fetch(`/api/pack${type == "classic" ? "" : "/platformer"}/${e.id}`)
                        let pack = await req.json()
                        setPack(pack)
                    } else {
                        setPack(null)
                    }
                }}>
                    <Dialog.Trigger>
                        <Card id={e.id} key={e.id} style={{backgroundColor: `rgba(${Object.values(hexToRGB(e.color) as any).join(", ")}, 0.5)`}} className="infoCard">
                            <Flex justify="between" align={'center'}>
                                <Text size="4"><b>#{e.position}: </b>{e.name}</Text>
                                {profile != null ? (profile as any)?.packs?.find?.((i:any) => i.id == e.id) ? <CheckCircledIcon style={{scale: 2}}></CheckCircledIcon> : <CrossCircledIcon style={{scale: 2, color: "red"}}></CrossCircledIcon> : ""}
                            </Flex>
                        </Card>
                    </Dialog.Trigger>
                    <Dialog.Content>
                        {pack ? <>
                            <Dialog.Title as="h1" align='center' style={{fontSize: "30px"}}>{pack.name}</Dialog.Title>
                            {profile ? <Dialog.Description align='center' style={{fontSize: "15px"}}>Profile: {profile?.name}</Dialog.Description> : ""}
                        <br></br>
                        <Table.Root variant="surface" style={{backgroundColor: `rgba(${Object.values(hexToRGB(e.color) as any).join(", ")}, 0.3)`}}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell><Text size="3">#</Text></Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell><Text size="3">Name</Text></Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell><Text size="3">Publisher</Text></Table.ColumnHeaderCell>
                                    {profile ? <Table.ColumnHeaderCell><CheckCircledIcon style={{scale: 2}}></CheckCircledIcon></Table.ColumnHeaderCell> : ""}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {pack.levels.map((x:any) => <Table.Row key={x.id}>
                                    <Table.RowHeaderCell><Text size="3">{x.position}</Text></Table.RowHeaderCell>
                                    <Table.Cell><Text size="3"><a href={`/${type == "platformer" ? "platformer" : "level"}/${x.id}`} style={{textDecoration: "none"}}>{x.name}</a></Text></Table.Cell>
                                    <Table.Cell><Text size="3">{x.publisher}</Text></Table.Cell>
                                    {profile ? (profile as any)?.[type == "platformer" ? "platformers" : "records"]?.find?.((i:any) => i.level.id == x.id) ?  <Table.Cell><CheckCircledIcon style={{scale: 2}}></CheckCircledIcon></Table.Cell> :  <Table.Cell><CrossCircledIcon style={{scale: 2, color: "red"}}></CrossCircledIcon></Table.Cell> : ""}
                                </Table.Row>)}
                            </Table.Body>
                        </Table.Root>
                        <br></br>
                        <Dialog.Close>
                            <Grid style={{placeItems: "center"}}>
                            <Button color='red' size='4'>Close</Button>
                            </Grid>
                        </Dialog.Close>
                        </> : <Text size="8" weight='bold' align='center' as='p'>Loading pack...</Text>}
                    </Dialog.Content>
                </Dialog.Root>)}
            </Grid>
            </Grid>
        </Box>
    )
}