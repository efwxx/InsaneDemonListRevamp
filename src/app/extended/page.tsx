import AdComponent from '@/components/Ad'
import Level from '@/components/LevelCard'
import { Flex, Grid, Text } from '@radix-ui/themes'

export default async function Home() {

  let req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/levels?start=76&end=150`, {cache: "no-cache"})
  let levels = await req.json()
  
  return (
    <main>
      <br></br>
      <Flex gap="4" style={{placeItems: "center", justifyContent: "center"}}>
        <img src="/favicon.ico" style={{ width: "clamp(40px, 10vw, 70px)", height: "auto" }} alt="Logo"></img>
        <Text size="9" className="header" style={{display: "contents"}}>Extended List</Text>
        <img src="/favicon.ico" style={{ width: "clamp(40px, 10vw, 70px)", height: "auto" }} alt="Logo"></img>
      </Flex>
      <br></br>
      <Text size="5" className="header">This part of the list shows the levels between positions 76-150 on the list!</Text>
        <br></br><br></br>
        {levels.map((e: Record<any, any>) => <Grid style={{placeItems: "center"}} key={e.id}>{(e.position-1) % 5 == 0 ? <Grid style={{width: "min(100%, 1650px)"}}><AdComponent>
                        <ins className="adsbygoogle"
     style={{display:"block"}}
     data-ad-client="ca-pub-4543250064393866"
     data-ad-slot="4403955848"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
                    </AdComponent></Grid> : ""}<Level level={e}></Level><br></br></Grid>)}
    </main>
  )
}

export const revalidate = 0