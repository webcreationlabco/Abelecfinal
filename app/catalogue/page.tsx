import Header from "@/components/header";
import Footer from "@/components/footer";
import CatalogueClient from "./catalogue-client";

export const metadata = {
  title: "Catalogue — Abelec",
  description: "Trouvez votre pièce détachée parmi plus de 100 000 références.",
};

interface Props {
  searchParams: { categorie?: string; q?: string };
}

export default function CataloguePage({ searchParams }: Props) {
  // Normalize four-cuisiniere → four (internal catalogue slug)
  const categorie = searchParams.categorie === "four-cuisiniere" ? "four" : searchParams.categorie;

  return (
    <>
      <Header />
      <CatalogueClient
        initialCategory={categorie}
        searchQuery={searchParams.q}
      />
      <Footer />
    </>
  );
}
