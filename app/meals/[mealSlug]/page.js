export default function MealDetailsPage({ params }) {
  return (
    <main>
      <h1>Meal Details Page</h1>
      <p>{params.mealSlug}</p>
    </main>
  );
}
