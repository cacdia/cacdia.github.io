"use client";

import { useState, useEffect, useRef } from "react";
import { Sala, Ocorrencia, OcorrenciaTipo, Professor } from "./types";
import {
  getDetalhesSala,
  getDetalhesSalaApi,
  getOcorrencias,
  registrarOcorrencia,
  getHorariosSala,
} from "./data";
import styles from "./mapa.module.css";

// Tipos
interface DetalheSalaProps {
  codigoSala: string;
  onClose: () => void;
  embedded?: boolean;
  isMobile?: boolean;
}

type TabType = "info" | "ocorrencias" | "form";

interface FormData {
  tipo: OcorrenciaTipo;
  descricao: string;
}

// Importamos os tipos diretamente de data.ts em vez de redefini-los
type DiaSemana = "Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta" | "Sábado";
type Turno = "Manhã" | "Tarde" | "Noite";

// Componentes auxiliares
function CardHeader({
  sala,
  onClose,
}: {
  sala: Sala | null;
  onClose: () => void;
}) {
  return (
    <div className={`card__header ${styles.detalheSalaHeader}`}>
      <div className={styles.detalheSalaHeaderContent}>
        <div>
          <h3 className={styles.detalheSalaTitulo}>
            {sala?.codigo ||
              (sala ? `${sala.bloco} ${sala.nome}` : "Carregando...")}
          </h3>
          {sala?.tipo && (
            <p className={`text--secondary ${styles.detalheSalaSubtitulo}`}>
              {sala.tipo === "professor" ? "Sala de Professores" : sala.tipo}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="button button--sm"
          aria-label="Fechar"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function TabSelector({
  activeTab,
  setActiveTab,
  ocorrencias,
  sala,
}: {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  ocorrencias: Ocorrencia[];
  sala: Sala | null;
}) {
  return (
    <div className={styles.tabBar}>
      <div className={styles.tabContainer}>
        <TabButton
          label="Informações"
          isActive={activeTab === "info"}
          onClick={() => setActiveTab("info")}
        />
        <TabButton
          label={`Ocorrências ${
            ocorrencias.length > 0 ? `(${ocorrencias.length})` : ""
          }`}
          isActive={activeTab === "ocorrencias"}
          onClick={() => setActiveTab("ocorrencias")}
        />
        {sala?.tipo !== "professor" && (
          <TabButton
            label="Registrar"
            isActive={activeTab === "form"}
            onClick={() => setActiveTab("form")}
          />
        )}
      </div>
    </div>
  );
}

function TabButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`button button--sm ${
        isActive ? "button--primary" : "button--secondary"
      } ${styles.tabButton}`}
    >
      {label}
    </button>
  );
}

function InfoTab({ sala }: { sala: Sala }) {
  return (
    <div className={styles.infoTab}>
      <SalaDetails sala={sala} />

      {/* Mostrar grade de horários apenas para salas de aula e laboratórios */}
      {(sala.tipo === "sala-aula" || sala.tipo === "laboratorio") && (
        <HorarioGrid codigoSala={sala.codigo} />
      )}

      {sala.tipo === "professor" &&
      sala.professores &&
      sala.professores.length > 0 ? (
        <ProfessoresDetalhados professores={sala.professores} />
      ) : (
        <>
          {sala.classes && sala.classes.length > 0 && (
            <ClassesList classes={sala.classes} />
          )}

          {sala.professores && sala.professores.length > 0 && (
            <ProfessoresList professores={sala.professores} />
          )}
        </>
      )}
    </div>
  );
}

function ProfessoresDetalhados({ professores }: { professores: Professor[] }) {
  return (
    <div className={styles.infoSection}>
      <h4 className={styles.infoSectionTitle}>Professores nesta sala</h4>
      <div className={styles.professoresList}>
        {professores.map((professor, index) => (
          <div key={index} className={styles.professorCard}>
            <div className={styles.professorHeader}>
              <strong>{professor.nome}</strong>
            </div>
            {professor.departamento && (
              <div className={styles.professorDept}>
                {professor.departamento}
              </div>
            )}
            {professor.sigaa && (
              <div className={styles.professorContact}>
                <a
                  href={professor.sigaa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.professorLink}
                >
                  Perfil SIGAA
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SalaDetails({ sala }: { sala: Sala }) {
  return (
    <div className={styles.infoSection}>
      <h4 className={styles.infoSectionTitle}>Detalhes da Sala</h4>

      {sala.bloco && <DetailItem label="Bloco" value={sala.bloco} />}

      {sala.tipo && (
        <DetailItem
          label="Tipo"
          value={sala.tipo === "professor" ? "Sala de Professores" : sala.tipo}
        />
      )}

      {sala.capacidade && (
        <DetailItem label="Capacidade" value={`${sala.capacidade} pessoas`} />
      )}

      {sala.acessivel !== undefined && (
        <DetailItem
          label="Acessibilidade"
          value={sala.acessivel ? "Sim" : "Não"}
        />
      )}
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <p className={styles.infoDetailItem}>
      <strong>{label}:</strong> {value}
    </p>
  );
}

function ClassesList({
  classes,
}: {
  classes: { id: string; codigo: string; nome: string; turma: string }[];
}) {
  return (
    <div className={styles.infoSection}>
      <h4 className={styles.infoSectionTitle}>Disciplinas/Turmas</h4>
      <ul className={styles.infoList}>
        {classes.map((disciplina) => (
          <li key={disciplina.id} className={styles.infoListItem}>
            <strong>{disciplina.codigo}:</strong> {disciplina.nome} -{" "}
            {disciplina.turma}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProfessoresList({ professores }: { professores: Professor[] }) {
  return (
    <div className={styles.infoSection}>
      <h4 className={styles.infoSectionTitle}>Professores</h4>
      <ul className={styles.infoList}>
        {professores.map((professor, index) => (
          <li key={index} className={styles.infoListItem}>
            <strong>{professor.nome}</strong>
            {professor.departamento && ` - ${professor.departamento}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

function OcorrenciasTab({ ocorrencias }: { ocorrencias: Ocorrencia[] }) {
  if (ocorrencias.length === 0) {
    return (
      <div className="alert alert--info">
        <p style={{ margin: 0, fontSize: "0.875rem" }}>
          Nenhuma ocorrência registrada para esta sala.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.ocorrenciasList}>
      {ocorrencias.map((ocorrencia) => (
        <OcorrenciaCard key={ocorrencia.id} ocorrencia={ocorrencia} />
      ))}
    </div>
  );
}

function OcorrenciaCard({ ocorrencia }: { ocorrencia: Ocorrencia }) {
  return (
    <div className="alert alert--secondary">
      <div className={styles.ocorrenciaHeader}>
        <strong className={styles.ocorrenciaTipo}>{ocorrencia.tipo}</strong>
        <small className="text--secondary">{ocorrencia.dataRegistro}</small>
      </div>
      <p className={styles.ocorrenciaTexto}>{ocorrencia.descricao}</p>
      <span
        className={`badge ${
          ocorrencia.status === "pendente" ? "badge--warning" : "badge--success"
        }`}
      >
        {ocorrencia.status === "pendente" ? "Pendente" : "Resolvido"}
      </span>
    </div>
  );
}

function FormTab({
  formData,
  setFormData,
  handleSubmit,
  submitSuccess,
}: {
  formData: FormData;
  setFormData: (data: FormData) => void;
  handleSubmit: (e: React.FormEvent) => void;
  submitSuccess: boolean;
}) {
  return (
    <div className={styles.formContainer}>
      {submitSuccess && (
        <div className="alert alert--success">
          <p style={{ margin: 0, fontSize: "0.875rem" }}>
            Ocorrência registrada com sucesso! A equipe será notificada.
          </p>
        </div>
      )}

      <div>
        <h4 className={styles.formTitle}>Registrar Nova Ocorrência</h4>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label className={`margin-bottom--xs ${styles.formLabel}`}>
              Tipo de Ocorrência
            </label>
            <select
              value={formData.tipo}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tipo: e.target.value as Ocorrencia["tipo"],
                })
              }
              className={styles.formControl}
            >
              <option value="equipamento">Problema com Equipamento</option>
              <option value="limpeza">Limpeza</option>
              <option value="manutencao">Manutenção</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={`margin-bottom--xs ${styles.formLabel}`}>
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              rows={3}
              required
              className={styles.formTextarea}
              placeholder="Descreva a ocorrência detalhadamente..."
            />
          </div>

          <button
            type="submit"
            className={`button button--block ${
              formData.descricao.trim()
                ? "button--primary"
                : "button--secondary"
            }`}
            disabled={!formData.descricao.trim()}
          >
            Registrar Ocorrência
          </button>
        </form>
      </div>
    </div>
  );
}

function LoadingState({ onClose }: { onClose: () => void }) {
  return (
    <div className="card__header">
      <div className={styles.detalheSalaHeaderContent}>
        <p>Carregando...</p>
        <button onClick={onClose} className="button button--sm">
          ✕
        </button>
      </div>
    </div>
  );
}

function ErrorState({
  error,
  onClose,
}: {
  error: string;
  onClose: () => void;
}) {
  return (
    <>
      <div className="card__header">
        <div className={styles.detalheSalaHeaderContent}>
          <p className="text--danger">{error}</p>
          <button onClick={onClose} className="button button--sm">
            ✕
          </button>
        </div>
      </div>
      <div className="card__footer">
        <button
          onClick={onClose}
          className="button button--secondary button--block"
        >
          Fechar
        </button>
      </div>
    </>
  );
}

// Novo componente de Grade de Horários sem mock
function HorarioGrid({ codigoSala }: { codigoSala: string }) {
  const horarios = getHorariosSala(codigoSala);
  const diasSemana: DiaSemana[] = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
  const turnos: Turno[] = ["Manhã", "Tarde", "Noite"];

  if (horarios.length === 0) {
    return (
      <div className={styles.infoSection}>
        <h4 className={styles.infoSectionTitle}>Grade de Horários</h4>
        <div className="alert alert--info">
          <p style={{ margin: 0, fontSize: "0.875rem" }}>
            Não há horários registrados para esta sala.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.infoSection}>
      <h4 className={styles.infoSectionTitle}>Grade de Horários</h4>
      <div className={styles.horarioGrid}>
        <table className={styles.horarioTable}>
          <thead>
            <tr>
              <th>Horário</th>
              {diasSemana.map((dia) => (
                <th key={dia}>{dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {turnos.map((turno) => (
              <tr key={turno}>
                <td className={styles.horarioTurno}>{turno}</td>
                {diasSemana.map((dia) => {
                  const aulasNoDiaTurno = horarios.filter(
                    (a) => a.dia === dia && a.turno === turno
                  );
                  return (
                    <td key={`${dia}-${turno}`} className={styles.horarioCell}>
                      {aulasNoDiaTurno.length > 0 ? (
                        <div className={styles.horarioAulas}>
                          {aulasNoDiaTurno.map((aula, idx) => (
                            <div key={idx} className={styles.horarioAula}>
                              <div className={styles.horarioInfo}>
                                <strong>{aula.horario}</strong>
                                <div>{aula.disciplina}</div>
                                <div className={styles.horarioProfessor}>
                                  {aula.professor}
                                </div>
                                <div className={styles.horarioTurma}>
                                  Turma: {aula.turma}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className={styles.horarioVazio}>Livre</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Componente principal
export function DetalheSala({
  codigoSala,
  onClose,
  embedded = false,
  isMobile = false,
}: DetalheSalaProps) {
  const detalheSalaRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [formData, setFormData] = useState<FormData>({
    tipo: "equipamento",
    descricao: "",
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [sala, setSala] = useState<Sala | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ocorrencias = getOcorrencias(codigoSala);

  // Efeito para carregar dados da sala
  useEffect(() => {
    const carregarSala = async () => {
      setLoading(true);
      setError(null);

      try {
        let salaEncontrada = getDetalhesSala(codigoSala);

        if (!salaEncontrada) {
          salaEncontrada = await getDetalhesSalaApi(codigoSala);
        }

        setSala(salaEncontrada || null);
      } catch (error) {
        console.error("Erro ao carregar dados da sala:", error);
        setError(
          "Não foi possível carregar os dados da sala. Tente novamente."
        );
      } finally {
        setLoading(false);
      }
    };

    carregarSala();
  }, [codigoSala]);

  // Efeito para focar o componente
  useEffect(() => {
    if (detalheSalaRef.current) {
      const timeoutId = setTimeout(() => {
        detalheSalaRef.current?.focus();

        if (isMobile && !embedded) {
          detalheSalaRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [codigoSala, embedded, isMobile]);

  // Efeito para scroll
  useEffect(() => {
    if (detalheSalaRef.current && !embedded) {
      detalheSalaRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [sala, embedded]);

  // Handler para submissão do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao.trim()) return;

    registrarOcorrencia({
      tipo: formData.tipo,
      descricao: formData.descricao,
      sala: codigoSala,
    });

    setFormData({
      tipo: "equipamento",
      descricao: "",
    });

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setActiveTab("ocorrencias");
    }, 1500);
  };

  // Renderização de estados
  const renderContent = () => {
    if (loading) {
      return <LoadingState onClose={onClose} />;
    }

    if (error) {
      return <ErrorState error={error} onClose={onClose} />;
    }

    if (!sala) {
      return <ErrorState error="Sala não encontrada." onClose={onClose} />;
    }

    return (
      <>
        <CardHeader sala={sala} onClose={onClose} />

        <TabSelector
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          ocorrencias={ocorrencias}
          sala={sala}
        />

        <div
          className={`card__body ${styles.contentContainer}
          ${
            embedded
              ? styles.contentContainerEmbedded
              : isMobile
              ? styles.contentContainerMobile
              : styles.contentContainerExterno
          }`}
        >
          {activeTab === "info" && <InfoTab sala={sala} />}
          {activeTab === "ocorrencias" && (
            <OcorrenciasTab ocorrencias={ocorrencias} />
          )}
          {activeTab === "form" && sala.tipo !== "professor" && (
            <FormTab
              formData={formData}
              setFormData={setFormData}
              handleSubmit={handleSubmit}
              submitSuccess={submitSuccess}
            />
          )}
        </div>
      </>
    );
  };

  // Classe CSS e propriedades ARIA
  const containerClassName = embedded ? "" : "card";
  const containerClassNames = [
    styles.detalheSalaContainer,
    !embedded &&
      (isMobile
        ? styles.detalheSalaContainerMobile
        : styles.detalheSalaContainerExterno),
  ]
    .filter(Boolean)
    .join(" ");

  const ariaLabel = loading
    ? "Carregando detalhes da sala"
    : `Detalhes da sala ${sala?.codigo || sala?.nome || codigoSala}`;

  return (
    <div
      className={`${containerClassName} ${containerClassNames}`}
      ref={detalheSalaRef}
      tabIndex={-1}
      role="dialog"
      aria-label={ariaLabel}
      aria-modal={!embedded}
    >
      {renderContent()}
    </div>
  );
}
