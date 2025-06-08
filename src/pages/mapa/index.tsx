import { MapaInterativo } from "@site/src/components/Mapa/MapaInterativo";
import { DadosCronograma } from "@site/src/components/Mapa/data";
import Layout from "@theme/Layout";

// Main page component - displays only the interactive map
export default function HomePage() {
  // Get room data for the map
  const { salas } = DadosCronograma();

  return (
    <Layout
      title="Mapa Interativo"
      description="Mapa interativo do Centro de Informática da UFPB"
    >
      <main className="container margin-vert--lg">
        {/* Header semântico para SEO e acessibilidade */}
        <header className="text--center margin-bottom--lg">
          <h1>Mapa Interativo do Centro de Informática</h1>
        </header>

        <div className="row">
          <div className="col">
            <MapaInterativo salas={salas} />
          </div>
        </div>
      </main>
    </Layout>
  );
}
