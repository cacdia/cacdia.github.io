"use client";

import { useState } from "react";
import { Sala } from "./types";
import { DetalheSala } from "./DetalheSala";
import Subsolo from "./Subsolo";
import Terreo from "./Terreo";
import PrimeiroAndar from "./PrimeiroAndar";
import SegundoAndar from "./SegundoAndar";
import TerceiroAndar from "./TerceiroAndar";
import styles from "./mapa.module.css";

// Tipos
type AndarSelecionado =
  | "subsolo"
  | "terreo"
  | "primeiro"
  | "segundo"
  | "terceiro";

interface MapaInterativoProps {
  salas: Sala[];
}

interface AndarProps {
  salas: Sala[];
  onSalaClick: (sala: string) => void;
  salaSelecionada: string | null;
}

// Componentes auxiliares
function SeletorAndares({
  andarAtual,
  onChange,
}: {
  andarAtual: AndarSelecionado;
  onChange: (andar: AndarSelecionado) => void;
}) {
  const andares = [
    { value: "subsolo", label: "Subsolo" },
    { value: "terreo", label: "Térreo" },
    { value: "primeiro", label: "1º" },
    { value: "segundo", label: "2º" },
    { value: "terceiro", label: "3º" },
  ] as const;

  return (
    <div className={styles.seletorAndares}>
      {andares.map((andar) => (
        <button
          key={andar.value}
          onClick={() => onChange(andar.value)}
          className={`button ${
            andarAtual === andar.value ? "button--primary" : "button--secondary"
          } button--sm ${styles.botaoAndar}`}
        >
          {andar.label}
        </button>
      ))}
    </div>
  );
}

function Legendas() {
  const legendaItems = [
    { cor: "var(--ifm-color-primary)", texto: "Salas de Aula" },
    { cor: "#10b981", texto: "Laboratórios" },
    { cor: "#8b5cf6", texto: "Auditórios" },
    { cor: "#f97316", texto: "Professores" },
  ];

  return (
    <div className={`card__footer ${styles.legendas}`}>
      {legendaItems.map((item, index) => (
        <div key={index} className={styles.legendaItem}>
          <div
            className={styles.legendaMarca}
            style={{ backgroundColor: item.cor }}
          />
          <span>{item.texto}</span>
        </div>
      ))}
    </div>
  );
}

function ConteudoAndar({
  andarAtual,
  andarProps,
}: {
  andarAtual: AndarSelecionado;
  andarProps: AndarProps;
}) {
  switch (andarAtual) {
    case "subsolo":
      return <Subsolo {...andarProps} />;
    case "terreo":
      return <Terreo {...andarProps} />;
    case "primeiro":
      return <PrimeiroAndar {...andarProps} />;
    case "segundo":
      return <SegundoAndar {...andarProps} />;
    case "terceiro":
      return <TerceiroAndar {...andarProps} />;
    default:
      return <Terreo {...andarProps} />;
  }
}

// Componente principal
export function MapaInterativo({ salas }: MapaInterativoProps) {
  const [salaSelecionada, setSalaSelecionada] = useState<string | null>(null);
  const [andarAtual, setAndarAtual] = useState<AndarSelecionado>("terreo");

  const andarProps = {
    salas,
    onSalaClick: setSalaSelecionada,
    salaSelecionada,
  };

  return (
    <div className="card">
      <SeletorAndares andarAtual={andarAtual} onChange={setAndarAtual} />

      <div className={`card__body ${styles.mapaConteudo}`}>
        <ConteudoAndar andarAtual={andarAtual} andarProps={andarProps} />
      </div>

      <Legendas />

      {salaSelecionada && (
        <div className={styles.separador}>
          <DetalheSala
            codigoSala={salaSelecionada}
            onClose={() => setSalaSelecionada(null)}
            embedded={true}
          />
        </div>
      )}
    </div>
  );
}
