import cache from "../../../../cache.json";

export async function GET(request: Request) {
  let admins = await fetch(
    `https://discord.com/api/v10/guilds/${process.env.ADMIN_SERVER}/members?limit=1000`,
    {
      headers: {
        authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
    },
  );
  let data = await admins.json();

  let rankings: Record<string, Array<any>> = {
    leaders: [],
    moderators: [],
    plat_helpers: [],
    helpers: [],
    server_admins: [],
    server_mods: [],
    developers: [],
  };
  try {
    let roles: Record<string, string> = {
      "904477213712318475": "leaders",
      "904477493229137961": "moderators",
      "904477700067037204": "helpers",
      "904477746745442365": "server_admins",
      "904477889439887371": "server_mods",
      "904507760236978186": "developers",
      "1285649220568748103": "plat_helpers",
    };

    for (let member of Array.isArray(data) ? data : []) {
      let rank = Object.entries(roles).find((e) =>
        member.roles.includes(e[0]),
      )?.[1];
      if (!rank) continue;
      let { user } = member;
      let isAlsoDev =
        rank != "developers" && member.roles.includes("904507760236978186");
      if (isAlsoDev) {
        rankings["developers"].push({
          id: user.id,
          name: user.global_name || user.username,
          tag: user.global_name
            ? user.username
            : `${user.username}#${user.discriminator}`,
          avatar: user.avatar
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}`
            : parseInt(user.discriminator)
              ? `https://cdn.discordapp.com/embed/avatars/${(parseInt(user.id) >> 22) % 6}.png`
              : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`,
          channel: cache.channels.find((e) => e.id == user.id)?.link || "#",
        });
      }
      let isAlsoPlatHelper =
        rank != "plat_helpers" && member.roles.includes("1285649220568748103");
      if (isAlsoPlatHelper) {
        rankings["plat_helpers"].push({
          id: user.id,
          name: user.global_name || user.username,
          tag: user.global_name
            ? user.username
            : `${user.username}#${user.discriminator}`,
          avatar: user.avatar
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}`
            : parseInt(user.discriminator)
              ? `https://cdn.discordapp.com/embed/avatars/${(parseInt(user.id) >> 22) % 6}.png`
              : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`,
          channel: cache.channels.find((e) => e.id == user.id)?.link || "#",
        });
      }
      rankings[rank].push({
        id: user.id,
        name: user.global_name || user.username,
        tag: user.global_name
          ? user.username
          : `${user.username}#${user.discriminator}`,
        avatar: user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a_") ? "gif" : "png"}`
          : parseInt(user.discriminator)
            ? `https://cdn.discordapp.com/embed/avatars/${(parseInt(user.id) >> 22) % 6}.png`
            : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator) % 5}.png`,
        channel: cache.channels.find((e) => e.id == user.id)?.link || "#",
      });
    }
  } catch (_) {
    console.log(_);
  }
  return new Response(JSON.stringify(rankings));
}

export const revalidate = 60;
