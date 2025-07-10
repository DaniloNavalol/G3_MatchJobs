import { GoogleGenerativeAI } from "@google/generative-ai";
import type { BehavioralAnalysis } from "./storage";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

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
    collaboration: string;
    proactivity: string;
    emotionalIntelligence: string;
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
    "adaptability": "Capacidade de adaptação",
    "collaboration": "Capacidade de colaboração e trabalho em equipe",
    "proactivity": "Nível de proatividade e iniciativa",
    "emotionalIntelligence": "Inteligência emocional e gestão de relacionamentos"
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
        collaboration: "Em análise",
        proactivity: "Em análise",
        emotionalIntelligence: "Em análise",
      },
      suggestions: {
        recommendedPositions: ["Análise em processamento"],
        standoutTips: ["Análise em processamento"],
        developmentAreas: ["Análise em processamento"],
      },
    };
  }
}

export interface ResumeParsingResult {
  personalData: {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    about?: string;
  };
  experiences: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    completionYear: string;
    description?: string;
  }>;
  courses: Array<{
    name: string;
    institution: string;
    hours: number;
    year: string;
  }>;
  languages: Array<{
    name: string;
    level: string;
    proficiency: number;
    certification?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries;
      const isTimeoutError = error?.message?.includes("Request timeout");
      const isNetworkError =
        error?.message?.includes("Failed to fetch") ||
        error?.message?.includes("network error") ||
        error?.message?.includes("fetch");
      const isServerError =
        error?.message?.includes("503") ||
        error?.message?.includes("502") ||
        error?.message?.includes("504");
      const isRateLimit = error?.message?.includes("429");

      const isRetryableError = isServerError || isRateLimit || isNetworkError;

      // Don't retry timeouts - they'll likely timeout again
      if (isLastAttempt || (!isRetryableError && !isTimeoutError)) {
        throw error;
      }

      // For timeouts, fail immediately without retry
      if (isTimeoutError) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries exceeded");
}

function parseResumeBasic(resumeText: string): ResumeParsingResult {
  const text = resumeText.toLowerCase();
  const result: ResumeParsingResult = {
    personalData: {},
    experiences: [],
    education: [],
    courses: [],
    languages: [],
    skills: {
      technical: [],
      soft: [],
    },
  };

  // Basic email extraction
  const emailMatch = resumeText.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  if (emailMatch) {
    result.personalData.email = emailMatch[0];
  }

  // Basic phone extraction - improved pattern
  const phoneMatch = resumeText.match(
    /(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}[-.\s]?\d{4}/,
  );
  if (phoneMatch) {
    result.personalData.phone = phoneMatch[0].trim();
  }

  // Try to extract name (usually first line or after common patterns)
  const namePatterns = [
    /nome:\s*([^\n\r]+)/i,
    /name:\s*([^\n\r]+)/i,
    /^([A-ZÁÀÂÃÉÊÍÔÕÚÇ][a-záàâãéêíôõúç]+\s+[A-ZÁÀÂÃÉÊÍÔÕÚÇ][a-záàâãéêíôõúç]+.*?)(?:\n|$)/m,
  ];

  for (const pattern of namePatterns) {
    const nameMatch = resumeText.match(pattern);
    if (nameMatch && nameMatch[1] && nameMatch[1].length > 3) {
      result.personalData.fullName = nameMatch[1].trim();
      break;
    }
  }

  // Enhanced skills extraction
  const techSkills = [
    "javascript",
    "typescript",
    "python",
    "java",
    "react",
    "vue",
    "angular",
    "node",
    "express",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "html",
    "css",
    "sass",
    "git",
    "github",
    "aws",
    "azure",
    "docker",
    "kubernetes",
    "php",
    "laravel",
    "symfony",
    "c#",
    "c++",
    "kotlin",
    "swift",
    "flutter",
    "dart",
  ];
  const foundSkills = techSkills.filter((skill) => text.includes(skill));
  result.skills.technical = foundSkills;

  // Basic soft skills extraction
  const softSkills = [
    "liderança",
    "comunicação",
    "trabalho em equipe",
    "criatividade",
    "organização",
    "proatividade",
    "adaptabilidade",
    "resolução de problemas",
  ];
  const foundSoftSkills = softSkills.filter((skill) => text.includes(skill));
  result.skills.soft = foundSoftSkills;

  return result;
}

export async function parseResumeWithAI(
  resumeText: string,
): Promise<ResumeParsingResult> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Truncate very long resumes to avoid timeout
    const maxLength = 8000; // Limit to ~8000 characters
    const processedText =
      resumeText.length > maxLength
        ? resumeText.substring(0, maxLength) + "...[TRUNCATED]"
        : resumeText;

    const generateWithRetry = () =>
      retryWithBackoff(
        async () => {
          // Add timeout wrapper - increased for resume parsing
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error("Request timeout")), 60000); // 60 second timeout for resume parsing
          });

          const generatePromise = (async () => {
            const result = await model.generateContent(prompt);
            return result.response.text();
          })();

          return Promise.race([generatePromise, timeoutPromise]);
        },
        3,
        2000, // Increased base delay to 2s
      );

    const prompt = `
Você é um especialista em análise de currículos. Analise o texto do currículo abaixo e extraia as informaç��es estruturadas.

TEXTO DO CURRÍCULO:
${processedText}

INSTRUÇÕES:
1. Extraia TODAS as informações possíveis do currículo
2. Para experiências profissionais, identifique cargos, empresas, per��odos e descrições
3. Para formação acadêmica, identifique curso/graduação, instituição e ano de conclusão
4. Para cursos complementares, identifique nome, instituição, carga horária (estime se não especificado) e ano
5. Para idiomas, identifique o idioma, nível (estime baseado no contexto) e proficiência em número de 0-100
6. Para habilidades, separe entre técnicas (tecnologias, ferramentas, linguagens) e soft skills
7. Para dados pessoais, extraia nome, email, telefone, endereço
8. Use o formato de data YYYY-MM-DD quando possível, ou YYYY-MM se só tiver mês/ano, ou YYYY se só tiver ano
9. Para posições atuais, use isCurrent: true e não preencha endDate
10. Se alguma informação não estiver disponível, não invente dados

RETORNE UM JSON com a seguinte estrutura EXATA:

{
  "personalData": {
    "fullName": "Nome completo extraído ou vazio se não encontrado",
    "email": "Email extraído ou vazio se não encontrado",
    "phone": "Telefone extraído ou vazio se não encontrado",
    "address": "Endereço extraído ou vazio se não encontrado",
    "city": "Cidade extraída ou vazia se não encontrada",
    "state": "Estado extraído ou vazio se não encontrado",
    "about": "Resumo profissional/objetivo se encontrado ou vazio"
  },
  "experiences": [
    {
      "title": "Cargo/Posição",
      "company": "Nome da empresa",
      "startDate": "YYYY-MM-DD ou YYYY-MM ou YYYY",
      "endDate": "YYYY-MM-DD ou YYYY-MM ou YYYY ou vazio se atual",
      "isCurrent": true/false,
      "description": "Descrição das responsabilidades e conquistas"
    }
  ],
  "education": [
    {
      "degree": "Nome do curso/graduação",
      "institution": "Nome da instituição",
      "completionYear": "YYYY",
      "description": "Descrição adicional se disponível ou vazio"
    }
  ],
  "courses": [
    {
      "name": "Nome do curso",
      "institution": "Instituição que ofereceu",
      "hours": número_de_horas_estimado,
      "year": "YYYY"
    }
  ],
  "languages": [
    {
      "name": "Nome do idioma",
      "level": "Básico/Intermediário/Avançado/Fluente/Nativo",
      "proficiency": número_de_0_a_100,
      "certification": "Certificação se mencionada ou vazio"
    }
  ],
  "skills": {
    "technical": ["skill1", "skill2", "skill3"],
    "soft": ["soft_skill1", "soft_skill2", "soft_skill3"]
  }
}

IMPORTANTE:
- Retorne APENAS o JSON válido, sem texto adicional
- Não invente informações que não estão no currículo
- Se um campo obrigatório não for encontrado, use string vazia ou array vazio
- Para experiências, sempre inclua pelo menos title e company
- Para educação, sempre inclua pelo menos degree e institution
- Seja preciso na extração, mas se houver ambiguidade, faça a melhor interpretação possível
`;

    const text = await generateWithRetry();

    // Clean and parse JSON response
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const parsedData: ResumeParsingResult = JSON.parse(cleanedText);

    return parsedData;
  } catch (error) {
    console.error("Error parsing resume with AI:", error);

    // Try basic text parsing as fallback
    try {
      return parseResumeBasic(resumeText);
    } catch (fallbackError) {
      console.error("Fallback parsing also failed:", fallbackError);

      // Return empty structure if all parsing fails
      return {
        personalData: {},
        experiences: [],
        education: [],
        courses: [],
        languages: [],
        skills: {
          technical: [],
          soft: [],
        },
      };
    }
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
