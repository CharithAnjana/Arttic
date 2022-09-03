const { PrismaClient } = require("@prisma/client");
const asyncHandler = require("express-async-handler");
const { Client } = require("pg");

const { user, followerCreator, userSubscribe } = new PrismaClient();

//upload profile photos --------------------------------------------------
const uploadProfileOrCoverPicture = asyncHandler(async (req, res) => {
  //   console.log(req.file);
  //   res.send("Single FIle upload success");
  const userId = parseInt(req.headers.userid);
  const uploadFileType = req.headers.uploadfiletype;

  if (uploadFileType === "1") {
    const updateUser = await user.update({
      where: {
        userId: userId,
      },
      data: {
        profilePhoto: req.file.filename,
      },
    });
    res.json({
      statusCode: 1,
      msg: "Profile picture upload success",
    });
  } else if (uploadFileType === "2") {
    const updateUser = await followerCreator.update({
      where: {
        userId: userId,
      },
      data: {
        coverPhoto: req.file.filename,
      },
    });
    res.json({
      statusCode: 1,
      msg: "Cover picture upload success",
    });
  }
});
//end upload profile photos ----------------------------------


//get user details --------------------------------------------
const getUserDetails = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);

  const existUser = await user.findUnique({
    where: {
      userId: userId,
    },
    include: {
      followerCreator: true,
    },
  });

  res.json(existUser);
});
//end get user details ----------------------------------------



//check username-----------------------------------------------
const checkUserName = asyncHandler(async (req, res) => {
  const userName = req.params.name;
  const userId = parseInt(req.headers.userid);

  const existUser = await user.findMany({
    where: {
      AND: [
        { username: userName },
        { NOT: { userId: userId, } }
      ],
    },

    include: {
      followerCreator: true,
    },
  });

  //console.log(existUser);

  if (existUser.length !== 0) {
    res.json({
      status: "NO"
    });
  } else {
    res.json({
      status: "YES"
    });
  }
});
//end check username--------------------------------------------------------



//update user details ------------------------------------------------------
const updateUserDetails = asyncHandler(async (req, res) => {
  const userId = parseInt(req.headers.userid);

  let { name, username, bio } = req.body;

  const updateUser = await user.findUnique({
    where: {
      userId: userId,
    },
  });

  if (updateUser) {
    await user.update({
      where: {
        userId: userId,
      },
      data: {
        name: name,
        username: username,
        bio: bio,
      },
    });
    res.json({
      msg: "Profile details updated",
    });
  }
  else {
    res.json({
      msg: "Error!",
    });
  }
});
//  end update user details --------------------------------------------


//  upload a user report ---------------------------------------------
const uploadUserReport = asyncHandler(async (req, res) => {
  const Data = req.body;
  console.log(Data);
  // const CreateAdReport = await userReport.create({
  //   data: {
  //     userId: Data.userId,
  //     reportedUserId: Data.reportedUserId,
  //     reportCategory: parseInt(Data.category),
  //     description: Data.description,
  //   },
  // });
  // res.status(StatusCodes.CREATED).json(CreateAdReport);
  const client = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();
  const comments = await client.query({
    text: `INSERT INTO public."userReport"
    ("userId", "reportedUserId","reportCategory", description)
    VALUES ($1,$2,$3,$4);`,
    values: [
      Data.userId,
      Data.reportedUserId,
      parseInt(Data.category),
      Data.description,
    ],
  });
  await client.end();

  res.json("success");
});
//  end  upload a user report ---------------------------------------------


//  get followers details --------------------------------------------
const getFollowersDetails = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);


  const client = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();

  const result = await client.query(
    'SELECT "user"."userId","name","profilePhoto" FROM "userSubscribe" INNER JOIN "user" ON "user"."userId"="userSubscribe"."followerId"  WHERE "userSubscribe"."creatorId"=$1',
    [userId]
  );

  res.json(result.rows);
  await client.end();


  // const followers = await userSubscribe.findMany({
  //   where: {
  //     creatorId: userId,
  //   },
  //   include: {
  //     user: true,
  //   },
  // });

  // res.json(followers);
});
//  end get followers details ----------------------------------------


//  get followings details --------------------------------------------
const getFollowingsDetails = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id);


  const client = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();

  const result = await client.query(
    'SELECT "user"."userId","name","profilePhoto" FROM "userSubscribe" INNER JOIN "user" ON "user"."userId"="userSubscribe"."creatorId"  WHERE "userSubscribe"."followerId"=$1',
    [userId]
  );

  res.json(result.rows);
  await client.end();

  // const followings = await userSubscribe.findMany({
  //   where: {
  //     followerId: userId,
  //   },
  //   // include: {
  //   //   followerCreator: true,
  //   // },
  // });

  // res.json(followings);
});
//  end get followings details ----------------------------------------



module.exports = {
  uploadProfileOrCoverPicture,
  getUserDetails,
  checkUserName,
  updateUserDetails,
  uploadUserReport,
  getFollowersDetails,
  getFollowingsDetails,
};
