'use client';
import LeaderboardCard from '@/components/LeaderboardCard'
import { CaretDownIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Box, Button, Flex, Grid, SegmentedControl, Select, Text, TextField } from '@radix-ui/themes'
import { useEffect, useState } from 'react';
import Image from "next/image"
import cache from "../../../cache.json"
import Pagination from '@/components/Pagination';
import AdComponent from '@/components/Ad';

interface info {
    profs: Record<any, any>
    p: number
}

export default function LeaderboardClient({ profs, p }: info) {
    let [pages, setPages] = useState(p)
    let [profiles, setProfiles] = useState(profs)
    let [nations, setNations] = useState([])
    let [page, setPage] = useState(1)
    let [type, setType] = useState<"users" | "nations">("users")
    let [loading, setLoading] = useState(false)
    let [filter, setFilter] = useState("")
    let [nationality, setNationality] = useState(["International", "International"])
    let [max, setMax] = useState(25)
    let [gdType, setGDType] = useState<"classic" | "platformer">("classic")
    let queue = ""
    let sliderQueue = ""

    async function changePage(e: number, f: string = filter, reset: boolean = false, n: string = nationality[1], getNations: typeof type = type, m: number = max, GDType: typeof gdType = gdType) {
        setLoading(true)
        let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/leaderboards${GDType == "classic" ? "" : "/platformer"}${getNations == "nations" ? '/nations' : ""}?page=${e}${f ? `&name=${encodeURIComponent(f)}` : ""}${n != "International" ? `&nationality=${n}` : ""}&max=${m}`, { cache: "no-cache" })
        let profs = await req.json()
        if (getNations == "nations") {
            setNations(profs.profiles)
        } else {
            setProfiles(profs.profiles)
        }
        setPage(e)
        if (reset) setPages(profs.pages)
        setLoading(false)
    }

    return (
        <Box style={{ opacity: loading ? 0.5 : 1, overflowX: "hidden" }}>
            <Flex gap="4" style={{ placeItems: "center", justifyContent: "center" }}>
                <img src="/favicon.ico" style={{ width: "clamp(40px, 10vw, 70px)", height: "auto" }} alt="Logo"></img>
                <Text size="9" className="header" style={{ display: "contents" }}>Leaderboards</Text>
                <img src="/favicon.ico" style={{ width: "clamp(40px, 10vw, 70px)", height: "auto" }} alt="Logo"></img>
            </Flex>
            <br></br>
            <Text size="5" className="header">This part of the list shows the best {type == "users" ? "players" : "countries"} on the Insane Demon List!</Text>
            <br></br><br></br>
            <Grid style={{ placeItems: "center" }}>
            <SegmentedControl.Root size="3" defaultValue="classic" onValueChange={(e:any) => {
                setGDType(e)
                changePage(1, undefined, true, undefined, undefined, undefined, e)
            }}>
                <SegmentedControl.Item value="classic">Classic</SegmentedControl.Item>
                <SegmentedControl.Item value="platformer">Platformer</SegmentedControl.Item>
            </SegmentedControl.Root>
                <br></br>
                <TextField.Root style={{ width: "min(100%, 800px)", fontSize: "20px", height: "40px" }} placeholder='Search...' onChange={async (e) => {
                        let key = crypto.randomUUID()
                        queue = key
                        setTimeout(() => {
                            if (queue != key) return;
                            setFilter(e.target.value.trim())
                            changePage(1, e.target.value.trim(), true)
                        }, 1000)
                    }}>
                    <TextField.Slot>
                        <MagnifyingGlassIcon style={{ scale: 1.8, padding: "5px" }}></MagnifyingGlassIcon>
                    </TextField.Slot>
                </TextField.Root>
            </Grid>
            <br></br>
            <Grid style={{ placeItems: "center" }}>
                <Select.Root defaultValue={JSON.stringify(nationality)} onValueChange={(e) => {
                    let value = JSON.parse(e)
                    setNationality(value)
                    changePage(1, undefined, true, value[1])
                }}>
                    <Select.Trigger style={{ width: "min(100%, 400px)", fontSize: "20px" }} color="cyan"></Select.Trigger>
                    <Select.Content>
                        {Object.entries(cache.nationalities).map(e => <Select.Item key={e[1]} value={JSON.stringify(e)}>
                            <Flex gap="3">
                                <Image alt={e[1]} src={e[0] != "International" ? `https://raw.githubusercontent.com/lipis/flag-icons/4f420bdd2e954f6da11220f1136fa181ed7019e7/flags/4x3/${e[1]}.svg` : "/international.png"} width={24} height={18}></Image>
                                <Text size="3">{e[0]}</Text>
                            </Flex>
                        </Select.Item>)}
                    </Select.Content>
                </Select.Root>
            </Grid>
            <br></br>
            <Grid style={{ placeItems: "center" }}>
                <Button color="cyan" style={{ width: "min(100%, 350px)" }} onClick={async () => {
                    let t: typeof type = type == "nations" ? "users" : 'nations'
                    setType(t)
                    changePage(1, undefined, true, undefined, t)
                }}>
                    <Text size="5" as="p" align='center'>Switch to {type == "users" ? "nationalities" : "players"} leaderboard</Text>
                </Button>
                <br></br>
                <Flex gap="2" align='center'>
                <Text size="3">{type == 'users' ? "Profiles" : "Nationalities"} per page:</Text><TextField.Root style={{width: "5ch"}} type='number' defaultValue={max} onChange={(e) => {
                    let value = parseInt(e.target.value)
                    let key = crypto.randomUUID()
                    sliderQueue = key
                    setTimeout(() => {
                        if (sliderQueue != key) return;
                        if(value > 100) {
                            e.target.value = "100"
                            value = 100
                        }
                        if(value < 10) {
                            e.target.value = "10"
                            value = 10
                        }
                        setMax(value)
                        changePage(1, undefined, true, undefined, undefined, value)
                    }, 1000)
                }}></TextField.Root>
                </Flex>
                <br></br>
                <Pagination
                    page={page}
                    count={pages}
                    onChange={changePage}
                ></Pagination>
                <Text size={"1"} style={{ marginTop: "5px", opacity: 0.5 }} color={"gray"}>Click the &quot;...&quot; to specify a page!</Text>
            </Grid>
            <br></br>
            {(type == "users" ? profiles : nations).map((e: Record<any, any>, i: number) => <Grid style={{ placeItems: "center" }} key={e.id}>{(e.position-1) % 5 == 0 ? <Grid style={{width: "min(100%, 800px)"}}><AdComponent>
                        <ins className="adsbygoogle"
     style={{display:"block"}}
     data-ad-client="ca-pub-4543250064393866"
     data-ad-slot="4403955848"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
                    </AdComponent></Grid> : ""}<LeaderboardCard profile={e} nationalities={type == "nations"} platformer={gdType ==  "platformer"}></LeaderboardCard><br></br></Grid>)}
        </Box>
    )
}
