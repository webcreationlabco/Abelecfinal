import ProductPage from "@/components/product-page";

export default function Page({ params }: { params: { slug: string } }) {
  return <ProductPage slug={params.slug} />;
}
