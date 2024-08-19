import sql from "better-sqlite3";

const db = sql("meals.db");

export async function getMeals() {
  //agar data di load lebih lama, untuk kebutuhan testing loading
  await new Promise((resolve) => setTimeout(resolve, 5000));

  //untuk testing error page
  //throw new Error("Loading Meals Failed");
  return db.prepare("SELECT * FROM meals").all();
}
