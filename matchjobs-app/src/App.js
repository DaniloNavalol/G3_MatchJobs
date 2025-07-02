import React, { useState, useEffect, createContext, useContext } from 'react'; // Removido 'useRef'
import HomePage from './pages/HomePage';
// import JobListingPage from './pages/JobListingPage'; // Removido, não usado nas rotas fornecidas

import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

import { initializeApp } from 'firebase/app';
// Adicionada a importação de getAnalytics
import { getAnalytics } from 'firebase/analytics'; // <-- CORREÇÃO PRINCIPAL DO SEU ERRO

import {
  getAuth,
  signInAnonymously,
  // signInWithCustomToken, // Removido, não usado diretamente aqui
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// Importações específicas do Firestore. As que não são usadas globalmente
// serão movidas para os componentes que as utilizam (ProfileFormPage, DashboardPage).
import { getFirestore } from 'firebase/firestore';

import logo from './Matchjobslogo.png';
// import logoform from './matchjoblogowhite.png'; // Removido, não usado


ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Contexto para o usuário autenticado e status de carregamento
const AuthContext = createContext(null);

// Provedor de Autenticação Firebase
function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInstance, setAuthInstance] = useState(null);
  const [dbInstance, setDbInstance] = useState(null);
  const [analyticsInstance, setAnalyticsInstance] = useState(null); // Adicionado para analytics
  const [userId, setUserId] = useState(null);

  // --- Configuração Firebase ---
  const firebaseConfig = {
    apiKey: "AIzaSyC7wHNv8__834eRZilzTQvc5bnD59x4rxY",
    authDomain: "matchjobs-d13e0.firebaseapp.com",
    databaseURL: "https://matchjobs-d13e0-default-rtdb.firebaseio.com",
    projectId: "matchjobs-d13e0",
    storageBucket: "matchjobs-d13e0.firebasestorage.app",
    messagingSenderId: "826984629218",
    appId: "1:826984629218:web:a94a04763c66a3f9c42fbb",
    measurementId: "G-3LF4NS36QX"
  };

  // --- Fim da Configuração Firebase ---

  useEffect(() => {
    const app = initializeApp(firebaseConfig);

    const auth = getAuth(app);
    const db = getFirestore(app);
    // Inicialize o Analytics se o measurementId estiver configurado
    const analytics = firebaseConfig.measurementId ? getAnalytics(app) : null; // Certifica-se de que não tentará inicializar sem measurementId

    setAuthInstance(auth);
    setDbInstance(db);
    setAnalyticsInstance(analytics); // Salva a instância do analytics

    // Garante persistência local (para manter o mesmo UID anônimo)
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            console.log("Usuário autenticado:", user.uid);
            setCurrentUser(user);
            setUserId(user.uid);
          } else {
            try {
              const anon = await signInAnonymously(auth);
              console.log("Login anônimo:", anon.user.uid);
              setCurrentUser(anon.user);
              setUserId(anon.user.uid);
            } catch (error) {
              console.error("Erro ao fazer login anônimo:", error);
            }
          }
          setLoading(false);
        });

        return unsubscribe;
      })
      .catch((err) => {
        console.error("Erro ao configurar persistência:", err);
        setLoading(false);
      });
  }, [firebaseConfig]); // Adicionado firebaseConfig como dependência para evitar o aviso

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        authInstance,
        dbInstance,
        analyticsInstance, // Disponibiliza a instância do analytics
        userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}


function MessageBox({ message, type, onClose }) {
  if (!message) return null;
  const bgColor = type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700';
  return (
    <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50`}>
      <div className={`relative ${bgColor} border rounded-lg p-6 shadow-xl flex flex-col items-center justify-center space-y-4 max-w-sm w-full`}>
        <p className="text-lg text-center font-semibold">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}

function AuthPage() {
  const { authInstance, loading } = useAuth(); // Removido 'currentUser' e 'userId' pois não são usados diretamente aqui
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-google">
      <path d="M12 10.9v2.8h7.9c-.4 2.1-2.1 3.8-4.9 3.8-2.9 0-5.3-2.4-5.3-5.3s2.4-5.3 5.3-5.3c1.6 0 2.9.7 3.8 1.6l2.1-2.1c-1.3-1.3-3-2.1-5.9-2.1-4.7 0-8.5 3.8-8.5 8.5s3.8 8.5 8.5 8.5c4.8 0 8.5-3.5 8.5-8.5 0-.5-.1-1-.1-1.5H12z"/>
    </svg>
  );
  const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );

  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(authInstance, email, password);
      } else {
        await signInWithEmailAndPassword(authInstance, email, password);
      }

      const uid = authInstance.currentUser.uid;

      // Usar uma instância de fetch que pode ser configurada ou verificada
      const response = await fetch(`http://localhost:8000/get-analysis?userId=${uid}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Perfil encontrado na API:", data);
        navigate('/dashboard');
      } else if (response.status === 404) {
        console.log("Perfil NÃO encontrado na API — novo usuário.");
        navigate('/profile');
      } else {
        throw new Error(`Erro na API: ${response.statusText}`);
      }

      setMessage("Autenticação realizada com sucesso!");
      setMessageType('success');

    } catch (error) {
      console.error("Erro de autenticação:", error);
      setMessage(`Erro: ${error.message}`);
      setMessageType('error');
    }
  };


  const handleGoogleSignIn = async () => {
    setMessage('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(authInstance, provider);

      const uid = result.user.uid;

      const response = await fetch(`http://localhost:8000/get-analysis?userId=${uid}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Perfil encontrado na API:", data);
        navigate('/dashboard');
      } else if (response.status === 404) {
        console.log("Perfil NÃO encontrado na API — novo usuário.");
        navigate('/profile');
      } else {
        throw new Error(`Erro na API: ${response.statusText}`);
      }

      setMessage("Login com Google realizado com sucesso!");
      setMessageType('success');

    } catch (error) {
      console.error("Erro de login com Google:", error);
      setMessage(`Erro: ${error.message}`);
      setMessageType('error');
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-700">Carregando autenticação...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="MatchJobs Logo" className="w-32 h-auto" /> {/* Corrigido src da imagem */}
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">{isRegister ? 'Cadastre-se' : 'Entrar'}</h2>
        <p className="text-center text-gray-600 mb-8">{isRegister ? 'Crie sua conta no MatchJobs' : 'Bem-vindo(a) de volta!'}</p>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <MailIcon />
            <span>{isRegister ? 'Registrar' : 'Fazer Login'}</span>
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-500">OU</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-md flex items-center justify-center space-x-2"
        >
          <GoogleIcon />
          <span>Continuar com Google</span>
        </button>

        <p className="text-center text-gray-600 mt-8">
          {isRegister ? (
            <>Já tem uma conta? <button onClick={() => setIsRegister(false)} className="text-blue-600 hover:underline font-medium">Faça Login</button></>
          ) : (
            <>Não tem uma conta? <button onClick={() => setIsRegister(true)} className="text-blue-600 hover:underline font-medium">Cadastre-se</button></>
          )}
        </p>
      </div>
      <MessageBox message={message} type={messageType} onClose={() => setMessage('')} />
    </div>
  );
}

// Componente do Formulário de Perfil Completo
function ProfileFormPage() {
  // Importações do Firestore específicas para este componente
  const { currentUser, authInstance, userId, dbInstance } = useAuth(); // dbInstance é necessário aqui
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const navigate = useNavigate();

  // NOVO: Importe as funções do Firestore necessárias AQUI
  const { doc, addDoc, setDoc, updateDoc, collection, serverTimestamp } = require('firebase/firestore');

  // Estado para os campos do formulário
  const [formData, setFormData] = useState({
    nomeCompleto: '', email: '', telefone: '', linkedin: '', portfolio: '',
    sumarioProfissional: '', areaAtuacao: '', outraAreaTxt: '', experienciaTotal: '',
    habilidades: [''], // Array para habilidades dinâmicas
    qualificacaoAcademica: '',
    trabalhoEquipe: '', resolucaoProblemas: '', comunicacao: '', proatividade: '',
    adaptabilidade: '', lideranca: '', autodesenvolvimento: '', raciocinioLogico: '',
    problemaNumericoLogico: '',
    bigFive_consciencia: '', bigFive_extroversao: '', bigFive_abertura: '',
    bigFive_amabilidade: '', bigFive_neuroticismo: '',
    inteligenciaEmocional_cenario: '', conflitoInterpessoal: '',
    mentalidadeCrescimento: '', toleranciaAmbiguidade: '',
    motivacao: '', motivacaoDesafio: '', criatividadeProblema: '',
    pensamentoDivergente: '', valoresEtica: '', valoresPessoaisEmpresa: '',
    preferenciasAmbiente: [], valoresEmpresa: [], objetivoCarreira: '',
  });
  const [curriculoFile, setCurriculoFile] = useState(null);
  const [showOutraArea, setShowOutraArea] = useState(false);
  // As variáveis de output da IA no frontend serão agora usadas para exibir o que VEM do backend
  const [outputColaboracao, setOutputColaboracao] = useState('');
  const [outputResolucaoProblemas, setOutputResolucaoProblemas] = useState('');


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => {
        const newArray = checked
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value);
        return { ...prev, [name]: newArray };
      });
    } else if (name.startsWith('habilidades')) {
      const index = parseInt(e.target.dataset.index, 10);
      const newSkills = [...formData.habilidades];
      newSkills[index] = value;
      setFormData(prev => ({ ...prev, habilidades: newSkills }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setCurriculoFile(e.target.files[0]);
  };

  useEffect(() => {
    setShowOutraArea(formData.areaAtuacao === 'Outra');
  }, [formData.areaAtuacao]);

  const addHabilidadeField = () => {
    setFormData(prev => ({
      ...prev,
      habilidades: [...prev.habilidades, '']
    }));
  };

  const removeHabilidadeField = (index) => {
    setFormData(prev => ({
      ...prev,
      habilidades: prev.habilidades.filter((_, i) => i !== index)
    }));
  };

  const handleLogout = async () => {
    try {
      await signOut(authInstance);
      setMessage("Logout realizado com sucesso!");
      setMessageType('success');
      navigate('/');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setMessage(`Erro ao fazer logout: ${error.message}`);
      setMessageType('error');
    }
  };

  // Esta função agora é um placeholder e não será chamada por botões no frontend
  const handleGeminiAnalysis = async (targetId, outputSetter, promptText) => {
    outputSetter('<p class="loading-text">A análise de IA será gerada e salva ao ENVIAR o formulário.</p>');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Enviando perfil e gerando análise de IA...');
    setMessageType('info');

    try {
      const dataToSend = { ...formData };

      let curriculoBase64 = null;
      let curriculoFilename = null;

      if (curriculoFile) {
        const reader = new FileReader();
        reader.readAsDataURL(curriculoFile);

        reader.onloadend = async () => {
          curriculoBase64 = reader.result;
          curriculoFilename = curriculoFile.name;

          await sendFormDataToBackend(dataToSend, curriculoBase64, curriculoFilename);
        };
        reader.onerror = (error) => {
          console.error("Erro ao ler arquivo:", error);
          setMessage('Erro ao ler arquivo do currículo.');
          setMessageType('error');
        };
      } else {
        await sendFormDataToBackend(dataToSend, null, null);
      }
    } catch (error) {
      console.error('Erro geral ao enviar formulário:', error);
      setMessage('Erro ao enviar formulário. Verifique o console.');
      setMessageType('error');
    }
  };

  const sendFormDataToBackend = async (dataToSend, curriculoBase64, curriculoFilename) => {
    try {
      // ATENÇÃO: SUBSTITUA 'http://localhost:8000' PELO ENDEREÇO REAL DO SEU BACKEND FLASK EM PRODUÇÃO
      const backendUrl = 'http://localhost:8000/submit-profile';

      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${await currentUser.getIdToken()}` // Descomente para enviar token de auth do Firebase
        },
        body: JSON.stringify({
          userId: currentUser?.uid,
          formData: dataToSend,
          curriculoBase64: curriculoBase64,
          curriculoFilename: curriculoFilename
        })
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`Perfil salvo com sucesso! ID: ${result.id}`);
        setOutputColaboracao(result.ai_colaboration_analysis || 'Análise de colaboração não disponível.'); // Exibe resultado da IA
        setOutputResolucaoProblemas(result.ai_problem_solving_analysis || 'Análise de resolução de problemas não disponível.'); // Exibe resultado da IA
        setMessageType('success');
        navigate('/dashboard');
        // Após o envio bem-sucedido, você pode limpar o formulário ou redirecionar
        // setFormData(initialFormDataState); // Exemplo para limpar
      } else {
        const errorData = await response.json();
        setMessage(`Erro ao salvar perfil: ${errorData.message || response.statusText}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Erro de rede ao enviar para o backend:', error);
      setMessage('Erro de conexão com o servidor. Verifique se o backend está rodando.');
      setMessageType('error');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-4 flex justify-center items-center">
      {/* CSS incorporado para este componente - Mantido como está no seu código */}
      <style jsx>{`
                body {
                    font-family: 'Inter', sans-serif;
                    line-height: 1.7;
                    margin: 0;
                    padding: 30px 20px;
                    background: linear-gradient(135deg, #e0f2f7 0%, #cce7ed 100%);
                    color: #333;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    box-sizing: border-box;
                }

                .container {
                    max-width: 900px;
                    width: 100%;
                    background-color: #ffffff;
                    padding: 40px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    box-sizing: border-box;
                    position: relative;
                    overflow: hidden;
                }

                .container::before {
                    content: '';
                    position: absolute;
                    top: -50px;
                    left: -50px;
                    width: 200px;
                    height: 200px;
                    background: radial-gradient(circle, #ffe082 0%, transparent 70%);
                    border-radius: 50%;
                    opacity: 0.3;
                    filter: blur(40px);
                    z-index: 0;
                }

                .container::after {
                    content: '';
                    position: absolute;
                    bottom: -70px;
                    right: -70px;
                    width: 250px;
                    height: 250px;
                    background: radial-gradient(circle, #ffab91 0%, transparent 70%);
                    border-radius: 50%;
                    opacity: 0.3;
                    filter: blur(50px);
                    z-index: 0;
                }

                .container > *:not(.container::before):not(.container::after) {
                    position: relative;
                    z-index: 1;
                }

                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    padding-bottom: 25px;
                    border-bottom: 1px solid #e0e0e0;
                }

                .header .logo {
                    max-width: 200px;
                    height: auto;
                    margin-bottom: 20px;
                    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
                }

                h1 {
                    color: #2c3e50;
                    text-align: center;
                    margin-bottom: 12px;
                    font-size: 2.5em;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                }

                .subtitle {
                    font-size: 1.2em;
                    color: #7f8c8d;
                    margin-top: 0;
                    text-align: center;
                    line-height: 1.5;
                }

                p {
                    text-align: center;
                    margin-bottom: 35px;
                    font-size: 1.1em;
                    color: #555;
                }

                fieldset {
                    border: 1px solid #dcdcdc;
                    border-radius: 10px;
                    padding: 30px;
                    margin-bottom: 35px;
                    background-color: #fcfcfc;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }

                legend {
                    font-size: 1.6em;
                    font-weight: 700;
                    color: #34495e;
                    padding: 5px 20px;
                    background-color: #f8f8f8;
                    border-radius: 7px;
                    margin-left: -15px;
                    border: 1px solid #dcdcdc;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }

                label {
                    display: block;
                    margin-bottom: 12px;
                    font-weight: 600;
                    color: #444;
                    font-size: 1.05em;
                }

                input[type="text"],
                input[type="email"],
                input[type="tel"],
                input[type="url"],
                select,
                textarea {
                    width: calc(100% - 28px);
                    padding: 14px;
                    margin-bottom: 22px;
                    border: 1px solid #bdc3c7;
                    border-radius: 8px;
                    font-size: 1em;
                    box-shadow: inset 0 1px 4px rgba(0,0,0,0.08);
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                }

                input[type="text"]:focus,
                input[type="email"]:focus,
                input[type="tel"]:focus,
                input[type="url"]:focus,
                select:focus,
                textarea:focus {
                    border-color: #3498db;
                    box-shadow: 0 0 12px rgba(52, 152, 219, 0.35);
                    outline: none;
                    background-color: #fefefe;
                }

                textarea {
                    resize: vertical;
                    min-height: 100px;
                }

                input[type="file"] {
                    border: 1px solid #bdc3c7;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 22px;
                    background-color: #fcfcfc;
                    width: calc(100% - 28px);
                    cursor: pointer;
                    box-shadow: inset 0 1px 4px rgba(0,0,0,0.08);
                }
                input[type="file"]::-webkit-file-upload-button {
                    background: linear-gradient(90deg, #3498db 0%, #2980b9 100%);
                    color: white;
                    padding: 10px 18px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.95em;
                    margin-right: 15px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 5px rgba(0,123,255,0.2);
                }
                input[type="file"]::-webkit-file-upload-button:hover {
                    background: linear-gradient(90deg, #2980b9 0%, #3498db 100%);
                    box-shadow: 0 4px 8px rgba(0,123,255,0.3);
                }

                input[type="checkbox"] {
                    margin-right: 10px;
                    vertical-align: middle;
                    transform: scale(1.1);
                }

                input[type="checkbox"] + label {
                    display: inline-block;
                    margin-bottom: 12px;
                    font-weight: normal;
                    color: #333;
                    font-size: 1em;
                    cursor: pointer;
                }

                .habilidade-input {
                    width: calc(100% - 180px) !important;
                    display: inline-block;
                    margin-right: 10px;
                    vertical-align: middle;
                }

                #addHabilidade {
                    background: linear-gradient(90deg, #2ecc71 0%, #27ae60 100%);
                    padding: 12px 18px;
                    font-size: 1em;
                    margin-top: 0;
                    vertical-align: middle;
                    border-radius: 6px;
                    border: none;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 5px rgba(46,204,113,0.2);
                }

                #addHabilidade:hover {
                    background: linear-gradient(90deg, #27ae60 0%, #2ecc71 100%);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(46,204,113,0.3);
                }

                .remove-habilidade-button {
                    background: linear-gradient(90deg, #e74c3c 0%, #c0392b 100%) !important;
                    padding: 10px 15px !important;
                    font-size: 0.9em !important;
                    margin-left: 8px !important;
                    margin-top: 0 !important;
                    vertical-align: middle !important;
                    border-radius: 6px !important;
                    border: none !important;
                    color: white !important;
                    cursor: pointer !important;
                    transition: all 0.3s ease !important;
                    box-shadow: 0 2px 5px rgba(231,76,60,0.2);
                }

                .remove-habilidade-button:hover {
                    background: linear-gradient(90deg, #c0392b 0%, #e74c3c 100%) !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(231,76,60,0.3);
                }

                .gemini-analyze-btn {
                    background: linear-gradient(90deg, #f1c40f 0%, #f39c12 100%);
                    color: #fff;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1em;
                    margin-top: 15px;
                    margin-bottom: 10px;
                    display: block; /* Alterado para bloco para melhor responsividade em React */
                    width: 100%; /* Ocupa a largura total */
                    max-width: 300px; /* Limite de largura */
                    margin-left: auto;
                    margin-right: auto;
                    box-shadow: 0 2px 8px rgba(243,156,18,0.2);
                    transition: all 0.3s ease;
                    font-weight: 600;
                }

                .gemini-analyze-btn:hover {
                    background: linear-gradient(90deg, #f39c12 0%, #f1c40f 100%);
                    transform: translateY(-1px) scale(1.01);
                    box-shadow: 0 4px 10px rgba(243,156,18,0.3);
                }

                .ai-output {
                    background-color: #ecf0f1;
                    border: 1px solid #bdc3c7;
                    border-radius: 8px;
                    padding: 15px;
                    margin-top: 10px;
                    margin-bottom: 25px;
                    font-size: 0.95em;
                    color: #2c3e50;
                    min-height: 50px;
                    display: block;
                    overflow-wrap: break-word;
                    word-wrap: break-word;
                }

                .ai-output p {
                    margin: 0;
                    text-align: left;
                    color: #2c3e50;
                }

                .loading-text {
                    color: #2980b9;
                    font-style: italic;
                }

                .error-text {
                    color: #e74c3c;
                    font-weight: bold;
                }

                button[type="submit"] {
                    background: linear-gradient(90deg, #f39c12 0%, #e67e22 100%);
                    color: white;
                    padding: 18px 30px;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 1.3em;
                    margin-top: 40px;
                    display: block;
                    width: 100%;
                    max-width: 350px;
                    margin-left: auto;
                    margin-right: auto;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    box-shadow: 0 5px 15px rgba(243,156,18,0.3);
                }

                button[type="submit"]:hover {
                    background: linear-gradient(90deg, #e67e22 0%, #f39c12 100%);
                    transform: translateY(-3px) scale(1.01);
                    box-shadow: 0 8px 20px rgba(243,156,18,0.4);
                }

                .small-text {
                    font-size: 0.9em;
                    color: #7f8c8d;
                    margin-top: -10px;
                    margin-bottom: 15px;
                    text-align: left;
                    line-height: 1.4;
                }

                #outraArea {
                    margin-top: -10px;
                }

                /* Responsividade básica */
                @media (max-width: 768px) {
                    .container {
                        padding: 25px;
                        margin: 15px;
                    }
                    h1 {
                        font-size: 2em;
                    }
                    .subtitle {
                        font-size: 1.05em;
                    }
                    legend {
                        font-size: 1.3em;
                    }
                    input[type="text"],
                    input[type="email"],
                    input[type="tel"],
                    input[type="url"],
                    select,
                    textarea,
                    input[type="file"] {
                        width: calc(100% - 20px);
                    }
                    .habilidade-input {
                        width: calc(100% - 120px) !important;
                    }
                    #addHabilidade, .remove-habilidade-button {
                        padding: 8px 12px;
                        font-size: 0.9em;
                    }
                    .gemini-analyze-btn {
                        display: block;
                        width: 100%;
                        margin-bottom: 10px;
                    }
                }

                @media (max-width: 480px) {
                    body {
                        padding: 10px;
                    }
                    .container {
                        padding: 20px;
                        border-radius: 10px;
                    }
                    h1 {
                        font-size: 1.8em;
                    }
                    .subtitle {
                        font-size: 1em;
                    }
                    legend {
                        font-size: 1.2em;
                        padding: 5px 15px;
                    }
                    label {
                        font-size: 0.95em;
                    }
                    input[type="text"],
                    input[type="email"],
                    input[type="tel"],
                    input[type="url"],
                    select,
                    textarea,
                    input[type="file"] {
                        padding: 10px;
                        font-size: 0.95em;
                    }
                    button[type="submit"] {
                        padding: 15px 20px;
                        font-size: 1.1em;
                    }
                    .habilidade-input {
                        width: 100% !important;
                        margin-right: 0;
                        margin-bottom: 10px;
                    }
                    #addHabilidade, .remove-habilidade-button {
                        width: 100%;
                        margin-left: 0;
                        margin-right: 0;
                    }
                    .gemini-analyze-btn {
                        padding: 10px 15px;
                        font-size: 0.95em;
                    }
                }
            `}</style>

      <div className="container">
        <div className="header">
          <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
          <h1 className="text-center text-3xl font-bold text-gray-800">Seu Perfil Profissional</h1>
          <p className="text-center text-gray-600">Preencha seus dados para encontrarmos as melhores vagas para você!</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-md"
            >
              Sair
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <fieldset className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
            <legend className="text-xl font-semibold text-blue-700 mb-4">1. Dados Cadastrais Básicos</legend>
            <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo:</label>
            <input type="text" id="nomeCompleto" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required />

            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail Principal:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required />

            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone para Contato (com DDD):</label>
            <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />

            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">Link para seu perfil no LinkedIn (opcional):</label>
            <input type="url" id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />

            <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700 mb-1">Link para seu Portfólio ou GitHub (opcional, se relevante):</label>
            <input type="url" id="portfolio" name="portfolio" value={formData.portfolio} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
          </fieldset>

          <fieldset className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
            <legend className="text-xl font-semibold text-blue-700 mb-4">2. Experiência e Habilidades Técnicas (Hard Skills)</legend>

            <label htmlFor="curriculo" className="block text-sm font-medium text-gray-700 mb-1">Faça upload do seu currículo (PDF ou DOC/DOCX):</label>
            <input type="file" id="curriculo" name="curriculo" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded-md" />
            <p className="text-xs text-gray-500 mb-4">O upload do currículo é opcional, mas ajuda a complementar seu perfil.</p>

            <label htmlFor="sumarioProfissional" className="block text-sm font-medium text-gray-700 mb-1">Sumário da sua Experiência Profissional (Descreva sua trajetória, principais realizações e áreas de interesse):</label>
            <textarea id="sumarioProfissional" name="sumarioProfissional" rows="7" placeholder="Ex: Desenvolvedor Full Stack com 5 anos de experiência, especialista em Python e React, com foco em soluções de e-commerce e integrações de API complexas..." value={formData.sumarioProfissional} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md"></textarea>
            <p className="text-xs text-gray-500 mb-4">Este campo é crucial para a IA entender sua história e objetivos profissionais de forma holística.</p>

            <label htmlFor="areaAtuacao" className="block text-sm font-medium text-gray-700 mb-1">Qual a sua principal área de atuação profissional?</label>
            <select id="areaAtuacao" name="areaAtuacao" value={formData.areaAtuacao} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required>
              <option value="">Selecione...</option>
              <option value="Engenharia de Software">Engenharia/Desenvolvimento de Software</option>
              <option value="Analise de Dados">Análise de Dados/Cientista de Dados</option>
              <option value="Design">Design (UX/UI, Gráfico, Produto)</option>
              <option value="Marketing Digital">Marketing Digital</option>
              <option value="Gestao de Projetos">Gestão de Projetos</option>
              <option value="Recursos Humanos">Recursos Humanos</option>
              <option value="Financas">Finanças</option>
              <option value="Saude">Saúde</option>
              <option value="Educacao">Educacao</option>
              <option value="Vendas">Vendas</option>
              <option value="Administracao">Administracao</option>
              <option value="Atendimento ao Cliente">Atendimento ao Cliente</option>
              <option value="Manutencao">Manutencao</option>
              <option value="Logistica">Logistica</option>
              <option value="Outra">Outra</option>
            </select>

            {showOutraArea && (
              <div className="mt-4">
                <label htmlFor="outraAreaTxt" className="block text-sm font-medium text-gray-700 mb-1">Especifique sua área:</label>
                <input type="text" id="outraAreaTxt" name="outraAreaTxt" value={formData.outraAreaTxt} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required={showOutraArea} />
              </div>
            )}

            <label htmlFor="experienciaTotal" className="block text-sm font-medium text-gray-700 mb-1">Qual sua experiência profissional total na área escolhida?</label>
            <select id="experienciaTotal" name="experienciaTotal" value={formData.experienciaTotal} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required>
              <option value="">Selecione...</option>
              <option value="Menos de 1 ano">Menos de 1 ano</option>
              <option value="1 a 3 anos">1 a 3 anos</option>
              <option value="3 a 5 anos">3 a 5 anos</option>
              <option value="Mais de 5 anos">Mais de 5 anos</option>
            </select>

            <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">Habilidades Técnicas (Hard Skills):</h3>
            <p className="text-xs text-gray-500 mb-4">Liste as principais linguagens, ferramentas ou tecnologias que você domina. Digite para adicionar e use a sugestão ou crie uma nova. (Ex: Python, Java, SQL, Figma)</p>
            <div id="habilidadesContainer" className="space-y-3">
              {formData.habilidades.map((habilidade, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    list="sugestoesHabilidades"
                    name="habilidades[]"
                    value={habilidade}
                    onChange={handleInputChange}
                    data-index={index}
                    placeholder="Digite uma habilidade"
                    className="habilidade-input flex-grow p-2 border border-gray-300 rounded-md"
                    required={index === 0 && formData.habilidades[0].trim() === '' ? true : false} // Only first field is required unless filled
                  />
                  <datalist id="sugestoesHabilidades">
                    <option value="Python" /><option value="Java" /><option value="JavaScript" /><option value="C++" /><option value="C#" /><option value="PHP" /><option value="Ruby" /><option value="Swift" /><option value="Kotlin" /><option value="Go" /><option value="SQL" /><option value="NoSQL" /><option value="Git" /><option value="Docker" /><option value="Kubernetes" /><option value="AWS" /><option value="Azure" /><option value="Google Cloud Platform" /><option value="TensorFlow" /><option value="PyTorch" /><option value="Scikit-learn" /><option value="NLP" /><option value="Machine Learning" /><option value="Deep Learning" /><option value="Data Analysis" /><option value="Big Data" /><option value="Business Intelligence" /><option value="Power BI" /><option value="Tableau" /><option value="Excel Avançado" /><option value="UI/UX Design" /><option value="Figma" /><option value="Adobe XD" /><option value="Photoshop" /><option value="Illustrator" /><option value="Blender" /><option value="Marketing Digital" /><option value="SEO" /><option value="SEM" /><option value="Marketing de Conteúdo" /><option value="Mídias Sociais" /><option value="Google Analytics" /><option value="Gestão de Projetos" /><option value="Scrum" /><option value="Kanban" /><option value="Metodologias Ágeis" /><option value="SAP" /><option value="Salesforce" /><option value="CRM" /><option value="ERP" /><option value="Liderança" /><option value="Comunicação Empresarial" /><option value="Negociação" /><option value="Atendimento ao Cliente" /><option value="Vendas Consultivas" /><option value="Recrutamento e Seleção" /><option value="Folha de Pagamento" /><option value="Contabilidade" /><option value="Análise Financeira" /><option value="Gestão de Estoque" /><option value="Logística Internacional" />
                  </datalist>
                  {formData.habilidades.length > 1 && ( // Only show remove button if there's more than one field
                    <button type="button" onClick={() => removeHabilidadeField(index)} className="ml-2 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors text-sm">Remover</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addHabilidadeField} className="ml-auto bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 transition-colors text-sm mt-2">Adicionar +</button>

            </div>

            <label htmlFor="qualificacaoAcademica" className="block text-sm font-medium text-gray-700 mb-1 mt-6">Qual a sua qualificação acadêmica mais alta?</label>
            <select id="qualificacaoAcademica" name="qualificacaoAcademica" value={formData.qualificacaoAcademica} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required>
              <option value="">Selecione...</option>
              <option value="Ensino Médio Completo">Ensino Médio Completo</option>
              <option value="Ensino Técnico Completo">Ensino Técnico Completo</option>
              <option value="Ensino Superior Incompleto">Ensino Superior Incompleto</option>
              <option value="Ensino Superior Completo">Ensino Superior Completo (Graduação)</option>
              <option value="Pos-Graduacao">Pós-Graduação (Especialização/MBA)</option>
              <option value="Mestrado">Mestrado</option>
              <option value="Doutorado">Doutorado</option>
            </select>
          </fieldset>

          <fieldset className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
            <legend className="text-xl font-semibold text-blue-700 mb-4">3. Análise Comportamental (Soft Skills) - Geral</legend>
            <p className="text-xs text-gray-500 mb-4">Por favor, forneça respostas detalhadas para as perguntas abaixo. Suas respostas nos ajudarão a entender melhor suas características comportamentais, que são cruciais para o match ideal.</p>

            <label htmlFor="trabalhoEquipe" className="block text-sm font-medium text-gray-700 mb-1">Descreva uma situação em que você precisou colaborar intensamente com uma equipe para atingir um objetivo desafiador. Qual foi a sua contribuição específica e como você lidou com as diferenças de opinião?</label>
            <textarea id="trabalhoEquipe" name="trabalhoEquipe" rows="5" value={formData.trabalhoEquipe} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>
            <div id="outputColaboracao" className="ai-output" dangerouslySetInnerHTML={{ __html: outputColaboracao }}></div>

            <label htmlFor="resolucaoProblemas" className="block text-sm font-medium text-gray-700 mb-1">Diante de um problema complexo e sem precedentes, como você estrutura seu pensamento e quais passos você toma para buscar uma solução eficaz? Dê um exemplo.</label>
            <textarea id="resolucaoProblemas" name="resolucaoProblemas" rows="5" value={formData.resolucaoProblemas} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>
            <div id="outputResolucaoProblemas" className="ai-output" dangerouslySetInnerHTML={{ __html: outputResolucaoProblemas }}></div>

            <label htmlFor="comunicacao" className="block text-sm font-medium text-gray-700 mb-1">Como você garante que suas ideias sejam compreendidas por diferentes públicos (ex: colegas técnicos, clientes não-técnicos)? Descreva uma situação em que sua comunicação foi crucial para o sucesso de uma tarefa.</label>
            <textarea id="comunicacao" name="comunicacao" rows="5" value={formData.comunicacao} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>

            <label htmlFor="proatividade" className="block text-sm font-medium text-gray-700 mb-1">Conte sobre uma vez em que você identificou uma oportunidade de melhoria ou um problema em potencial e agiu para resolvê-lo sem que fosse solicitado. Qual foi o resultado?</label>
            <textarea id="proatividade" name="proatividade" rows="5" value={formData.proatividade} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>

            <label htmlFor="adaptabilidade" className="block text-sm font-medium text-gray-700 mb-1">O ambiente de trabalho é dinâmico. Descreva uma situação em que você precisou se adaptar rapidamente a uma mudança significativa (tecnologia, processo, meta) e como você lidou com isso.</label>
            <textarea id="adaptabilidade" name="adaptabilidade" rows="5" value={formData.adaptabilidade} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>

            <label htmlFor="lideranca" className="block text-sm font-medium text-gray-700 mb-1">Você já precisou influenciar ou motivar outras pessoas (colegas, stakeholders) para um determinado curso de ação? Descreva como você fez isso e qual foi o impacto.</label>
            <textarea id="lideranca" name="lideranca" rows="5" value={formData.lideranca} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md"></textarea>

            <label htmlFor="autodesenvolvimento" className="block text-sm font-medium text-gray-700 mb-1">Quais são as últimas habilidades ou conhecimentos que você buscou adquirir por conta própria? Como você se mantém atualizado em sua área?</label>
            <textarea id="autodesenvolvimento" name="autodesenvolvimento" rows="5" value={formData.autodesenvolvimento} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>
          </fieldset>

          <fieldset className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
            <legend className="text-xl font-semibold text-blue-700 mb-4">4. Expectativas e Preferências</legend>
            <label className="block text-sm font-medium text-gray-700 mb-2">Qual tipo de ambiente de trabalho você prefere? (Selecione todos que se aplicam)</label>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
              {['Colaborativo', 'Independente', 'Híbrido', 'Remoto', 'Estruturado', 'Flexivel'].map(pref => (
                <div key={pref} className="flex items-center">
                  <input type="checkbox" id={`pref_${pref.toLowerCase()}`} name="preferenciasAmbiente" value={pref} checked={formData.preferenciasAmbiente.includes(pref)} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <label htmlFor={`pref_${pref.toLowerCase()}`} className="ml-2 text-sm text-gray-700">{pref} e dinâmico</label>
                </div>
              ))}
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">Quais são os 3 principais valores que você busca em uma empresa/local de trabalho? (Selecione até 3)</label>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
              {['Inovacao', 'Aprendizado', 'Equilibrio', 'Impacto Social', 'Reconhecimento', 'Diversidade', 'Estabilidade', 'Transparencia', 'Autonomia'].map(val => (
                <div key={val} className="flex items-center">
                  <input type="checkbox" id={`valor_${val.toLowerCase()}`} name="valoresEmpresa" value={val} checked={formData.valoresEmpresa.includes(val)} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <label htmlFor={`valor_${val.toLowerCase()}`} className="ml-2 text-sm text-gray-700">{val.replace(/([A-Z])/g, ' $1').trim()}</label>
                </div>
              ))}
            </div>

            <label htmlFor="objetivoCarreira" className="block text-sm font-medium text-gray-700 mb-1">Qual o seu objetivo de carreira a médio/longo prazo (3 a 5 anos)?</label>
            <textarea id="objetivoCarreira" name="objetivoCarreira" rows="5" value={formData.objetivoCarreira} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>
          </fieldset>

          <fieldset className="p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
            <legend className="text-xl font-semibold text-blue-700 mb-4">5. Análise de Perfil Comportamental Avançada (Para IA)</legend>
            <p className="text-xs text-gray-500 mb-4">Esta seção contém perguntas mais aprofundadas para que nossa IA possa construir um perfil comportamental completo e detalhado. Suas respostas devem ser o mais honestas e descritivas possível.</p>

            {/* 5.1 Avaliação de Inteligência (QI & Raciocínio Lógico) */}
            <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">Raciocínio Lógico e Resolução de Problemas Complexos:</h3>
            <label htmlFor="raciocinioLogico" className="block text-sm font-medium text-gray-700 mb-1">Descreva como você abordaria a otimização de um processo de trabalho ineficiente que envolve múltiplas equipes e diferentes tecnologias. Quais seriam seus primeiros passos e como você mediria o sucesso?</label>
            <textarea id="raciocinioLogico" name="raciocinioLogico" rows="6" value={formData.raciocinioLogico} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>
            <p className="text-xs text-gray-500 mb-4">Avalia a capacidade de estruturar o pensamento e abordar problemas complexos de forma lógica e sistemática.</p>

            <label htmlFor="problemaNumericoLogico" className="block text-sm font-medium text-gray-700 mb-1">Você se depara com um conjunto de dados complexos (ex: vendas de um produto em diferentes regiões ao longo do tempo) e precisa identificar os fatores mais impactantes no declínio das vendas em uma região específica. Descreva os passos que você seguiria para analisar esses dados, identificar anomalias e gerar insights acionáveis.</label>
            <textarea id="problemaNumericoLogico" name="problemaNumericoLogico" rows="6" value={formData.problemaNumericoLogico} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>
            <p className="text-xs text-gray-500 mb-4">Avalia o raciocínio analítico e a capacidade de extrair informações de dados.</p>

            {/* 5.2 Traços Psicológicos e de Temperamento (Modelo Likert adaptado) */}
            <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">Avalie as afirmações a seguir de 1 (Discordo Totalmente) a 5 (Concordo Totalmente):</h3>
            <label htmlFor="bigFive_consciencia" className="block text-sm font-medium text-gray-700 mb-1">1. Sou uma pessoa organizada, eficiente e gosto de planejar minhas tarefas.</label>
            <select id="bigFive_consciencia" name="bigFive_consciencia" value={formData.bigFive_consciencia} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required>
              <option value="">Selecione...</option>
              <option value="1">1 - Discordo Totalmente</option>
              <option value="2">2 - Discordo</option>
              <option value="3">3 - Neutro</option>
              <option value="4">4 - Concordo</option>
              <option value="5">5 - Concordo Totalmente</option>
            </select>

            <label htmlFor="bigFive_extroversao" className="block text-sm font-medium text-gray-700 mb-1">2. Sinto-me energizado ao interagir socialmente e sou comunicativo(a) em grupos.</label>
            <select id="bigFive_extroversao" name="bigFive_extroversao" value={formData.bigFive_extroversao} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required>
              <option value="">Selecione...</option>
              <option value="1">1 - Discordo Totalmente</option>
              <option value="2">2 - Discordo</option>
              <option value="3">3 - Neutro</option>
              <option value="4">4 - Concordo</option>
              <option value="5">5 - Concordo Totalmente</option>
            </select>

            <label htmlFor="bigFive_abertura" className="block text-sm font-medium text-gray-700 mb-1">3. Tenho uma mente aberta, sou curioso(a) e gosto de explorar novas ideias e conceitos.</label>
            <select id="bigFive_abertura" name="bigFive_abertura" value={formData.bigFive_abertura} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required>
              <option value="">Selecione...</option>
              <option value="1">1 - Discordo Totalmente</option>
              <option value="2">2 - Discordo</option>
              <option value="3">3 - Neutro</option>
              <option value="4">4 - Concordo</option>
              <option value="5">5 - Concordo Totalmente</option>
            </select>

            <label htmlFor="bigFive_amabilidade" className="block text-sm font-medium text-gray-700 mb-1">4. Sou uma pessoa empática, colaborativa e me preocupo com o bem-estar dos outros.</label>
            <select id="bigFive_amabilidade" name="bigFive_amabilidade" value={formData.bigFive_amabilidade} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required>
              <option value="">Selecione...</option>
              <option value="1">1 - Discordo Totalmente</option>
              <option value="2">2 - Discordo</option>
              <option value="3">3 - Neutro</option>
              <option value="4">4 - Concordo</option>
              <option value="5">5 - Concordo Totalmente</option>
            </select>

            <label htmlFor="bigFive_neuroticismo" className="block text-sm font-medium text-gray-700 mb-1">5. Geralmente lido bem com o estresse, sou emocionalmente estável e resiliente a adversidades.</label>
            <select id="bigFive_neuroticismo" name="bigFive_neuroticismo" value={formData.bigFive_neuroticismo} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required>
              <option value="">Selecione...</option>
              <option value="1">1 - Discordo Totalmente</option>
              <option value="2">2 - Discordo</option>
              <option value="3">3 - Neutro</option>
              <option value="4">4 - Concordo</option>
              <option value="5">5 - Concordo Totalmente</option>
            </select>
            <p className="text-xs text-gray-500 mb-4">Baseado no modelo "Big Five" de personalidade.</p>


            {/* 5.3 Habilidades Interpessoais e Inteligência Emocional (SJT adaptado) */}
            <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">Habilidades Interpessoais e Inteligência Emocional:</h3>
            <label htmlFor="inteligenciaEmocional_cenario" className="block text-sm font-medium text-gray-700 mb-1">Você está em uma reunião de equipe e um colega apresenta uma ideia que você sabe, com base em dados concretos, que é inviável e pode prejudicar seriamente o projeto. Como você reagiria para expressar sua preocupação de forma construtiva e colaborativa, sem desmotivar o colega ou criar atritos desnecessários?</label>
            <textarea id="inteligenciaEmocional_cenario" name="inteligenciaEmocional_cenario" rows="6" value={formData.inteligenciaEmocional_cenario} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>
            <p className="text-xs text-gray-500 mb-4">Avalia empatia, assertividade e comunicação em situações delicadas.</p>

            <label htmlFor="conflitoInterpessoal" className="block text-sm font-medium text-gray-700 mb-1">Em uma situação onde há um conflito de prioridades ou opiniões fortes entre dois colegas de equipe que afeta o andamento do projeto, como você interviria ou o que você faria para ajudar a resolver a situação e restabelecer a harmonia, mesmo que não seja seu papel direto de liderança?</label>
            <textarea id="conflitoInterpessoal" name="conflitoInterpessoal" rows="6" value={formData.conflitoInterpessoal} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>
            <p className="text-xs text-gray-500 mb-4">Avalia a capacidade de mediação e resolução de conflitos.</p>


            {/* 5.4 Capacidade de Adaptação e Mentalidade de Crescimento */}
            <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">Capacidade de Adaptação e Mentalidade de Crescimento:</h3>
            <label htmlFor="mentalidadeCrescimento" className="block text-sm font-medium text-gray-700 mb-1">Descreva uma situação em que você cometeu um erro significativo no trabalho. Como você reagiu a esse erro, quais ações concretas você tomou para corrigi-lo e o que aprendeu com ele que o ajudou a crescer profissionalmente?</label>
            <textarea id="mentalidadeCrescimento" name="mentalidadeCrescimento" rows="6" value={formData.mentalidadeCrescimento} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>
            <p className="text-xs text-gray-500 mb-4">Avalia a capacidade de aprendizado com falhas e resiliência, demonstrando uma mentalidade de crescimento.</p>

            <label htmlFor="toleranciaAmbiguidade" className="block text-sm font-medium text-gray-700 mb-1">Descreva uma experiência em que as metas, os requisitos ou a própria direção de um projeto mudaram drasticamente e de forma inesperada no meio do caminho. Como você se adaptou a essa mudança, comunicou-se com a equipe e garantiu a continuidade ou reorientação do trabalho?</label>
            <textarea id="toleranciaAmbiguidade" name="toleranciaAmbiguidade" rows="6" value={formData.toleranciaAmbiguidade} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>
            <p className="text-xs text-gray-500 mb-4">Avalia a tolerância à ambiguidade e a flexibilidade em cenários de incerteza.</p>


            {/* 5.5 Motivação Intrínseca vs Extrínseca */}
            <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">Motivação e Propósito:</h3>
            <label htmlFor="motivacao" className="block text-sm font-medium text-gray-700 mb-1">O que te impulsiona a dar o seu melhor no trabalho, mesmo em face de dificuldades ou de tarefas rotineiras? Dê exemplos de situações em que você sentiu forte motivação e qual foi a fonte dela (desafio intelectual, reconhecimento, impacto do seu trabalho, aprendizado contínuo, remuneração, ambiente colaborativo, etc.).</label>
            <textarea id="motivacao" name="motivacao" rows="6" value={formData.motivacao} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>
            <p className="text-xs text-gray-500 mb-4">Ajuda a identificar o principal motor da sua performance, diferenciando motivações intrínsecas e extrínsecas.</p>

            <label htmlFor="motivacaoDesafio" className="block text-sm font-medium text-gray-700 mb-1">Descreva um desafio profissional recente que você enfrentou. O que te motivou a superá-lo e quais estratégias você utilizou para manter-se engajado(a) e alcançar o objetivo?</label>
            <textarea id="motivacaoDesafio" name="motivacaoDesafio" rows="6" value={formData.motivacaoDesafio} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>
            <p className="text-xs text-gray-500 mb-4">Revela a resiliência e a capacidade de manter o foco sob pressão.</p>


            {/* 5.6 Criatividade e Solução de Problemas */}
            <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">Criatividade e Pensamento Divergente:</h3>
            <label htmlFor="criatividadeProblema" className="block text-sm font-medium text-gray-700 mb-1">Imagine que você precisa resolver um problema complexo para o qual não há uma solução óbvia ou pré-existente no mercado ou na sua empresa. Como você abordaria esse desafio para gerar ideias criativas e inovadoras? Descreva seu processo de brainstorming ou de busca por soluções não convencionais.</label>
            <textarea id="criatividadeProblema" name="criatividadeProblema" rows="6" value={formData.criatividadeProblema} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>
            <p className="text-xs text-gray-500 mb-4">Avalia o pensamento divergente e a abordagem criativa na resolução de problemas.</p>

            <label htmlFor="pensamentoDivergente" className="block text-sm font-medium text-gray-700 mb-1">Se você fosse encarregado(a) de criar um novo processo de onboarding para novos colaboradores, visando torná-lo mais engajador, eficiente e memorável do que os métodos tradicionais, quais ideias inovadoras e "fora da caixa" você proporia? Descreva pelo menos três abordagens diferentes e o porquê de cada uma.</label>
            <textarea id="pensamentoDivergente" name="pensamentoDivergente" rows="6" value={formData.pensamentoDivergente} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>
            <p className="text-xs text-gray-500 mb-4">Permite avaliar a originalidade, fluência e flexibilidade no pensamento criativo.</p>


            {/* 5.7 Valores e Ética */}
            <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-3">Valores e Ética Profissional:</h3>
            <label htmlFor="valoresEtica" className="block text-sm font-medium text-gray-700 mb-1">Você se depara com um dilema ético no trabalho: seguir as regras da empresa estritamente pode prejudicar severamente um colega ou o andamento de um projeto importante, mas "dobrar" ou ignorar as regras pode beneficiá-lo em detrimento da política da empresa. Como você agiria nessa situação e qual seria sua justificativa para a decisão tomada?</label>
            <textarea id="valoresEtica" name="valoresEtica" rows="6" value={formData.valoresEtica} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>
            <p className="text-xs text-gray-500 mb-4">Avalia seus princípios éticos e a tomada de decisão em situações complexas de moralidade no ambiente de trabalho.</p>

            <label htmlFor="valoresPessoaisEmpresa" className="block text-sm font-medium text-gray-700 mb-1">Quais são os seus valores pessoais (ex: integridade, justiça, inovação, colaboração, respeito) que você considera inegociáveis em um ambiente de trabalho? Como você garante que esses valores estejam alinhados com a cultura da empresa em que você atua ou busca atuar? Dê exemplos práticos.</label>
            <textarea id="valoresPessoaisEmpresa" name="valoresPessoaisEmpresa" rows="6" value={formData.valoresPessoaisEmpresa} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required></textarea>
            <p className="text-xs text-gray-500 mb-4">Ajuda a identificar a consistência moral e a adequação cultural.</p>

          </fieldset>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">
            Enviar Cadastro Completo
          </button>
        </form>
      </div>
      <MessageBox message={message} type={messageType} onClose={() => setMessage('')} />
    </div>
  );
}

// Componente do Dashboard (Vagas - Mantido, mas não será o primeiro após o login)
function DashboardPage() {
  const { authInstance, userId, dbInstance } = useAuth(); // dbInstance é necessário aqui
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [analysis, setAnalysis] = useState({});
  const navigate = useNavigate();

  // Importações do Firestore específicas para este componente
  const { doc, getDoc } = require('firebase/firestore');

  useEffect(() => {
    const fetchAnalysisFromAPI = async () => {
      try {
        // Primeiro, tentar buscar do backend Flask
        const response = await fetch(`http://localhost:8000/get-analysis?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setAnalysis(data);
        } else if (response.status === 404) {
          // Se não encontrar no backend Flask, tentar buscar no Firestore
          console.log("Perfil não encontrado no backend Flask, buscando no Firestore...");
          if (dbInstance && userId) {
            const docRef = doc(dbInstance, "users", userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setAnalysis(docSnap.data());
              setMessage("Dados carregados do Firestore.");
              setMessageType('success');
            } else {
              setMessage("Nenhum dado de perfil encontrado.");
              setMessageType('error');
              console.log("No such document in Firestore!");
              // Redireciona para o perfil se não houver dados
              navigate('/profile');
            }
          }
        } else {
          throw new Error(`Erro ao buscar análise no backend: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Erro ao buscar análise:", error);
        setMessage(`Erro ao carregar perfil: ${error.message}`);
        setMessageType('error');
      }
    };

    if (userId) fetchAnalysisFromAPI();
  }, [userId, dbInstance, navigate]); // Adicionado dbInstance e navigate como dependências

  const handleLogout = async () => {
    try {
      await signOut(authInstance);
      setMessage('Logout realizado com sucesso!');
      setMessageType('success');
      navigate('/');
    } catch (error) {
      console.error(error);
      setMessage(`Erro ao fazer logout: ${error.message}`);
      setMessageType('error');
    }
  };

  const radarBehavioral = {
    labels: [
      'Colaboração',
      'Resolução de Problemas',
      'Proatividade',
      'Comunicação',
      'Adaptabilidade',
      'Liderança',
      'Inteligência Emocional'
    ],
    datasets: [
      {
        label: 'Notas Comportamentais',
        data: [
          analysis.nota_collaboration || 0,
          analysis.nota_problem_solving || 0,
          analysis.nota_proactivity || 0,
          analysis.nota_communication || 0,
          analysis.nota_adaptability || 0,
          analysis.nota_leadership || 0,
          analysis.nota_emotional_intelligence || 0
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)'
      }
    ]
  };

  const radarBigFive = {
    labels: [
      'Consciência',
      'Extroversão',
      'Abertura',
      'Amabilidade',
      'Neuroticismo'
    ],
    datasets: [
      {
        label: 'Traços Big Five',
        data: [
          analysis.big_five?.conscientiousness || 0,
          analysis.big_five?.extroversion || 0,
          analysis.big_five?.openness || 0,
          analysis.big_five?.agreeableness || 0,
          analysis.big_five?.neuroticism || 0
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)'
      }
    ]
  };

  const radarOptions = {
    responsive: true,
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1 },
        pointLabels: { font: { size: 14 } }
      }
    },
    plugins: { legend: { display: false } }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
          <h1 className="text-3xl font-bold">Perfil Comportamental</h1>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Sair
        </button>
      </div>

      {/* Dados Básicos do Candidato */}
      <div className="mb-8 p-6 border rounded shadow-sm bg-white">
        <h2 className="text-xl font-semibold mb-4">Dados do Candidato</h2>
        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Nome:</strong> {analysis.full_name || '-'}</p>
          <p><strong>Email:</strong> {analysis.email || '-'}</p>
          <p><strong>Telefone:</strong> {analysis.phone || '-'}</p>
          <p><strong>Área de Atuação:</strong> {analysis.area_of_expertise || '-'}</p>
          <p><strong>Experiência Total:</strong> {analysis.experience_total || '-'}</p>
          <p><strong>Qualificação:</strong> {analysis.qualification || '-'}</p>
          <p><strong>LinkedIn:</strong> <a href={analysis.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{analysis.linkedin || '-'}</a></p>
          <p><strong>Portfólio:</strong> <a href={analysis.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{analysis.portfolio || '-'}</a></p>
          <p><strong>Objetivo de Carreira:</strong> {analysis.career_goal || '-'}</p>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Habilidades:</h3>
          <div className="flex flex-wrap gap-2">
            {(analysis.skills || []).map((skill, i) => (
              <span key={i} className="inline-block bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Análises de IA */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Análise de Colaboração</h2>
          <p>{analysis.ai_colaboration_analysis || 'Análise não disponível.'}</p>
        </div>
        <div className="p-4 bg-green-50 border border-green-200 rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Análise de Resolução de Problemas</h2>
          <p>{analysis.ai_problem_solving_analysis || 'Análise não disponível.'}</p>
        </div>
      </div>

      {/* Gráficos Radar */}
      <div className="grid md:grid-cols-2 gap-10 mb-12">
        <div>
          <h2 className="text-xl font-bold mb-4">Notas Comportamentais</h2>
          <Radar data={radarBehavioral} options={radarOptions} />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Traços Big Five</h2>
          <Radar data={radarBigFive} options={radarOptions} />
        </div>
      </div>

      {/* Mentalidade e Valores */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="p-4 bg-white border rounded shadow-sm">
          <h2 className="text-lg font-bold mb-2">Mentalidade de Crescimento</h2>
          <p>{analysis.growth_mindset || 'Não disponível.'}</p>
        </div>
        <div className="p-4 bg-white border rounded shadow-sm">
          <h2 className="text-lg font-bold mb-2">Tolerância à Ambiguidade</h2>
          <p>{analysis.tolerance_for_ambiguity || 'Não disponível.'}</p>
        </div>
        <div className="p-4 bg-white border rounded shadow-sm">
          <h2 className="text-lg font-bold mb-2">Gestão de Conflitos</h2>
          <p>{analysis.conflict_management || 'Não disponível.'}</p>
        </div>
        <div className="p-4 bg-white border rounded shadow-sm">
          <h2 className="text-lg font-bold mb-2">Cenário de Inteligência Emocional</h2>
          <p>{analysis.emotional_intelligence_scenario || 'Não disponível.'}</p>
        </div>
      </div>

      {/* Motivação */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded shadow-sm">
          <h2 className="text-lg font-bold mb-2">Motivação</h2>
          <p>{analysis.motivation || 'Não disponível.'}</p>
        </div>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded shadow-sm">
          <h2 className="text-lg font-bold mb-2">Motivação por Desafio</h2>
          <p>{analysis.challenge_motivation || 'Não disponível.'}</p>
        </div>
      </div>

      {/* Valores */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4">Valores</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {(analysis.values_company || []).map((val, i) => (
            <span key={i} className="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
              {val}
            </span>
          ))}
        </div>
        <p className="p-4 bg-gray-50 border border-gray-200 rounded shadow-sm">
          {analysis.personal_values_company || 'Valores pessoais não disponíveis.'}
        </p>
        <p className="p-4 bg-gray-50 border border-gray-200 rounded shadow-sm mt-4">
          <strong>Ética:</strong> {analysis.ethics_values || 'Ética não disponível.'}
        </p>
      </div>

      {/* Ambiente */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4">Preferências de Ambiente de Trabalho</h2>
        <div className="flex flex-wrap gap-2">
          {(analysis.environment_preferences || []).map((pref, i) => (
            <span key={i} className="inline-block bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">
              {pref}
            </span>
          ))}
        </div>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded ${
          messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}


// Componente Principal da Aplicação
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={< AuthPage/>} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfileFormPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// AppContent foi removido pois não estava sendo usado na função App principal.
// A lógica de roteamento agora controla qual componente é renderizado.