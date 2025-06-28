import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

/**
 * Componente do cabeçalho da página inicial.
 * Renderiza o hero banner com título, tagline e botões de navegação.
 * @returns {ReactNode} Elemento JSX do cabeçalho
 */
function HomepageHeader(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/fluxograma"
          >
            Fluxograma
          </Link>
          <Link className="button button--secondary button--lg" to="https://perere.pages.dev/">
            Mapa do CI
          </Link>
        </div>
      </div>
    </header>
  );
}

/**
 * Componente principal da página inicial.
 * Renderiza o layout completo com cabeçalho e funcionalidades principais.
 * @returns {ReactNode} Elemento JSX da página inicial
 */
export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
