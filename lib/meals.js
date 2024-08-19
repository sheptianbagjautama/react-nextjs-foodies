import sql from "better-sqlite3";

const db = sql("meals.db");

export async function getMeals() {
  //agar data di load lebih lama, untuk kebutuhan testing loading
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return db.prepare("SELECT * FROM meals").all();
}
