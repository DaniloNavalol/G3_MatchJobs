"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getCurrentUserCPF,
  updateCandidateBehavioralAnalysis,
  getCandidateData,
  type BehavioralAnalysis,
} from "@/lib/storage";
import { processBehavioralAnalysis } from "@/lib/gemini";

interface FormData {
  section1: Record<string, string>;
  section2: {
    workEnvironment: string[];
    values: string[];
    careerGoals: string;
  };
  section3: Record<string, string | number>;
}

export default function CandidateAnalysisEdit() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    section1: {},
    section2: {
      workEnvironment: [],
      values: [],
      careerGoals: "",
    },
    section3: {},
  });

  const updateSection1 = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      section1: { ...prev.section1, [field]: value },
    }));
  };

  const updateSection2 = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      section2: { ...prev.section2, [field]: value },
    }));
  };

  const updateSection3 = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      section3: { ...prev.section3, [field]: value },
    }));
  };

  const handleWorkEnvironmentChange = (value: string, checked: boolean) => {
    const current = formData.section2.workEnvironment;
    if (checked) {
      updateSection2("workEnvironment", [...current, value]);
    } else {
      updateSection2(
        "workEnvironment",
        current.filter((item) => item !== value),
      );
    }
  };

  const handleValuesChange = (value: string, checked: boolean) => {
    const current = formData.section2.values;
    if (checked && current.length < 3) {
      updateSection2("values", [...current, value]);
    } else if (!checked) {
      updateSection2(
        "values",
        current.filter((item) => item !== value),
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentCPF = getCurrentUserCPF();
    if (!currentCPF) {
      alert(
        "Erro: CPF não encontrado. Por favor, complete seu perfil primeiro.",
      );
      router.push("/dashboard/candidate/profile/edit");
      return;
    }

    // Validate required fields
    const section1Fields = [
      "collaboration",
      "problemSolving",
      "communication",
      "initiative",
      "adaptation",
      "influence",
      "learning",
    ];
    const section1Missing = section1Fields.some(
      (field) => !formData.section1[field],
    );

    if (
      section1Missing ||
      !formData.section2.careerGoals ||
      formData.section2.values.length === 0
    ) {
      alert("Por favor, complete todos os campos obrigatórios.");
      return;
    }

    setIsProcessing(true);

    try {
      const behavioralAnalysis: BehavioralAnalysis = {
        section1: formData.section1,
        section2: formData.section2,
        section3: formData.section3,
      };

      // First save the basic data
      const basicSuccess = updateCandidateBehavioralAnalysis(
        currentCPF,
        behavioralAnalysis,
      );

      if (!basicSuccess) {
        throw new Error("Erro ao salvar dados básicos");
      }

      // Then process with AI to generate insights
      const aiSuccess = await processBehavioralAnalysis(
        currentCPF,
        behavioralAnalysis,
      );

      if (aiSuccess) {
        alert(
          "Análise comportamental processada com sucesso! Os insights foram gerados pela IA.",
        );
        router.push("/dashboard/candidate");
      } else {
        alert(
          "Dados salvos, mas houve erro na geração de insights. Tente novamente.",
        );
        router.push("/dashboard/candidate/analysis");
      }
    } catch (error) {
      console.error("Error processing analysis:", error);
      alert("Erro ao processar análise. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Load existing data if available
  useEffect(() => {
    const currentCPF = getCurrentUserCPF();
    if (currentCPF) {
      const candidateData = getCandidateData(currentCPF);
      if (candidateData?.behavioralAnalysis) {
        setFormData({
          section1: candidateData.behavioralAnalysis.section1,
          section2: candidateData.behavioralAnalysis.section2,
          section3: candidateData.behavioralAnalysis.section3,
        });
      }
    }
  }, []);

  const nextSection = () => {
    if (currentSection < 3) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const Section1 = () => (
    <Card>
      <CardHeader className="bg-blue-600 text-white">
        <CardTitle>1. Análise Comportamental (Soft Skills) - Geral</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <p className="text-gray-600 mb-6">
          Por favor, forneça respostas detalhadas para as perguntas abaixo. Suas
          respostas nos ajudarão a entender melhor suas características
          comportamentais, que são cruciais para o match ideal.
        </p>

        <div className="space-y-6">
          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              Descreva uma situação em que você precisou colaborar intensamente
              com uma equipe para atingir um objetivo desafiador. Qual foi a sua
              contribuição específica e como você lidou com as diferenças de
              opinião?
            </Label>
            <Textarea
              placeholder="Descreva detalhadamente sua experiência..."
              value={formData.section1.collaboration || ""}
              onChange={(e) => updateSection1("collaboration", e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              Diante de um problema complexo e sem precedentes, como você
              estrutura seu pensamento e quais passos você toma para buscar uma
              solução eficaz? Dê um exemplo.
            </Label>
            <Textarea
              placeholder="Descreva seu processo de resolução de problemas..."
              value={formData.section1.problemSolving || ""}
              onChange={(e) => updateSection1("problemSolving", e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              Como você garante que suas ideias sejam compreendidas por
              diferentes públicos (ex: colegas técnicos, clientes não-técnicos)?
              Descreva uma situação em que sua comunicação foi crucial para o
              sucesso de uma tarefa.
            </Label>
            <Textarea
              placeholder="Descreva sua abordagem de comunicação..."
              value={formData.section1.communication || ""}
              onChange={(e) => updateSection1("communication", e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              Conte sobre uma vez em que você identificou uma oportunidade de
              melhoria ou um problema em potencial e agiu para resolvê-lo sem
              que fosse solicitado. Qual foi o resultado?
            </Label>
            <Textarea
              placeholder="Descreva sua iniciativa e os resultados..."
              value={formData.section1.initiative || ""}
              onChange={(e) => updateSection1("initiative", e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              O ambiente de trabalho é dinâmico. Descreva uma situação em que
              você precisou se adaptar rapidamente a uma mudança significativa
              (tecnologia, processo, meta) e como você lidou com isso.
            </Label>
            <Textarea
              placeholder="Descreva sua experiência de adaptação..."
              value={formData.section1.adaptation || ""}
              onChange={(e) => updateSection1("adaptation", e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              Você já precisou influenciar ou motivar outras pessoas (colegas,
              stakeholders) para um determinado curso de ação? Descreva como
              você fez isso e qual foi o impacto.
            </Label>
            <Textarea
              placeholder="Descreva sua experiência de influência/motivação..."
              value={formData.section1.influence || ""}
              onChange={(e) => updateSection1("influence", e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              Quais são as últimas habilidades ou conhecimentos que você buscou
              adquirir por conta própria? Como você se mantém atualizado em sua
              área?
            </Label>
            <Textarea
              placeholder="Descreva seu processo de aprendizado contínuo..."
              value={formData.section1.learning || ""}
              onChange={(e) => updateSection1("learning", e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const Section2 = () => (
    <Card>
      <CardHeader className="bg-green-600 text-white">
        <CardTitle>2. Expectativas e Preferências</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <Label className="text-sm font-semibold text-gray-900 mb-3 block">
            Qual tipo de ambiente de trabalho você prefere? (Selecione todos que
            se aplicam)
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Colaborativo e dinâmico",
              "Independente e dinâmico",
              "Híbrido e dinâmico",
              "Remoto e dinâmico",
              "Estruturado e dinâmico",
              "Flexível e dinâmico",
            ].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`env-${option}`}
                  checked={formData.section2.workEnvironment.includes(option)}
                  onCheckedChange={(checked) =>
                    handleWorkEnvironmentChange(option, checked as boolean)
                  }
                />
                <Label htmlFor={`env-${option}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold text-gray-900 mb-3 block">
            Quais são os 3 principais valores que você busca em uma
            empresa/local de trabalho? (Selecione até 3)
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              "Inovação",
              "Aprendizado",
              "Equilíbrio",
              "Impacto Social",
              "Reconhecimento",
              "Diversidade",
              "Estabilidade",
              "Transparência",
              "Autonomia",
            ].map((value) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={`value-${value}`}
                  checked={formData.section2.values.includes(value)}
                  onCheckedChange={(checked) =>
                    handleValuesChange(value, checked as boolean)
                  }
                  disabled={
                    !formData.section2.values.includes(value) &&
                    formData.section2.values.length >= 3
                  }
                />
                <Label htmlFor={`value-${value}`} className="text-sm">
                  {value}
                </Label>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Selecionados: {formData.section2.values.length}/3
          </p>
        </div>

        <div>
          <Label className="text-sm font-semibold text-gray-900 mb-3 block">
            Qual o seu objetivo de carreira a médio/longo prazo (3 a 5 anos)?
          </Label>
          <Textarea
            placeholder="Descreva seus objetivos de carreira..."
            value={formData.section2.careerGoals}
            onChange={(e) => updateSection2("careerGoals", e.target.value)}
            className="min-h-[100px]"
            required
          />
        </div>
      </CardContent>
    </Card>
  );

  const Section3 = () => (
    <Card>
      <CardHeader className="bg-purple-600 text-white">
        <CardTitle>
          3. Análise de Perfil Comportamental Avançada (Para IA)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <p className="text-gray-600 mb-6">
          Esta seção contém perguntas mais aprofundadas para que nossa IA possa
          construir um perfil comportamental completo e detalhado. Suas
          respostas devem ser o mais honestas e descritivas possível.
        </p>

        <div className="space-y-6">
          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              <strong>
                Raciocínio Lógico e Resolução de Problemas Complexos:
              </strong>{" "}
              Descreva como você abordaria a otimização de um processo de
              trabalho ineficiente que envolve múltiplas equipes e diferentes
              tecnologias. Quais seriam seus primeiros passos e como você
              mediria o sucesso?
            </Label>
            <Textarea
              placeholder="Descreva sua abordagem sistemática..."
              value={formData.section3.logicalReasoning || ""}
              onChange={(e) =>
                updateSection3("logicalReasoning", e.target.value)
              }
              className="min-h-[120px]"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              Você se depara com um conjunto de dados complexos (ex: vendas de
              um produto em diferentes regiões ao longo do tempo) e precisa
              identificar os fatores mais impactantes no declínio das vendas em
              uma região específica. Descreva os passos que você seguiria para
              analisar esses dados, identificar anomalias e gerar insights
              acionáveis.
            </Label>
            <Textarea
              placeholder="Descreva seu processo de análise de dados..."
              value={formData.section3.dataAnalysis || ""}
              onChange={(e) => updateSection3("dataAnalysis", e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-4 block">
              Avalie as afirmações a seguir de 1 (Discordo Totalmente) a 5
              (Concordo Totalmente):
            </Label>
            <div className="space-y-4">
              {[
                "Sou uma pessoa organizada, eficiente e gosto de planejar minhas tarefas.",
                "Sinto-me energizado ao interagir socialmente e sou comunicativo(a) em grupos.",
                "Tenho uma mente aberta, sou curioso(a) e gosto de explorar novas ideias e conceitos.",
                "Sou uma pessoa empática, colaborativa e me preocupo com o bem-estar dos outros.",
                "Geralmente lido bem com o estresse, sou emocionalmente estável e resiliente a adversidades.",
              ].map((statement, index) => (
                <div key={index}>
                  <Label className="text-sm mb-2 block">
                    {index + 1}. {statement}
                  </Label>
                  <Select
                    value={
                      formData.section3[`bigFive${index}`]?.toString() || ""
                    }
                    onValueChange={(value) =>
                      updateSection3(`bigFive${index}`, parseInt(value))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Discordo Totalmente</SelectItem>
                      <SelectItem value="2">2 - Discordo</SelectItem>
                      <SelectItem value="3">3 - Neutro</SelectItem>
                      <SelectItem value="4">4 - Concordo</SelectItem>
                      <SelectItem value="5">5 - Concordo Totalmente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Baseado no modelo "Big Five" de personalidade.
            </p>
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              <strong>
                Habilidades Interpessoais e Inteligência Emocional:
              </strong>{" "}
              Você está em uma reunião de equipe e um colega apresenta uma ideia
              que você sabe, com base em dados concretos, que é inviável e pode
              prejudicar seriamente o projeto. Como você reagiria para expressar
              sua preocupação de forma construtiva e colaborativa, sem
              desmotivar o colega ou criar atritos desnecessários?
            </Label>
            <Textarea
              placeholder="Descreva sua abordagem empática e assertiva..."
              value={formData.section3.interpersonalSkills || ""}
              onChange={(e) =>
                updateSection3("interpersonalSkills", e.target.value)
              }
              className="min-h-[120px]"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              Em uma situação onde há um conflito de prioridades ou opiniões
              fortes entre dois colegas de equipe que afeta o andamento do
              projeto, como você interviria ou o que você faria para ajudar a
              resolver a situação e restabelecer a harmonia, mesmo que não seja
              seu papel direto de liderança?
            </Label>
            <Textarea
              placeholder="Descreva sua capacidade de mediação..."
              value={formData.section3.conflictResolution || ""}
              onChange={(e) =>
                updateSection3("conflictResolution", e.target.value)
              }
              className="min-h-[120px]"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              <strong>
                Capacidade de Adaptação e Mentalidade de Crescimento:
              </strong>{" "}
              Descreva uma situação em que você cometeu um erro significativo no
              trabalho. Como você reagiu a esse erro, quais ações concretas você
              tomou para corrigi-lo e o que aprendeu com ele que o ajudou a
              crescer profissionalmente?
            </Label>
            <Textarea
              placeholder="Descreva sua experiência de aprendizado com falhas..."
              value={formData.section3.growthMindset || ""}
              onChange={(e) => updateSection3("growthMindset", e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              Descreva uma experiência em que as metas, os requisitos ou a
              própria direção de um projeto mudaram drasticamente e de forma
              inesperada no meio do caminho. Como você se adaptou a essa
              mudança, comunicou-se com a equipe e garantiu a continuidade ou
              reorientação do trabalho?
            </Label>
            <Textarea
              placeholder="Descreva sua flexibilidade em cenários de incerteza..."
              value={formData.section3.adaptability || ""}
              onChange={(e) => updateSection3("adaptability", e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              <strong>Motivação e Propósito:</strong> O que te impulsiona a dar
              o seu melhor no trabalho, mesmo em face de dificuldades ou de
              tarefas rotineiras? Dê exemplos de situações em que você sentiu
              forte motivação e qual foi a fonte dela (desafio intelectual,
              reconhecimento, impacto do seu trabalho, aprendizado contínuo,
              remuneração, ambiente colaborativo, etc.).
            </Label>
            <Textarea
              placeholder="Descreva suas motivações intrínsecas e extrínsecas..."
              value={formData.section3.motivation || ""}
              onChange={(e) => updateSection3("motivation", e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              Descreva um desafio profissional recente que você enfrentou. O que
              te motivou a superá-lo e quais estratégias você utilizou para
              manter-se engajado(a) e alcançar o objetivo?
            </Label>
            <Textarea
              placeholder="Descreva sua resiliência e foco sob pressão..."
              value={formData.section3.resilience || ""}
              onChange={(e) => updateSection3("resilience", e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              <strong>Criatividade e Pensamento Divergente:</strong> Imagine que
              você precisa resolver um problema complexo para o qual não há uma
              solução óbvia ou pré-existente no mercado ou na sua empresa. Como
              você abordaria esse desafio para gerar ideias criativas e
              inovadoras? Descreva seu processo de brainstorming ou de busca por
              soluções não convencionais.
            </Label>
            <Textarea
              placeholder="Descreva seu pensamento divergente e abordagem criativa..."
              value={formData.section3.creativity || ""}
              onChange={(e) => updateSection3("creativity", e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              Se você fosse encarregado(a) de criar um novo processo de
              onboarding para novos colaboradores, visando torná-lo mais
              engajador, eficiente e memorável do que os métodos tradicionais,
              quais ideias inovadoras e "fora da caixa" você proporia? Descreva
              pelo menos três abordagens diferentes e o porquê de cada uma.
            </Label>
            <Textarea
              placeholder="Descreva suas ideias inovadoras para onboarding..."
              value={formData.section3.innovation || ""}
              onChange={(e) => updateSection3("innovation", e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              <strong>Valores e Ética Profissional:</strong> Você se depara com
              um dilema ético no trabalho: seguir as regras da empresa
              estritamente pode prejudicar severamente um colega ou o andamento
              de um projeto importante, mas "dobrar" ou ignorar as regras pode
              beneficiá-lo em detrimento da política da empresa. Como você
              agiria nessa situação e qual seria sua justificativa para a
              decisão tomada?
            </Label>
            <Textarea
              placeholder="Descreva seus princípios éticos e tomada de decisão..."
              value={formData.section3.ethics || ""}
              onChange={(e) => updateSection3("ethics", e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              Quais são os seus valores pessoais (ex: integridade, justiça,
              inovação, colaboração, respeito) que você considera inegociáveis
              em um ambiente de trabalho? Como você garante que esses valores
              estejam alinhados com a cultura da empresa em que você atua ou
              busca atuar? Dê exemplos práticos.
            </Label>
            <Textarea
              placeholder="Descreva seus valores inegociáveis e como os alinha..."
              value={formData.section3.values || ""}
              onChange={(e) => updateSection3("values", e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Refazer Análise Comportamental
        </h1>
        <nav className="flex space-x-2 text-sm text-gray-600 mt-2">
          <span>Candidato</span>
          <span>›</span>
          <span>Refazer Análise</span>
        </nav>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentSection >= step
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  currentSection > step ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {currentSection === 1 && <Section1 />}
        {currentSection === 2 && <Section2 />}
        {currentSection === 3 && <Section3 />}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={prevSection}
            disabled={currentSection === 1}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <span className="text-sm text-gray-500">
            Seção {currentSection} de 3
          </span>

          {currentSection < 3 ? (
            <Button
              type="button"
              onClick={nextSection}
              className="flex items-center"
            >
              Próxima
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="lg"
              className="flex items-center px-8"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processando com IA...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Enviar Análise Completa
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
