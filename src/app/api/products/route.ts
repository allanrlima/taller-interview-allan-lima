import { products } from "@/data/products";
import { filterProductsByQuery } from "@/lib/products";

const NETWORK_DELAY_MS = 350;

export async function GET(request: Request) {
  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY_MS));
  const { searchParams } = new URL(request.url);

  if (searchParams.get("error") === "true") {
    return Response.json({ message: "Simulated product service failure" }, { status: 503 });
  }

  const matchingProducts = filterProductsByQuery(
    products,
    searchParams.get("q") ?? "",
  );

  return Response.json(matchingProducts, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
