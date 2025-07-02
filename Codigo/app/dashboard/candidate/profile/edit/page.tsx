"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  getCandidateData,
  updateCandidatePersonalData,
  addCandidateExperience,
  addCandidateEducation,
  addCandidateCourse,
  addCandidateLanguage,
  updateCandidateSkills,
  updateCandidateDocuments,
  getCurrentUserCPF,
  setCurrentUserCPF,
  calculateProfileCompletion,
  formatCPF,
  validateCPF,
  saveCandidateData,
  deleteCandidateExperience,
  deleteCandidateEducation,
  deleteCandidateCourse,
  deleteCandidateLanguage,
  type CandidatePersonalData,
  type CandidateExperience,
  type CandidateEducation,
  type CandidateCourse,
  type CandidateLanguage,
  type CandidateSkills,
  type CandidateDocuments,
} from "@/lib/storage";

export default function CandidateProfileEdit() {
  const [currentTab, setCurrentTab] = useState("info");
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [personalData, setPersonalData] = useState<CandidatePersonalData>({
    cpf: "",
    fullName: "",
    birthDate: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    cep: "",
    about: "",
  });
  const [experiences, setExperiences] = useState<CandidateExperience[]>([]);
  const [education, setEducation] = useState<CandidateEducation[]>([]);
  const [courses, setCourses] = useState<CandidateCourse[]>([]);
  const [languages, setLanguages] = useState<CandidateLanguage[]>([]);
  const [skills, setSkills] = useState<CandidateSkills>({
    technical: [],
    soft: [],
  });
  const [documents, setDocuments] = useState<CandidateDocuments>({});
  const [newSkill, setNewSkill] = useState("");

  // Modal states
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<CandidateExperience | null>(null);
  const [editingEducation, setEditingEducation] =
    useState<CandidateEducation | null>(null);

  // Form states for new items
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
  });
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    completionYear: "",
    description: "",
  });
  const [newCourse, setNewCourse] = useState({
    name: "",
    institution: "",
    hours: 0,
    year: "",
  });
  const [newLanguage, setNewLanguage] = useState({
    name: "",
    level: "",
    proficiency: 0,
    certification: "",
  });
  const [knowledgeSkills, setKnowledgeSkills] = useState<string[]>([]);
  const [newKnowledge, setNewKnowledge] = useState("");

  const tabs = ["info", "experience", "education", "skills"];
  const currentTabIndex = tabs.indexOf(currentTab);

  // Load existing data
  useEffect(() => {
    const currentCPF = getCurrentUserCPF();
    if (currentCPF) {
      const candidateData = getCandidateData(currentCPF);
      if (candidateData) {
        setPersonalData(candidateData.personal);
        setExperiences(candidateData.experiences);
        setEducation(candidateData.education);
        setCourses(candidateData.courses);
        setLanguages(candidateData.languages);
        setSkills(candidateData.skills);
        setDocuments(candidateData.documents);
        setKnowledgeSkills(candidateData.skills.soft || []);
        setProfileCompletion(calculateProfileCompletion(candidateData));
      }
    }
  }, []);

  const updatePersonalField = (
    field: keyof CandidatePersonalData,
    value: string,
  ) => {
    setPersonalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePersonalData = () => {
    if (!validateCPF(personalData.cpf)) {
      alert("CPF inválido");
      return;
    }

    const cleanCPF = personalData.cpf.replace(/\D/g, "");
    const success = updateCandidatePersonalData(cleanCPF, personalData);

    if (success) {
      setCurrentUserCPF(cleanCPF);
      alert("Dados pessoais salvos com sucesso!");

      // Update profile completion
      const updatedData = getCandidateData(cleanCPF);
      if (updatedData) {
        setProfileCompletion(calculateProfileCompletion(updatedData));
      }
    } else {
      alert("Erro ao salvar dados pessoais");
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const updatedSkills = {
        ...skills,
        technical: [...skills.technical, newSkill.trim()],
      };
      setSkills(updatedSkills);
      setNewSkill("");

      const currentCPF = getCurrentUserCPF();
      if (currentCPF) {
        updateCandidateSkills(currentCPF, updatedSkills);
      }
    }
  };

  const handleRemoveSkill = (
    skillToRemove: string,
    type: "technical" | "soft",
  ) => {
    const updatedSkills = {
      ...skills,
      [type]: skills[type].filter((skill) => skill !== skillToRemove),
    };
    setSkills(updatedSkills);

    const currentCPF = getCurrentUserCPF();
    if (currentCPF) {
      updateCandidateSkills(currentCPF, updatedSkills);
    }
  };

  // Experience management
  const handleAddExperience = () => {
    const currentCPF = getCurrentUserCPF();
    if (!currentCPF) return;

    if (editingExperience) {
      // Update existing experience
      const updatedExperiences = experiences.map((exp) =>
        exp.id === editingExperience.id
          ? { ...newExperience, id: editingExperience.id }
          : exp,
      );
      setExperiences(updatedExperiences);

      const candidateData = getCandidateData(currentCPF);
      if (candidateData) {
        saveCandidateData({
          ...candidateData,
          experiences: updatedExperiences,
        });
      }
    } else {
      // Add new experience
      const success = addCandidateExperience(currentCPF, newExperience);
      if (success) {
        const updatedData = getCandidateData(currentCPF);
        if (updatedData) {
          setExperiences(updatedData.experiences);
        }
      }
    }

    // Reset form
    setNewExperience({
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
    });
    setEditingExperience(null);
    setShowExperienceModal(false);
  };

  const handleEditExperience = (experience: CandidateExperience) => {
    setNewExperience({
      title: experience.title,
      company: experience.company,
      startDate: experience.startDate,
      endDate: experience.endDate || "",
      isCurrent: experience.isCurrent,
      description: experience.description,
    });
    setEditingExperience(experience);
    setShowExperienceModal(true);
  };

  const handleDeleteExperience = (experienceId: string) => {
    const currentCPF = getCurrentUserCPF();
    if (!currentCPF) return;

    if (confirm("Tem certeza que deseja remover esta experiência?")) {
      const success = deleteCandidateExperience(currentCPF, experienceId);
      if (success) {
        const updatedData = getCandidateData(currentCPF);
        if (updatedData) {
          setExperiences(updatedData.experiences);
        }
      }
    }
  };

  // Education management
  const handleAddEducation = () => {
    const currentCPF = getCurrentUserCPF();
    if (!currentCPF) return;

    const success = addCandidateEducation(currentCPF, newEducation);
    if (success) {
      const updatedData = getCandidateData(currentCPF);
      if (updatedData) {
        setEducation(updatedData.education);
      }
    }

    setNewEducation({
      degree: "",
      institution: "",
      completionYear: "",
      description: "",
    });
    setShowEducationModal(false);
  };

  const handleDeleteEducation = (educationId: string) => {
    const currentCPF = getCurrentUserCPF();
    if (!currentCPF) return;

    if (confirm("Tem certeza que deseja remover esta formação?")) {
      const success = deleteCandidateEducation(currentCPF, educationId);
      if (success) {
        const updatedData = getCandidateData(currentCPF);
        if (updatedData) {
          setEducation(updatedData.education);
        }
      }
    }
  };

  // Course management
  const handleAddCourse = () => {
    const currentCPF = getCurrentUserCPF();
    if (!currentCPF) return;

    const success = addCandidateCourse(currentCPF, newCourse);
    if (success) {
      const updatedData = getCandidateData(currentCPF);
      if (updatedData) {
        setCourses(updatedData.courses);
      }
    }

    setNewCourse({
      name: "",
      institution: "",
      hours: 0,
      year: "",
    });
    setShowCourseModal(false);
  };

  const handleDeleteCourse = (courseId: string) => {
    const currentCPF = getCurrentUserCPF();
    if (!currentCPF) return;

    if (confirm("Tem certeza que deseja remover este curso?")) {
      const success = deleteCandidateCourse(currentCPF, courseId);
      if (success) {
        const updatedData = getCandidateData(currentCPF);
        if (updatedData) {
          setCourses(updatedData.courses);
        }
      }
    }
  };

  // Language management
  const handleAddLanguage = () => {
    const currentCPF = getCurrentUserCPF();
    if (!currentCPF) return;

    const success = addCandidateLanguage(currentCPF, newLanguage);
    if (success) {
      const updatedData = getCandidateData(currentCPF);
      if (updatedData) {
        setLanguages(updatedData.languages);
      }
    }

    setNewLanguage({
      name: "",
      level: "",
      proficiency: 0,
      certification: "",
    });
    setShowLanguageModal(false);
  };

  const handleDeleteLanguage = (languageId: string) => {
    const currentCPF = getCurrentUserCPF();
    if (!currentCPF) return;

    if (confirm("Tem certeza que deseja remover este idioma?")) {
      const success = deleteCandidateLanguage(currentCPF, languageId);
      if (success) {
        const updatedData = getCandidateData(currentCPF);
        if (updatedData) {
          setLanguages(updatedData.languages);
        }
      }
    }
  };

  // Knowledge skills management
  const handleAddKnowledge = () => {
    if (newKnowledge.trim() && !knowledgeSkills.includes(newKnowledge.trim())) {
      const updatedKnowledge = [...knowledgeSkills, newKnowledge.trim()];
      setKnowledgeSkills(updatedKnowledge);
      setNewKnowledge("");

      const currentCPF = getCurrentUserCPF();
      if (currentCPF) {
        const updatedSkills = {
          ...skills,
          soft: updatedKnowledge, // Using soft skills array for knowledge
        };
        setSkills(updatedSkills);
        updateCandidateSkills(currentCPF, updatedSkills);
      }
    }
  };

  const handleRemoveKnowledge = (knowledge: string) => {
    const updatedKnowledge = knowledgeSkills.filter((k) => k !== knowledge);
    setKnowledgeSkills(updatedKnowledge);

    const currentCPF = getCurrentUserCPF();
    if (currentCPF) {
      const updatedSkills = {
        ...skills,
        soft: updatedKnowledge,
      };
      setSkills(updatedSkills);
      updateCandidateSkills(currentCPF, updatedSkills);
    }
  };

  const handleNext = () => {
    // Save current tab data before moving
    if (currentTab === "info") {
      handleSavePersonalData();
    }

    if (currentTabIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentTabIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentTabIndex > 0) {
      setCurrentTab(tabs[currentTabIndex - 1]);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Editar Perfil do Candidato
        </h1>
        <nav className="flex space-x-2 text-sm text-gray-600 mt-2">
          <span>Candidato</span>
          <span>›</span>
          <span>Editar Perfil</span>
        </nav>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Meu Perfil</CardTitle>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                Completo: {profileCompletion}%
              </span>
              <Progress value={profileCompletion} className="w-32" />
            </div>
          </div>

          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info">Informações Pessoais</TabsTrigger>
              <TabsTrigger value="experience">Experiência</TabsTrigger>
              <TabsTrigger value="education">Formação</TabsTrigger>
              <TabsTrigger value="skills">Habilidades</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs value={currentTab}>
            {/* Personal Information Tab */}
            <TabsContent value="info" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <Image
                      src="/assets/img/sauro.jpg"
                      alt="Profile"
                      width={120}
                      height={120}
                      className="rounded-full"
                    />
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                      <Camera size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Formatos: JPG, PNG (Máx. 1MB)
                  </p>
                  <Button variant="link" className="text-red-600 text-sm">
                    Remover foto
                  </Button>
                </div>

                <div className="md:col-span-3 space-y-4">
                  <h3 className="text-lg font-semibold">Informações Básicas</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Nome Completo *</Label>
                      <Input
                        id="fullName"
                        placeholder="Digite seu nome completo"
                        value={personalData.fullName}
                        onChange={(e) =>
                          updatePersonalField("fullName", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="birthDate">Data de Nascimento *</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={personalData.birthDate}
                        onChange={(e) =>
                          updatePersonalField("birthDate", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        placeholder="000.000.000-00"
                        value={personalData.cpf}
                        onChange={(e) =>
                          updatePersonalField("cpf", formatCPF(e.target.value))
                        }
                        maxLength={14}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gênero</Label>
                      <Select
                        value={personalData.gender}
                        onValueChange={(value) =>
                          updatePersonalField("gender", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="female">Feminino</SelectItem>
                          <SelectItem value="male">Masculino</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                          <SelectItem value="prefer-not-to-say">
                            Prefiro não dizer
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="exemplo@email.com"
                        value={personalData.email}
                        onChange={(e) =>
                          updatePersonalField("email", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        placeholder="(XX) XXXXX-XXXX"
                        value={personalData.phone}
                        onChange={(e) =>
                          updatePersonalField("phone", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      placeholder="Rua, número, complemento"
                      value={personalData.address}
                      onChange={(e) =>
                        updatePersonalField("address", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        placeholder="Cidade"
                        value={personalData.city}
                        onChange={(e) =>
                          updatePersonalField("city", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Select
                        value={personalData.state}
                        onValueChange={(value) =>
                          updatePersonalField("state", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SP">São Paulo</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                          <SelectItem value="MG">Minas Gerais</SelectItem>
                          <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                          <SelectItem value="PR">Paraná</SelectItem>
                          <SelectItem value="SC">Santa Catarina</SelectItem>
                          <SelectItem value="BA">Bahia</SelectItem>
                          <SelectItem value="GO">Goiás</SelectItem>
                          <SelectItem value="ES">Espírito Santo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        placeholder="00000-000"
                        value={personalData.cep}
                        onChange={(e) =>
                          updatePersonalField("cep", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="about">Sobre mim</Label>
                    <Textarea
                      id="about"
                      rows={3}
                      placeholder="Fale um pouco sobre você..."
                      value={personalData.about}
                      onChange={(e) =>
                        updatePersonalField("about", e.target.value)
                      }
                      maxLength={500}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {personalData.about.length}/500 caracteres
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Experience Tab */}
            <TabsContent value="experience" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Experiência Profissional
                </h3>
                <Button onClick={() => setShowExperienceModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Experiência
                </Button>
              </div>

              <div className="space-y-4">
                {experiences.length > 0 ? (
                  experiences.map((experience) => (
                    <Card key={experience.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold">
                              {experience.title}
                            </h4>
                            <p className="text-blue-600">
                              {experience.company}
                            </p>
                            <p className="text-sm text-gray-500">
                              {experience.startDate} -{" "}
                              {experience.isCurrent
                                ? "Presente"
                                : experience.endDate}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              {experience.description}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditExperience(experience)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteExperience(experience.id)
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhuma experiência profissional adicionada ainda.</p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => setShowExperienceModal(true)}
                    >
                      Adicionar primeira experiência
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Education Tab */}
            <TabsContent value="education" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Formação Acadêmica</h3>
                <Button onClick={() => setShowEducationModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Formação
                </Button>
              </div>

              {education.length > 0 ? (
                education.map((edu) => (
                  <Card key={edu.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{edu.degree}</h4>
                          <p className="text-blue-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500">
                            Concluído em {edu.completionYear}
                          </p>
                          {edu.description && (
                            <p className="text-sm text-gray-600 mt-2">
                              {edu.description}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhuma formação acadêmica adicionada ainda.</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => setShowEducationModal(true)}
                  >
                    Adicionar primeira formação
                  </Button>
                </div>
              )}

              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Cursos Complementares
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() => setShowCourseModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Curso
                  </Button>
                </div>

                {courses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Curso</th>
                          <th className="text-left py-2">Instituição</th>
                          <th className="text-left py-2">Carga Horária</th>
                          <th className="text-left py-2">Ano</th>
                          <th className="text-left py-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((course) => (
                          <tr key={course.id} className="border-b">
                            <td className="py-2">{course.name}</td>
                            <td className="py-2">{course.institution}</td>
                            <td className="py-2">{course.hours}h</td>
                            <td className="py-2">{course.year}</td>
                            <td className="py-2">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteCourse(course.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhum curso complementar adicionado ainda.</p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => setShowCourseModal(true)}
                    >
                      Adicionar primeiro curso
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Habilidades</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Adicionar Habilidades</Label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Digite uma habilidade"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleAddSkill()
                          }
                        />
                        <Button
                          type="button"
                          onClick={handleAddSkill}
                          disabled={!newSkill.trim()}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Suas Habilidades</h4>
                      <div className="flex flex-wrap gap-2">
                        {skills.technical.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="flex items-center space-x-2"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveSkill(skill, "technical")
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={12} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Conhecimentos</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Adicionar Conhecimentos</Label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Digite um conhecimento"
                          value={newKnowledge}
                          onChange={(e) => setNewKnowledge(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleAddKnowledge()
                          }
                        />
                        <Button
                          type="button"
                          onClick={handleAddKnowledge}
                          disabled={!newKnowledge.trim()}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Seus Conhecimentos</h4>
                      <div className="flex flex-wrap gap-2">
                        {knowledgeSkills.map((knowledge) => (
                          <Badge
                            key={knowledge}
                            variant="outline"
                            className="flex items-center space-x-2"
                          >
                            <span>{knowledge}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveKnowledge(knowledge)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={12} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Idiomas</h3>
                    <Button
                      variant="outline"
                      onClick={() => setShowLanguageModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Idioma
                    </Button>
                  </div>

                  {languages.length > 0 ? (
                    <div className="space-y-4">
                      {languages.map((language) => (
                        <Card key={language.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold">
                                  {language.name}
                                </h4>
                                <Progress
                                  value={language.proficiency}
                                  className="my-2"
                                />
                                <p className="text-sm text-gray-600">
                                  {language.level}
                                  {language.certification &&
                                    ` - ${language.certification}`}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteLanguage(language.id)
                                  }
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Nenhum idioma adicionado ainda.</p>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => setShowLanguageModal(true)}
                      >
                        Adicionar primeiro idioma
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Documentos</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="resume">Currículo (PDF) *</Label>
                    <Input id="resume" type="file" accept=".pdf" />
                    <p className="text-sm text-gray-500 mt-1">
                      Tamanho máximo: 5MB
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="portfolio">Portfólio (Link)</Label>
                    <Input
                      id="portfolio"
                      type="url"
                      placeholder="https://meuportfolio.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/seu-perfil"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentTabIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            <div className="flex space-x-2">
              <Button variant="outline">Cancelar</Button>
              {currentTabIndex === tabs.length - 1 ? (
                <Link href="/dashboard/candidate">
                  <Button>
                    <Check className="w-4 h-4 mr-2" />
                    Finalizar Cadastro
                  </Button>
                </Link>
              ) : (
                <Button onClick={handleNext}>
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Experience Modal */}
      {showExperienceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingExperience
                ? "Editar Experiência"
                : "Adicionar Experiência"}
            </h3>
            <div className="space-y-4">
              <div>
                <Label>Cargo *</Label>
                <Input
                  value={newExperience.title}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      title: e.target.value,
                    })
                  }
                  placeholder="Ex: Desenvolvedor Front-end"
                />
              </div>
              <div>
                <Label>Empresa *</Label>
                <Input
                  value={newExperience.company}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      company: e.target.value,
                    })
                  }
                  placeholder="Nome da empresa"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Data de Início *</Label>
                  <Input
                    type="date"
                    value={newExperience.startDate}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        startDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Data de Fim</Label>
                  <Input
                    type="date"
                    value={newExperience.endDate}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        endDate: e.target.value,
                      })
                    }
                    disabled={newExperience.isCurrent}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="current"
                  checked={newExperience.isCurrent}
                  onCheckedChange={(checked) =>
                    setNewExperience({
                      ...newExperience,
                      isCurrent: checked as boolean,
                      endDate: checked ? "" : newExperience.endDate,
                    })
                  }
                />
                <Label htmlFor="current">Trabalho atualmente aqui</Label>
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={newExperience.description}
                  onChange={(e) =>
                    setNewExperience({
                      ...newExperience,
                      description: e.target.value,
                    })
                  }
                  placeholder="Descreva suas principais responsabilidades..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowExperienceModal(false);
                  setEditingExperience(null);
                  setNewExperience({
                    title: "",
                    company: "",
                    startDate: "",
                    endDate: "",
                    isCurrent: false,
                    description: "",
                  });
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddExperience}
                disabled={
                  !newExperience.title ||
                  !newExperience.company ||
                  !newExperience.startDate
                }
              >
                {editingExperience ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Education Modal */}
      {showEducationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Adicionar Formação</h3>
            <div className="space-y-4">
              <div>
                <Label>Curso/Graduação *</Label>
                <Input
                  value={newEducation.degree}
                  onChange={(e) =>
                    setNewEducation({ ...newEducation, degree: e.target.value })
                  }
                  placeholder="Ex: Bacharelado em Ciência da Computação"
                />
              </div>
              <div>
                <Label>Instituição *</Label>
                <Input
                  value={newEducation.institution}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      institution: e.target.value,
                    })
                  }
                  placeholder="Nome da universidade/escola"
                />
              </div>
              <div>
                <Label>Ano de Conclusão *</Label>
                <Input
                  value={newEducation.completionYear}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      completionYear: e.target.value,
                    })
                  }
                  placeholder="Ex: 2023"
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={newEducation.description}
                  onChange={(e) =>
                    setNewEducation({
                      ...newEducation,
                      description: e.target.value,
                    })
                  }
                  placeholder="Informações adicionais..."
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEducationModal(false);
                  setNewEducation({
                    degree: "",
                    institution: "",
                    completionYear: "",
                    description: "",
                  });
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddEducation}
                disabled={
                  !newEducation.degree ||
                  !newEducation.institution ||
                  !newEducation.completionYear
                }
              >
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Adicionar Curso</h3>
            <div className="space-y-4">
              <div>
                <Label>Nome do Curso *</Label>
                <Input
                  value={newCourse.name}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, name: e.target.value })
                  }
                  placeholder="Ex: React Avançado"
                />
              </div>
              <div>
                <Label>Instituição *</Label>
                <Input
                  value={newCourse.institution}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, institution: e.target.value })
                  }
                  placeholder="Ex: Alura, Udemy"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Carga Horária *</Label>
                  <Input
                    type="number"
                    value={newCourse.hours}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        hours: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="40"
                  />
                </div>
                <div>
                  <Label>Ano *</Label>
                  <Input
                    value={newCourse.year}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, year: e.target.value })
                    }
                    placeholder="2023"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCourseModal(false);
                  setNewCourse({
                    name: "",
                    institution: "",
                    hours: 0,
                    year: "",
                  });
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddCourse}
                disabled={
                  !newCourse.name || !newCourse.institution || !newCourse.year
                }
              >
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Adicionar Idioma</h3>
            <div className="space-y-4">
              <div>
                <Label>Idioma *</Label>
                <Input
                  value={newLanguage.name}
                  onChange={(e) =>
                    setNewLanguage({ ...newLanguage, name: e.target.value })
                  }
                  placeholder="Ex: Inglês, Espanhol"
                />
              </div>
              <div>
                <Label>Nível *</Label>
                <Select
                  value={newLanguage.level}
                  onValueChange={(value) =>
                    setNewLanguage({ ...newLanguage, level: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Básico">Básico</SelectItem>
                    <SelectItem value="Intermediário">Intermediário</SelectItem>
                    <SelectItem value="Avançado">Avançado</SelectItem>
                    <SelectItem value="Fluente">Fluente</SelectItem>
                    <SelectItem value="Nativo">Nativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Proficiência (0-100) *</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newLanguage.proficiency}
                  onChange={(e) =>
                    setNewLanguage({
                      ...newLanguage,
                      proficiency: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="80"
                />
              </div>
              <div>
                <Label>Certificação</Label>
                <Input
                  value={newLanguage.certification}
                  onChange={(e) =>
                    setNewLanguage({
                      ...newLanguage,
                      certification: e.target.value,
                    })
                  }
                  placeholder="Ex: TOEFL 580, DELE B2"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowLanguageModal(false);
                  setNewLanguage({
                    name: "",
                    level: "",
                    proficiency: 0,
                    certification: "",
                  });
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddLanguage}
                disabled={
                  !newLanguage.name ||
                  !newLanguage.level ||
                  newLanguage.proficiency < 0
                }
              >
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
