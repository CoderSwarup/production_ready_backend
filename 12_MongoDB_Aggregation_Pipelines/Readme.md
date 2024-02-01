# Learn Mongodb aggregation pipelines

Welcome to our comprehensive tutorial series, where we unravel the intricacies of MongoDB Aggregation Pipelines, guiding you in crafting a resilient and production-ready backend. Gain invaluable insights into the significance of aggregation pipelines and why they are indispensable in the realm of backend development. Let's embark on a journey to master the art of shaping data and optimizing your MongoDB queries for maximum efficiency. Ready to delve into the heart of MongoDB's power? Let's get started! 🚀

# Table of Contents

1. [Aggregation Pipeline](#aggregation-pipeline)
   - [Basic Code Example](#basic-code-example)
     - [Code Explanation](#code-explanation)
2. [Controller of the GetUserChannelDetails](#controller-of-the-getuserchanneldetails)
   - [GetUserChannelProfile Controller Explanation](#getuserchannelprofile-controller-explanation)
     - [Stage 1 ($match)](#stage-1-match)
     - [Stage 2 ($lookup)](#stage-2-lookup)
     - [Stage 3 ($lookup)](#stage-3-lookup)
     - [Stage 4 ($addFields)](#stage-4-addfields)
     - [Stage 5 ($project)](#stage-5-project)
3. [Connect with Me](#connect-with-me)

# Aggregation Pipeline

MongoDB's Aggregation Pipeline is a powerful tool that allows you to process data.

An aggregation pipeline consists of one or more stages that process documents:

Each stage performs an operation on the input documents. For example, a stage can filter documents, group documents, and calculate values.

The documents that are output from a stage are passed to the next stage.

An aggregation pipeline can return results for groups of documents. For example, return the total, average, maximum, and minimum values.

## Basic Code Example

```js
[
  // Stage one
  {
    $lookup: {
      from: collection,
      localField: field,
      foreignField: field,
      as: result,
    },
  },

  // stage two
  {
    $addFields: {
      $name: {
        $first: "result",
      },
    },
  },
];
```

## Code Explanation

### Stage one ($lookup):

- Performs a left outer join with the specified collection (`from`) using the local field (`localField`) and foreign field (`foreignField`).
- The result is stored in the specified array (`as`).

### Stage two ($addFields):

- Adds fields to the documents.
- In this example, it adds a new field named `$name`, which is assigned the value of the first element in the "result" array.

This basic code example demonstrates the use of MongoDB Aggregation Pipeline with two stages: `$lookup` and `$addFields`. The `$lookup` stage is commonly used for performing joins between collections, and the `$addFields` stage allows for adding new fields or modifying existing ones in the documents.

# Controller of the GetUserChannelDetails

```js
// Get User Channel Profile
export const GetUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, "Username parameter missing");
  }

  // aggregation Pipeline
  const channel = await UserModel.aggregate([
    // stage 1
    { $match: { username: username?.toLowerCase() } },

    // stage 2
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },

    // stage 3
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    // stage 4
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" },
        channelSubscribedToCount: { $size: "$subscribedTo" },
        isSubscribed: {
          $in: [
            new mongoose.Types.ObjectId(req.user?._id),
            "$subscribers.subscriber",
          ],
        },
      },
    },
    // stage 5
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(400, "Channel is Not Present");
  }

  res.status(200).json(new ApiResponse(200, channel, "User Channel Details "));
});
```

# GetUserChannelProfile Controller Explanation

The `GetUserChannelProfile` controller fetches channel details for a given username using MongoDB Aggregation Pipeline. Let's break down each stage:

## Stage 1 ($match)

Filters documents based on the provided username.

```javascript
{
  $match: {
    username: username?.toLowerCase();
  }
}
```

## Stage 2 ($lookup)

Performs a left outer join with the "subscriptions" collection based on `_id` and `channel` fields, storing the result in the "subscribers" array.

```js

{
  $lookup: {
    from: "subscriptions",
    localField: "_id",
    foreignField: "channel",
    as: "subscribers",
  }
}

```

## Stage 3 ($lookup)

Performs another left outer join with the "subscriptions" collection based on `_id` and `subscriber` fields, storing the result in the "subscribedTo" array.

```js

{
  $lookup: {
    from: "subscriptions",
    localField: "_id",
    foreignField: "subscriber",
    as: "subscribedTo",
  }
}


```

## Stage 4 ($addFields)

Adds fields to the documents, including `subscribersCount` (size of "subscribers" array), `channelSubscribedToCount` (size of "subscribedTo" array), and `isSubscribed` (checks if the user is subscribed).

```js

{
  $addFields: {
    subscribersCount: { $size: "$subscribers" },
    channelSubscribedToCount: { $size: "$subscribedTo" },
    isSubscribed: {
      $in: [new mongoose.Types.ObjectId(req.user?._id), "$subscribers.subscriber"],
    },
  }
}


```

## Stage 5 ($project)

Projects specific fields for the response, including `fullName`, `username`, `subscribersCount`, `channelSubscribedToCount`, `isSubscribed`, `avatar`, `coverImage`, and `email`.

```js

{
  $project: {
    fullName: 1,
    username: 1,
    subscribersCount: 1,
    channelSubscribedToCount: 1,
    isSubscribed: 1,
    avatar: 1,
    coverImage: 1,
    email: 1,
  }
}


```

If no channel is found, it throws a 400 error. The result is then sent as a JSON response.

## Connect with Me

Stay connected with me for more insights and updates on Production Level Backend Development:

- Linkedin: [![Linkedin](https://img.shields.io/badge/LinkedIn-Swarup%20Bhise-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/swarup-bhise-a981932aa/)

- GitHub: [![GitHub](https://img.shields.io/badge/GitHub-CoderSwarup-blue?style=flat&logo=github)](https://github.com/CoderSwarup)
- Instagram: [![Instagram](https://img.shields.io/badge/Instagram-swarup_bhise999-pink?style=flat&logo=instagram)](https://www.instagram.com/swarup_bhise999/)

Let's embark on a journey to become a skilled backend developer and create amazing web applications.

**Happy Coding!** 🎉
