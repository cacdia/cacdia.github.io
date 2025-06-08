import { Sala } from "./types";
import { SalaClicavel } from "./SalaClicavel";
import SVGHeader from "./SVGHeader";
import { type Rect } from "./types";
import { getSala } from "./utils";

interface SubsoloProps {
  salas: Sala[];
  onSalaClick: (salaId: string) => void;
  salaSelecionada: string | null;
}

export default function Subsolo({
  salas,
  onSalaClick,
  salaSelecionada,
}: SubsoloProps) {
  const elementos: readonly Rect[] = [
    {
      x: 129,
      y: 1,
      width: 198,
      height: 198,
      fill: "#ce1ed4",
      codigo: "CI SB01",
    },
    {
      x: 326,
      y: 1,
      width: 96,
      height: 198,
      fill: "#6a89cc",
      codigo: "CA",
    },
    {
      x: 421,
      y: 1,
      width: 96,
      height: 198,
      fill: "#e07a5f",
      codigo: "Almoxarifado",
    },
    {
      x: 132,
      y: 304,
      width: 310,
      height: 199,
      fill: "#1abc9c",
      codigo: "Almoxarifado",
    },
    {
      x: 208,
      y: 199,
      width: 310,
      height: 106,
      fill: "#f4efe7",
      codigo: "Corredor",
    },
    {
      x: 386,
      y: 283,
      width: 132,
      height: 23,
      fill: "#fdcb6e",
      codigo: "Escada",
    },
  ] as const;

  const components = elementos.map((item, index) => {
    if (item.codigo) {
      const { codigo, ...props } = item;
      return (
        <SalaClicavel
          key={codigo}
          codigo={codigo}
          sala={getSala(codigo, salas)}
          onSalaClick={onSalaClick}
          salaSelecionada={salaSelecionada}
          {...props}
        />
      );
    } else {
      return <rect key={`item-${index}`} {...item} />;
    }
  });

  return <SVGHeader>{components}</SVGHeader>;
}
