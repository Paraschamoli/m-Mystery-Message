import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { verifySchema } from "@/schemas/verifySchema";

const verifyCodeQuerySchema = z.object({
  verifyCode: verifySchema,
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 400,
        }
      );
    }
    const iscodeValid = user.verifyCode === code;
    const iscodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (iscodeValid && iscodeNotExpired) {
      user.isverified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!iscodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "verifyCode has been expired please sign-up again",
        },
        {
          status: 400,
        }
      );
    }else{
      return Response.json(
        {
          success: false,
          message: "incorrect verification code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.log("\n error verifying  user \n", error);
    return Response.json(
      {
        success: false,
        message: "error verifying  user",
      },
      {
        status: 500,
      }
    );
  }
}
