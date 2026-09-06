import { Model } from "mongoose";

export async function generateUniqueSlug<T extends Document>(
  input: string,
  model: Model<T>,
): Promise<string> {
  return "slug";
}