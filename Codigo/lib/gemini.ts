import { GoogleGenerativeAI } from "@google/generative-ai";
import type { BehavioralAnalysis } from "./storage";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyDG0ZlgDkJDWg5VKqM8KIKr1PlGIZLKs44");

export interface BehavioralInsights {
  profile: string; // Perfil baseado no Eneagrama
  profileSummary: string;
  enneagramType: {
    type: number;
    name: string;
    description: string;
  };
  bigFiveDistribution: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  behavioralHighlights: {
    communication: string;
    decision: string;
    leadership: string;
    problemSolving: string;
    adaptability: string;
  };
  suggestions: {
    recommendedPositions: string[];
    standoutTips: string[];
    developmentAreas: string[];
  };
}

export async function generateBehavioralInsights(
  behavioralData: BehavioralAnalysis,
): Promise<BehavioralInsights> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Como especialista em análise comportamental, psicologia organizacional e Eneagrama, analise as respostas abaixo e gere um relatório estruturado em JSON.

DADOS DO CANDIDATO:

=== SEÇÃO 1: ANÁLISE COMPORTAMENTAL ===
Colaboração: ${behavioralData.section1.collaboration}
Resolução de Problemas: ${behavioralData.section1.problemSolving}
Comunicação: ${behavioralData.section1.communication}
Iniciativa: ${behavioralData.section1.initiative}
Adaptação: ${behavioralData.section1.adaptation}
Influência: ${behavioralData.section1.influence}
Aprendizado: ${behavioralData.section1.learning}

=== SEÇÃO 2: EXPECTATIVAS ===
Ambiente de Trabalho: ${behavioralData.section2.workEnvironment.join(", ")}
Valores: ${behavioralData.section2.values.join(", ")}
Objetivos de Carreira: ${behavioralData.section2.careerGoals}

=== SEÇÃO 3: ANÁLISE AVANÇADA ===
Raciocínio Lógico: ${behavioralData.section3.logicalReasoning}
Análise de Dados: ${behavioralData.section3.dataAnalysis}
Big Five - Conscienciosidade: ${behavioralData.section3.bigFive0}/5
Big Five - Extroversão: ${behavioralData.section3.bigFive1}/5
Big Five - Abertura: ${behavioralData.section3.bigFive2}/5
Big Five - Amabilidade: ${behavioralData.section3.bigFive3}/5
Big Five - Estabilidade Emocional: ${behavioralData.section3.bigFive4}/5
Habilidades Interpessoais: ${behavioralData.section3.interpersonalSkills}
Resolução de Conflitos: ${behavioralData.section3.conflictResolution}
Mentalidade de Crescimento: ${behavioralData.section3.growthMindset}
Adaptabilidade: ${behavioralData.section3.adaptability}
Motivação: ${behavioralData.section3.motivation}
Resiliência: ${behavioralData.section3.resilience}
Criatividade: ${behavioralData.section3.creativity}
Inovação: ${behavioralData.section3.innovation}
Ética: ${behavioralData.section3.ethics}
Valores: ${behavioralData.section3.values}

INSTRUÇÕES DE ANÁLISE:
1. Determine o tipo do ENEAGRAMA mais provável (1-9) baseado nos padrões comportamentais
2. Calcule os percentuais dos Big Five baseado nas autoavaliações e respostas contextuais
3. Identifique características comportamentais que se destacam
4. Sugira posições compatíveis com o perfil identificado

GERE UM RELATÓRIO EM JSON com a seguinte estrutura EXATA:

{
  "profile": "Descrição detalhada do perfil ENEAGRAMA (3-4 parágrafos explicando o tipo, motivações e comportamentos)",
  "profileSummary": "Resumo em 2 linhas do perfil comportamental",
  "enneagramType": {
    "type": número de 1 a 9,
    "name": "Nome do tipo (ex: O Perfeccionista, O Prestativo)",
    "description": "Breve descrição do tipo identificado"
  },
  "bigFiveDistribution": {
    "openness": número de 0 a 100,
    "conscientiousness": número de 0 a 100,
    "extraversion": número de 0 a 100,
    "agreeableness": número de 0 a 100,
    "neuroticism": número de 0 a 100
  },
  "behavioralHighlights": {
    "communication": "Descrição da comunicação (ex: clara, lógica e objetiva)",
    "decision": "Estilo de tomada de decisão (ex: baseada em evidências)",
    "leadership": "Estilo de liderança",
    "problemSolving": "Abordagem para resolver problemas",
    "adaptability": "Capacidade de adaptação"
  },
  "suggestions": {
    "recommendedPositions": ["Cargo 1", "Cargo 2", "Cargo 3"],
    "standoutTips": ["Dica 1", "Dica 2", "Dica 3"],
    "developmentAreas": ["Área 1", "Área 2", "Área 3"]
  }
}

IMPORTANTE:
- Retorne APENAS o JSON válido, sem texto adicional
- Base a análise nos 9 tipos do Eneagrama e nos Big Five
- Correlacione as respostas autoavaliativas com os padrões comportamentais
- Seja específico e profissional nas descrições
- Use linguagem positiva mas realista
- As sugestões devem ser práticas e acionáveis
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and parse JSON response
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const insights: BehavioralInsights = JSON.parse(cleanedText);

    return insights;
  } catch (error) {
    console.error("Error generating behavioral insights:", error);

    // Return fallback insights if AI fails
    return {
      profile:
        "Perfil em processamento. A análise detalhada será gerada em breve baseada nas respostas fornecidas.",
      profileSummary:
        "Candidato com potencial para diversas áreas. Análise em processamento.",
      enneagramType: {
        type: 7,
        name: "Em análise",
        description: "Tipo do Eneagrama sendo determinado pela IA",
      },
      bigFiveDistribution: {
        openness: behavioralData.section3.bigFive2 * 20,
        conscientiousness: behavioralData.section3.bigFive0 * 20,
        extraversion: behavioralData.section3.bigFive1 * 20,
        agreeableness: behavioralData.section3.bigFive3 * 20,
        neuroticism: (6 - behavioralData.section3.bigFive4) * 20,
      },
      behavioralHighlights: {
        communication: "Em análise",
        decision: "Em análise",
        leadership: "Em análise",
        problemSolving: "Em análise",
        adaptability: "Em análise",
      },
      suggestions: {
        recommendedPositions: ["Análise em processamento"],
        standoutTips: ["Análise em processamento"],
        developmentAreas: ["Análise em processamento"],
      },
    };
  }
}

export async function processBehavioralAnalysis(
  cpf: string,
  behavioralData: BehavioralAnalysis,
): Promise<boolean> {
  try {
    // Generate insights using AI
    const insights = await generateBehavioralInsights(behavioralData);

    // Import storage functions dynamically to avoid circular imports
    const { getCandidateData, saveCandidateData } = await import("./storage");

    const candidateData = getCandidateData(cpf);
    if (!candidateData) {
      throw new Error("Candidate data not found");
    }

    // Update behavioral analysis with AI insights
    const updatedBehavioralAnalysis = {
      ...behavioralData,
      aiInsights: insights,
      completedAt: new Date().toISOString(),
    };

    // Save updated data
    const success = saveCandidateData({
      ...candidateData,
      behavioralAnalysis: updatedBehavioralAnalysis,
    });

    return success;
  } catch (error) {
    console.error("Error processing behavioral analysis:", error);
    return false;
  }
}
