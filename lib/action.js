"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

function isInvalidText(text) {
  return !text || text.trim() === "";
}

//server actions , di kirim dalam bentuk server component bukan seperti react di eksekusi di client component
export async function shareMeal(prevState, formData) {
  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };

  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes("@") ||
    !meal.image ||
    !meal.image.size === 0
  ) {
    return {
      message: "Invalid input.",
    };
  }

  await saveMeal(meal);

  //revalidatePath => membuang cache yang ada agar data yang sudah di tambahkan dapat muncul di halaman, jadi di fetch kembali
  // revalidatePath("/meals", "layout"); kalo ada layout nya berarti semua nested page cache nya akan di buang , dan di refetch kembali
  revalidatePath("/meals");
  redirect("/meals");
}
