import { Sala } from "./types";
import { SalaClicavel } from "./SalaClicavel";
import SVGHeader from "./SVGHeader";
import { type Rect } from "./types";
import { getSala } from "./utils";

interface TerreoProps {
  salas: Sala[];
  onSalaClick: (salaId: string) => void;
  salaSelecionada: string | null;
}

export default function Terreo({
  salas,
  onSalaClick,
  salaSelecionada,
}: TerreoProps) {
  const elementos: readonly Rect[] = [
    {
      x: 675,
      y: 306,
      width: 154,
      height: 197,
      fill: "#f44336",
      codigo: "Convivência",
    },
    {
      x: 282,
      y: 339,
      width: 157,
      height: 164,
      fill: "#03a9f4",
      codigo: "Auditório",
    },
    {
      x: 130,
      y: 305,
      width: 152,
      height: 198,
      fill: "#ff9800",
      codigo: "Diretoria",
    },
    {
      x: 130,
      y: 1,
      width: 232,
      height: 197,
      fill: "#ffc107",
      codigo: "Biblioteca",
    },
    {
      x: 362,
      y: 1,
      width: 156,
      height: 165,
      fill: "#cddc39",
      codigo: "CI T06",
    },
    {
      x: 518,
      y: 1,
      width: 310,
      height: 165,
      fill: "#ff5722",
      codigo: "CI T07",
    },
    { x: 439, y: 381, width: 236, height: 122, fill: "#e91e63", codigo: "Corredor" },
    { x: 362, y: 166, width: 467, height: 33, fill: "#9c27b0", codigo: "Corredor" },
    { x: 675, y: 199, width: 87, height: 54, fill: "#673ab7", codigo: "Banheiro Feminino" },
    { x: 362, y: 305, width: 313, height: 34, fill: "#3f51b5", codigo: "Corredor" },
    { x: 282, y: 305, width: 80, height: 34, fill: "#2196f3", codigo: "Corredor" },
    { x: 601, y: 271, width: 41, height: 34, fill: "#00bcd4", codigo: "Elevador" },
    { x: 675, y: 253, width: 87, height: 53, fill: "#009688", codigo: "Banheiro Masculino" },
    { x: 642, y: 199, width: 33, height: 107, fill: "#4caf50", codigo: "Corredor" },
    { x: 601, y: 199, width: 41, height: 72, fill: "#8bc34a", codigo: "Copa" },
    { x: 517, y: 199, width: 84, height: 40, fill: "#ffeb3b", codigo: "Escada" },
    { x: 598, y: 339, width: 78, height: 42, fill: "#795548", codigo: "Corredor" },
    { x: 439, y: 339, width: 159, height: 42, fill: "#607d8b", codigo: "Corredor" },
    { x: 517, y: 239, width: 84, height: 57, fill: "#4fa3d1", codigo: "Escada" },
    { x: 517, y: 296, width: 84, height: 9, fill: "#ffb347", codigo: "Escada" },
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
