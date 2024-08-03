import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    // searchParams=localhost:3000/api?username=rajat?phone=87897
    //we need to extact ussrname from it
    const queryParam = {
      username: searchParams.get("username"),
    };

    // validation with zod
    const result = UsernameQuerySchema.safeParse(queryParam);

    console.log(result);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message: "Invalid query parameters",
        },
        {
          status: 400,
        }
      );
    }
    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isverified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        {
          status: 400,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "username is available",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("\n error checking username \n", error);
    return Response.json(
      {
        success: false,
        message: "error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
