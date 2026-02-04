export default function createPipeline(id: string) {
  return [
    {
      $match: {
        _id: { $oid: id },
      },
    },
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
                extreme: {
                  $regexMatch: {
                    input: "$level.removalReason",
                    regex: "extreme",
                    options: "i",
                  },
                },
                position: 1,
                ytcode: 1,
                publisher: 1,
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
              from: "platformers",
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
              time: 1,
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
              time: 1,
              verification: 1,
              beaten_when_weekly: 1,
              level: {
                name: 1,
                extreme: {
                  $regexMatch: {
                    input: "$level.removalReason",
                    regex: "extreme",
                    options: "i",
                  },
                },
                position: 1,
                ytcode: 1,
                publisher: 1,
                id: {
                  $toString: "$level._id",
                },
              },
            },
          },
        ],
        as: "platformers",
      },
    },
    {
      $lookup: {
        from: "packs",
        let: {
          levels: {
            $map: {
              input: {
                $concatArrays: ["$records", "$platformers"],
              },
              in: {
                $toObjectId: "$$this.level.id",
              },
            },
          },
        },
        pipeline: [
          {
            $group: {
              _id: {
                $concat: [
                  {
                    $toString: "$position",
                  },
                  "$type",
                ],
              },
              packId: {
                $first: "$_id",
              },
              name: {
                $first: "$name",
              },
              position: {
                $first: "$position",
              },
              levels: {
                $push: "$levelId",
              },
              type: {
                $first: "$type",
              },
              color: {
                $first: "$color",
              },
            },
          },
          {
            $match: {
              $expr: {
                $eq: [
                  {
                    $size: {
                      $setIntersection: ["$levels", "$$levels"],
                    },
                  },
                  {
                    $size: "$levels",
                  },
                ],
              },
            },
          },
          {
            $lookup: {
              from: "platformers",
              let: {
                levs: "$levels",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $in: ["$_id", "$$levs"],
                    },
                  },
                },
                {
                  $project: {
                    name: 1,
                    position: 1,
                    ytcode: 1,
                    publisher: 1,
                    id: {
                      $toString: "$_id",
                    },
                    _id: 0,
                  },
                },
              ],
              as: "platformers",
            },
          },
          {
            $lookup: {
              from: "levels",
              let: {
                levs: "$levels",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $in: ["$_id", "$$levs"],
                    },
                  },
                },
                {
                  $project: {
                    name: 1,
                    position: 1,
                    ytcode: 1,
                    publisher: 1,
                    id: {
                      $toString: "$_id",
                    },
                    _id: 0,
                  },
                },
              ],
              as: "levels",
            },
          },
          {
            $project: {
              id: {
                $toString: "$packId",
              },
              name: 1,
              type: 1,
              levels: {
                $sortArray: {
                  input: {
                    $concatArrays: ["$levels", "$platformers"],
                  },
                  sortBy: { position: 1 },
                },
              },
              color: 1,
              position: 1,
              _id: 0,
            },
          },
        ],
        as: "packs",
      },
    },
    {
      $project: {
        id: {
          $toString: "$_id",
        },
        name: 1,
        type: 1,
        reliable: 1,
        platformers: {
          $sortArray: {
            input: "$platformers",
            sortBy: { "level.position": 1 },
          },
        },
        records: {
          $sortArray: {
            input: "$records",
            sortBy: { "level.position": 1 },
          },
        },
        nationality: 1,
        abbr: 1,
        packs: {
          $sortArray: {
            input: "$packs",
            sortBy: { position: 1 },
          },
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
        _id: 0,
      },
    },
  ];
}
