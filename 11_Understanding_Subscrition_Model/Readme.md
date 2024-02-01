# Understanding the Subscription Model in Production-Level Backend Projects

In this comprehensive guide, we will delve into the Subscription Model implementation for your production-level backend project. We'll explore how it works and outline the benefits it offers.

## Table of Contents

1. [Introduction to Subscription Model](#introduction-to-subscription-model)
2. [Code Implementation](#code-implementation)
3. [Data Storage in the Model](#data-storage-in-the-model)
4. [Benefits](#benefits)
   1. [Find Subscribers of a Channel](#1-find-subscribers-of-a-channel)
   2. [Find the Channels Subscribed by a User](#2-find-the-channels-subscribed-by-a-user)
5. [Connect with Me](#connect-with-me)

## Introduction to Subscription Model

The Subscription Model is a crucial aspect of a production-level backend project. It involves the relationship between subscribers and channels. In the context of the provided code snippet, a subscriber and a channel are both represented by a User.

### Code Implementation

```js
import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
```

The schema defines two main entities - subscriber and channel, both represented by the "User" schema.

# Data Storage in the Model

Assuming the user list includes: a, b, c, and the channel list includes: HC, COC, FCC, the documents are created for each new subscriber:

```plaintext

{
    subscriber: ObjectID('a'),
    channel: ObjectID('HC')
}

{
    subscriber: ObjectID('b'),
    channel: ObjectID('COC')
}

{
    subscriber: ObjectID('c'),
    channel: ObjectID('FCC')
}

{
    subscriber: ObjectID('a'),
    channel: ObjectID('COC')
}

{
    subscriber: ObjectID('a'),
    channel: ObjectID('FCC')
}

```

# Benefits

## 1. Find Subscribers of a Channel

To retrieve the subscribers of a particular channel, use the following command:

```js
Subscription.find({ channel: ObjectId(Channel) });
```

This will return all documents representing subscribers of the specified channel.

## 2. Find the Channels Subscribed by a User

To get the list of channels subscribed by any user, use the following query:

```js
Subscription.find({ subscriber: ObjectId(Channel) });
```

This will Return all the channels that Subcribe by the User

## Connect with Me

Stay connected with me for more insights and updates on Production Level Backend Development:

- Linkedin: [![Linkedin](https://img.shields.io/badge/LinkedIn-Swarup%20Bhise-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/swarup-bhise-a981932aa/)

- GitHub: [![GitHub](https://img.shields.io/badge/GitHub-CoderSwarup-blue?style=flat&logo=github)](https://github.com/CoderSwarup)
- Instagram: [![Instagram](https://img.shields.io/badge/Instagram-swarup_bhise999-pink?style=flat&logo=instagram)](https://www.instagram.com/swarup_bhise999/)

Let's embark on a journey to become a skilled backend developer and create amazing web applications.

**Happy Coding!** 🎉
