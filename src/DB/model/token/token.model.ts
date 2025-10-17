import { model } from "mongoose";
import { tokenSchema } from "./token.schema";

export const Token = model("Token",tokenSchema);