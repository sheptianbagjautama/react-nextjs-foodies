import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";
import fs from "node:fs";

const db = sql("meals.db");

export async function getMeals() {
  //agar data di load lebih lama, untuk kebutuhan testing loading
  await new Promise((resolve) => setTimeout(resolve, 5000));

  //untuk testing error page
  //throw new Error("Loading Meals Failed");
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ? ").get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  //untuk melindungin dari serangan script attack
  meal.instructions = xss(meal.instructions);

  const extension = meal.image.name.split(".").pop();
  console.log("extension", extension);

  const fileName = `${meal.slug}.${extension}`;
  console.log("fileName", fileName);

  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImage = await meal.image.arrayBuffer();
  console.log("bufferedImage", bufferedImage);

  stream.write(
    Buffer.from(bufferedImage, (error) => {
      if (error) {
        throw new Error("Saving image failed!");
      }
    })
  );

  meal.image = `/images/${fileName}`;

  db.prepare(
    `
    INSERT INTO meals 
    (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
 `
  ).run(meal);

  // db.prepare(
  //   `
  //   INSERT INTO meals
  //   (title, summary, instructions, creator, creator_email, image, slug)
  //   VALUES (
  //     @title,
  //     @summary,
  //     @instructions,
  //     @creator,
  //     @creator_email,
  //     @image,
  //     @slug,
  //   )`
  // ).run(meal);
}
