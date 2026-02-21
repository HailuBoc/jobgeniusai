import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";
import { isClerkConfigured } from "./clerk";

const isClerkMiddlewareMissingError = (error) => {
  const message = String(error?.message || "");
  return message.includes("can't detect usage of clerkMiddleware()");
};

export const checkUser = async () => {
  if (!isClerkConfigured) {
    return null;
  }

  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;
    const email = user.emailAddresses?.[0]?.emailAddress;

    const existingByEmail = email
      ? await db.user.findUnique({ where: { email } })
      : null;

    if (existingByEmail) {
      const updatedUser = await db.user.update({
        where: { email },
        data: {
          clerkUserId: user.id,
          name,
          imageUrl: user.imageUrl,
        },
      });
      return updatedUser;
    }

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email,
      },
    });

    return newUser;
  } catch (error) {
    if (isClerkMiddlewareMissingError(error)) {
      return null;
    }

    console.log(error.message);
    return null;
  }
};
