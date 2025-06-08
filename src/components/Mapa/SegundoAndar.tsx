import { Sala } from "./types";
import { SalaClicavel } from "./SalaClicavel";
import SVGHeader from "./SVGHeader";
import { type Rect } from "./types";
import { getSala } from "./utils";

interface SegundoAndarProps {
  salas: Sala[];
  onSalaClick: (salaId: string) => void;
  salaSelecionada: string | null;
}

export default function SegundoAndar({
  salas,
  onSalaClick,
  salaSelecionada,
}: SegundoAndarProps) {
  const elementos: readonly Rect[] = [
    {
      x: 130,
      y: 421,
      width: 77,
      height: 82,
      fill: "#FF33A1",
      codigo: "CI 210",
    },
    {
      x: 130,
      y: 1,
      width: 78,
      height: 197,
      fill: "#33FFC5",
      codigo: "CI 219",
    },
    {
      x: 130,
      y: 305,
      width: 78,
      height: 116,
      fill: "#C533FF",
      codigo: "CI 209",
    },
    {
      x: 207,
      y: 421,
      width: 78,
      height: 82,
      fill: "#53402d",
      codigo: "CI 211",
    },
    {
      x: 207,
      y: 338,
      width: 78,
      height: 83,
      fill: "#33FFFC",
      codigo: "CI 208",
    },
    {
      x: 207,
      y: 1,
      width: 78,
      height: 165,
      fill: "#6633FF",
      codigo: "CI 220",
    },
    {
      x: 285,
      y: 421,
      width: 78,
      height: 82,
      fill: "#FF3366",
      codigo: "CI 212",
    },
    {
      x: 285,
      y: 1,
      width: 78,
      height: 165,
      fill: "#66FF33",
      codigo: "CI 221",
    },
    {
      x: 285,
      y: 338,
      width: 78,
      height: 83,
      fill: "#3366FF",
      codigo: "CI 207",
    },
    {
      x: 363,
      y: 338,
      width: 78,
      height: 83,
      fill: "#FF33CC",
      codigo: "CI 206",
    },
    {
      x: 363,
      y: 421,
      width: 78,
      height: 82,
      fill: "#4133ff",
      codigo: "CI 213",
    },
    {
      x: 363,
      y: 1,
      width: 78,
      height: 165,
      fill: "#B233FF",
      codigo: "CI 222",
    },
    {
      x: 440,
      y: 338,
      width: 55,
      height: 83,
      fill: "#49144b",
      codigo: "CI 205",
    },
    {
      x: 440,
      y: 421,
      width: 55,
      height: 82,
      fill: "#ce6d2d",
      codigo: "CI 214",
    },
    {
      x: 440,
      y: 1,
      width: 78,
      height: 165,
      fill: "#9933FF",
      codigo: "CI 223",
    },
    {
      x: 517,
      y: 338,
      width: 78,
      height: 83,
      fill: "#33ff66",
      codigo: "CI 204",
    },
    {
      x: 517,
      y: 421,
      width: 78,
      height: 82,
      fill: "#1f6d33",
      codigo: "CI 215",
    },
    {
      x: 517,
      y: 1,
      width: 78,
      height: 165,
      fill: "#7B68EE",
      codigo: "CI 224",
    },
    {
      x: 595,
      y: 338,
      width: 78,
      height: 83,
      fill: "#FF33CC",
      codigo: "CI 203",
    },
    {
      x: 595,
      y: 1,
      width: 78,
      height: 165,
      fill: "#ff33ee",
      codigo: "CI 225",
    },
    {
      x: 595,
      y: 421,
      width: 78,
      height: 82,
      fill: "#CC33FF",
      codigo: "CI 216",
    },
    {
      x: 673,
      y: 1,
      width: 78,
      height: 165,
      fill: "#FFCC33",
      codigo: "CI 226",
    },
    {
      x: 673,
      y: 338,
      width: 78,
      height: 83,
      fill: "#33FFCC",
      codigo: "CI 202",
    },
    {
      x: 673,
      y: 421,
      width: 78,
      height: 82,
      fill: "#9370DB",
      codigo: "CI 217",
    },
    {
      x: 751,
      y: 338,
      width: 78,
      height: 83,
      fill: "#FF8C00",
      codigo: "CI 201",
    },
    {
      x: 751,
      y: 421,
      width: 78,
      height: 82,
      fill: "#57FF33",
      codigo: "CI 218",
    },
    {
      x: 751,
      y: 1,
      width: 78,
      height: 165,
      fill: "#4B0082",
      codigo: "CI 227",
    },
    {
      x: 517,
      y: 199,
      width: 82,
      height: 40,
      fill: "#1E90FF",
      codigo: "Escada",
    },
    { x: 517, y: 296, width: 82, height: 9, fill: "#32CD32", codigo: "Escada" },
    {
      x: 517,
      y: 239,
      width: 82,
      height: 57,
      fill: "#FF5733",
      codigo: "Escada",
    },
    { x: 599, y: 199, width: 42, height: 69, fill: "#33FF57", codigo: "Copa" },
    {
      x: 599,
      y: 268,
      width: 42,
      height: 37,
      fill: "#4b436b",
      codigo: "Elevador",
    },
    {
      x: 673,
      y: 199,
      width: 87,
      height: 53,
      fill: "#3357FF",
      codigo: "Banheiro Feminino",
    },
    {
      x: 673,
      y: 252,
      width: 87,
      height: 53,
      fill: "#9e5331",
      codigo: "Banheiro Masculino",
    },
    {
      x: 130,
      y: 503,
      width: 700,
      height: 37,
      fill: "#FFD700",
      codigo: "Corredor",
    },
    {
      x: 495,
      y: 338,
      width: 22,
      height: 165,
      fill: "#4169E1",
      codigo: "Corredor",
    },
    {
      x: 207,
      y: 165,
      width: 622,
      height: 33,
      fill: "#8FBC8F",
      codigo: "Corredor",
    },
    {
      x: 207,
      y: 305,
      width: 622,
      height: 33,
      fill: "#DA70D6",
      codigo: "Corredor",
    },
    {
      x: 641,
      y: 199,
      width: 32,
      height: 106,
      fill: "#FF1493",
      codigo: "Corredor",
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
