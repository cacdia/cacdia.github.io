import { Sala } from "./types";
import { SalaClicavel } from "./SalaClicavel";
import SVGHeader from "./SVGHeader";
import { type Rect } from "./types";
import { getSala } from "./utils";

interface TerceiroAndarProps {
  salas: Sala[];
  onSalaClick: (salaId: string) => void;
  salaSelecionada: string | null;
}

export default function TerceiroAndar({
  salas,
  onSalaClick,
  salaSelecionada,
}: TerceiroAndarProps) {
  const elementos: readonly Rect[] = [
    {
      x: 130,
      y: 1,
      width: 78,
      height: 197,
      fill: "#a3e1dc",
      codigo: "CI 312",
    },
    {
      x: 207,
      y: 1,
      width: 78,
      height: 197,
      fill: "#f67280",
      codigo: "CI 313",
    },
    {
      x: 285,
      y: 1,
      width: 78,
      height: 164,
      fill: "#f9b384",
      codigo: "CI 314",
    },
    {
      x: 363,
      y: 1,
      width: 78,
      height: 164,
      fill: "#b2d7e6",
      codigo: "CI 315",
    },
    {
      x: 440,
      y: 1,
      width: 78,
      height: 164,
      fill: "#f6c85f",
      codigo: "CI 316",
    },
    {
      x: 518,
      y: 1,
      width: 78,
      height: 164,
      fill: "#e07a5f",
      codigo: "CI 317",
    },
    {
      x: 595,
      y: 1,
      width: 78,
      height: 164,
      fill: "#6a89cc",
      codigo: "CI 318",
    },
    {
      x: 673,
      y: 1,
      width: 78,
      height: 164,
      fill: "#f67280",
      codigo: "CI 319",
    },
    {
      x: 751,
      y: 1,
      width: 78,
      height: 198,
      fill: "#355c7d",
      codigo: "CI 320",
    },
    {
      x: 129,
      y: 305,
      width: 78,
      height: 198,
      fill: "#4610aa",
      codigo: "CI 311",
    },
    {
      x: 207,
      y: 305,
      width: 78,
      height: 198,
      fill: "#f285b9",
      codigo: "CI 310",
    },
    {
      x: 284,
      y: 338,
      width: 78,
      height: 165,
      fill: "#2ecc71",
      codigo: "CI 309",
    },
    {
      x: 362,
      y: 338,
      width: 78,
      height: 165,
      fill: "#e67e22",
      codigo: "CI 308",
    },
    {
      x: 440,
      y: 338,
      width: 78,
      height: 165,
      fill: "#f6c85f",
      codigo: "CI 307",
    },
    {
      x: 517,
      y: 338,
      width: 78,
      height: 165,
      fill: "#9b59b6",
      codigo: "CI 306",
    },
    {
      x: 594.5,
      y: 338,
      width: 78,
      height: 165,
      fill: "#1abc9c",
      codigo: "CI 305",
    },
    {
      x: 672,
      y: 338,
      width: 157,
      height: 165,
      fill: "#34495e",
      codigo: "CI 304",
    },
    { x: 599, y: 199, width: 42, height: 69, fill: "#f8b195", codigo: "Copa" },
    { x: 599, y: 268, width: 42, height: 37, fill: "#b07aa1", codigo: "Elevador" },
    { x: 517, y: 199, width: 82, height: 39, fill: "#7ec850", codigo: "Escada" },
    { x: 673, y: 199, width: 87, height: 53, fill: "#e84393", codigo: "Banheiro Feminino" },
    { x: 673, y: 252, width: 87, height: 53, fill: "#fdcb6e", codigo: "Banheiro Masculino" },
    { x: 517, y: 239, width: 82, height: 57, fill: "#4fa3d1", codigo: "Escada" },
    { x: 517, y: 296, width: 82, height: 9, fill: "#ffb347", codigo: "Escada" },
    { x: 641, y: 199, width: 32, height: 106, fill: "#c06c84", codigo: "Corredor" },
    { x: 207, y: 165, width: 544, height: 33, fill: "#6c5b7b", codigo: "Corredor" },
    { x: 207, y: 305, width: 622, height: 33, fill: "#f7e967", codigo: "Corredor" },
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
