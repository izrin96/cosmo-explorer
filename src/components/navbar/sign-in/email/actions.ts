"use server";

import { getErrorMessage } from "@/lib/error";
import { login } from "@/lib/server/cosmo/auth";
import {
  exchangeToken,
  getRamperErrorMessage,
  sendLoginEmail,
} from "@/lib/server/ramper";
import { TypedActionResult } from "@/lib/types";
import { cookies } from "next/headers";
import { z } from "zod";
import { SignJWT } from "jose";
import { env } from "@/env.mjs";
import { TokenPayload } from "@/lib/universal/auth";

type SendRamperEmailResponse = {
  email: string;
  pendingToken: string;
};

export async function sendRamperEmail(
  form: FormData
): Promise<TypedActionResult<SendRamperEmailResponse>> {
  const input = Object.fromEntries(form.entries());

  const schema = z.object({
    transactionId: z.string().uuid(),
    email: z.string().email(),
  });

  const parseResult = schema.safeParse(input);

  if (!parseResult.success) {
    return {
      status: "error",
      validationErrors: parseResult.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await sendLoginEmail(parseResult.data);

    // complete failure
    if (result.success === false) {
      throw new Error(getRamperErrorMessage(result.data, "sendLoginEmail"));
    }

    // request failure? why is there errors in the success type?
    if (result.data.success === false) {
      throw new Error(getRamperErrorMessage(result.data, "sendLoginEmail"));
    }

    return {
      status: "success",
      data: {
        email: parseResult.data.email,
        pendingToken: result.data.pendingToken,
      },
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        status: "error",
        error: err.message,
      };
    }
    return { status: "error", error: getErrorMessage(err) };
  }
}


export type UserState = {
  nickname: string;
  address: string;
  customToken: string;
  socialLoginUserId: string;
};

export async function exchangeRamperToken(
  form: FormData
): Promise<TypedActionResult<UserState>> {
  const input = Object.fromEntries(form.entries());

  const schema = z.object({
    transactionId: z.string().uuid(),
    email: z.string().email(),
    pendingToken: z.string(),
  });

  const parseResult = schema.safeParse(input);

  if (!parseResult.success) {
    return {
      status: "error",
      validationErrors: parseResult.error.flatten().fieldErrors,
    };
  }

  try {
    const { transactionId, email, pendingToken } = parseResult.data;
    const exchange = await exchangeToken({
      transactionId,
      pendingToken,
    });

    if (exchange.success === false) {
      throw new Error(getRamperErrorMessage(exchange, "exchangeToken"));
    }

    // login with cosmo
    try {
      var { user, credentials } = await login(
        email,
        exchange.ssoCredential.idToken
      );
    } catch (err) {
      throw new Error(
        "COSMO error, are you sure you're using the correct email address?"
      );
    }

    const payload: TokenPayload = {
      id: user.id,
      nickname: user.nickname,
      address: user.address,
      accessToken: credentials.accessToken,
      refreshToken: credentials.refreshToken,
    };

    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const cookiePayload = await new SignJWT({ data: payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(secret);

    const store = await cookies();
    store.set("token", cookiePayload, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: true,
      httpOnly: true,
      secure: true,
    });

    return {
      status: "success",
      data: {
        nickname: user.nickname,
        address: user.address,
        customToken: exchange.customToken,
        socialLoginUserId: user.socialLoginUserId,
      },
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        status: "error",
        error: err.message,
      };
    }
    return { status: "error", error: getErrorMessage(err) };
  }
}
