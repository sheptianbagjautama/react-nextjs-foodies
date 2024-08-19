import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

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

export function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  //untuk melindungin dari serangan script attack
  meal.instructions = xss(meal.instructions);
}
