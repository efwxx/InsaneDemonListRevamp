function escapeRegExp(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export default function createPipeline(
  name: string,
  page: number = 1,
  max: number = Infinity,
  count: boolean = false,
  nationality: string | Record<"$ne", true> = { $ne: true },
) {
  return [
    {
      $lookup: {
        from: "records",
        let: {
          id: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$playerId", "$$id"],
              },
            },
          },
          {
            $lookup: {
              from: "levels",
              localField: "levelId",
              foreignField: "_id",
              as: "level",
            },
          },
          {
            $match: {
              $expr: {
                $ne: [
                  {
                    $size: "$level",
                  },
                  0,
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              id: {
                $toString: "$_id",
              },
              link: 1,
              verification: 1,
              beaten_when_weekly: 1,
              level: {
                $first: "$level",
              },
            },
          },
          {
            $project: {
              _id: 0,
              id: "$_id",
              link: 1,
              verification: 1,
              beaten_when_weekly: 1,
              level: {
                name: 1,
                ytcode: 1,
                publisher: 1,
                position: 1,
                id: {
                  $toString: "$level._id",
                },
              },
            },
          },
        ],
        as: "records",
      },
    },
    {
      $project: {
        name: 1,
        reliable: 1,
        nationality: 1,
        abbr: 1,
        accountId: 1,
        recordsForPoints: {
          $map: {
            input: "$records",
            in: {
              $cond: {
                if: {
                  $gt: ["$$this.level.position", 150],
                },
                then: 0,
                else: {
                  $round: [
                    {
                      $divide: [
                        {
                          $subtract: [
                            74875,
                            {
                              $multiply: [375, "$$this.level.position"],
                            },
                          ],
                        },
                        298,
                      ],
                    },
                    2,
                  ],
                },
              },
            },
          },
        },
        records: 1,
      },
    },
    {
      $project: {
        id: { $toString: "$_id" },
        name: 1,
        reliable: 1,
        nationality: 1,
        abbr: 1,
        accountId: 1,
        records: {
          $round: [
            {
              $reduce: {
                input: "$recordsForPoints",
                initialValue: 0,
                in: {
                  $add: ["$$value", "$$this"],
                },
              },
            },
            2,
          ],
        },
        hasAll150: {
          $eq: [
            {
              $size: {
                $setIntersection: [
                  {
                    $map: {
                      input: {
                        $filter: {
                          input: "$records",
                          cond: {
                            $and: [
                              { $lte: ["$$this.level.position", 150] },
                              { $gte: ["$$this.level.position", 1] },
                            ],
                          },
                        },
                      },
                      as: "rec",
                      in: "$$rec.level.position",
                    },
                  },
                  { $range: [1, 151] },
                ],
              },
            },
            150,
          ],
        },
      },
    },
    {
      $setWindowFields: {
        partitionBy: "_id",
        sortBy: {
          records: -1,
        },
        output: {
          position: {
            $documentNumber: {},
          },
        },
      },
    },
    {
      $match: {
        name: new RegExp(`${escapeRegExp(name) || "^"}`, "i"),
        abbr: nationality,
      },
    },
    {
      $setWindowFields: {
        partitionBy: "_id",
        sortBy: {
          records: -1,
        },
        output: {
          number: {
            $documentNumber: {},
          },
        },
      },
    },
    count
      ? {
          $count: "documents",
        }
      : {
          $match: {
            number: {
              $gt: max == Infinity ? 0 : (page - 1) * max,
              $lte: page * max,
            },
          },
        },
  ];
}
