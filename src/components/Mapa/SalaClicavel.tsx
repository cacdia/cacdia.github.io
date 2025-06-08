import React from "react";
import { Sala, Rect } from "./types";
import styles from "./mapa.module.css";

// Estende Rect com as propriedades adicionais necessárias
interface SalaClicavelProps extends Rect {
  codigo: string;
  sala?: Sala;
  onSalaClick: (salaId: string) => void;
  salaSelecionada: string | null;
}

/**
 * Determines if a room is infrastructure (non-clickable)
 */
const isInfrastructureRoom = (text: string): boolean =>
  ["corredor", "escada", "elevador"].includes(text.toLowerCase());

/**
 * Room rectangle component
 */
function RoomRect({
  x,
  y,
  width,
  height,
  backgroundColor,
  borderColor,
  borderWidth,
  borderRadius,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isInteractive,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isInteractive: boolean;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={backgroundColor}
      stroke={borderColor}
      strokeWidth={borderWidth}
      rx={borderRadius}
      ry={borderRadius}
      className={`${styles.salaRect} ${isInteractive ? styles.salaRectInteractive : ''}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
}

/**
 * Room text component with smart line breaking
 */
function RoomText({
  x,
  y,
  width,
  height,
  text,
  fontSize,
  textColor,
  isSelected,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
  textColor: string;
  isSelected: boolean;
}) {
  const needsLineBreak = text.length > 8 && width < 100;
  const centerX = x + width / 2;

  return (
    <text
      x={centerX}
      y={y + height / 2}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={fontSize}
      fill={textColor}
      className={`
        ${styles.salaText}
        ${isSelected ? styles.salaTextSelected : styles.salaTextRegular}
        ${fontSize < 10 ? styles.salaTextSmall : styles.salaTextNormal}
      `}
    >
      {needsLineBreak ? (
        <>
          <tspan x={centerX} dy={-fontSize / 2}>
            {text.split(" ")[0]}
          </tspan>
          {text.split(" ").length > 1 && (
            <tspan x={centerX} dy={fontSize}>
              {text.split(" ").slice(1).join(" ")}
            </tspan>
          )}
        </>
      ) : (
        text
      )}
    </text>
  );
}

/**
 * Gets appropriate room color based on room type
 */
function getRoomColor(codigo: string, displayText: string): string {
  const normalizedText = displayText.toLowerCase();

  // Room color mapping using CSS variables
  const specialRoomColors: Record<string, string> = {
    "banheiro masculino": "var(--sala-banheiro-masculino)",
    "banheiro feminino": "var(--sala-banheiro-feminino)",
    corredor: "var(--sala-corredor)",
    escada: "var(--sala-escada)",
    elevador: "var(--sala-elevador)",
    biblioteca: "var(--sala-biblioteca)",
    auditório: "var(--sala-auditorio)",
    convivência: "var(--sala-convivencia)",
    "espaço de convivência": "var(--sala-convivencia)",
    diretoria: "var(--sala-direcao)",
    copa: "var(--sala-copa)",
    "assessoria financeira": "var(--sala-assessoria)",
    "assessoria de planejamento": "var(--sala-assessoria)",
  };

  // CI classrooms
  if (codigo.match(/^CI\s*[0-9]/i)) {
    return "var(--sala-default)";
  }

  return specialRoomColors[normalizedText] || "var(--sala-default)";
}

/**
 * Sala clicável component for interactive map
 */
export function SalaClicavel({
  x,
  y,
  width,
  height,
  codigo,
  sala,
  onSalaClick,
  salaSelecionada,
}: SalaClicavelProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const isSelected = salaSelecionada === codigo;
  const isClickable = !!sala;
  const displayText = sala?.nome || codigo;
  const isInfrastructure = isInfrastructureRoom(displayText);
  const isInteractive = isClickable && !isInfrastructure;

  // Room state and styling
  const baseColor = getRoomColor(codigo, displayText);
  const backgroundColor = isSelected
    ? "var(--sala-selected)"
    : isHovered && isInteractive
    ? "var(--sala-hover)"
    : baseColor;

  const borderColor = isSelected
    ? "var(--borda-selected)"
    : isHovered && isInteractive
    ? "var(--borda-hover)"
    : isInteractive
    ? "var(--borda-default)"
    : "var(--borda-subtle)";

  // Calculate font size based on room dimensions
  const fontSize = (() => {
    const minSize = 8;
    const maxSize = 16;
    const baseSize = Math.min(width / 8, height / 4);
    const textAdjustment = Math.max(0.8, 1 - (displayText.length - 6) * 0.05);
    return Math.max(minSize, Math.min(maxSize, baseSize * textAdjustment));
  })();

  // Text color for contrast
  const textColor = backgroundColor === "var(--sala-selected)"
    ? "var(--texto-claro)"
    : "var(--texto-escuro)";

  // Event handlers
  const handleClick = () => isClickable && onSalaClick(codigo);
  const handleMouseEnter = () => {
    if (isInteractive && !isSelected) setIsHovered(true);
  };
  const handleMouseLeave = () => {
    if (isInteractive && !isSelected) setIsHovered(false);
  };

  return (
    <g className={styles.salaClicavelContainer}>
      <RoomRect
        x={x}
        y={y}
        width={width}
        height={height}
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        borderWidth={isSelected ? 2 : 1}
        borderRadius={isInfrastructure ? 0 : 2}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        isInteractive={isInteractive}
      />

      <RoomText
        x={x}
        y={y}
        width={width}
        height={height}
        text={displayText}
        fontSize={fontSize}
        textColor={textColor}
        isSelected={isSelected}
      />
    </g>
  );
}
