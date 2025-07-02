import os
import re 
from dotenv import load_dotenv
load_dotenv()
from flask import Flask, request, jsonify
from flask_cors import CORS 
import firebase_admin
from firebase_admin import credentials, firestore, storage
from datetime import datetime
import uuid 
import base64 
import json 

# Importa a biblioteca do Google Gemini
import google.generativeai as genai 


app = Flask(__name__)
CORS(app) 

@app.route('/get-vagas', methods=['POST'])
#def force_utf8():
 #   if request.content_type == 'application/json':
  #      request.charset = 'utf-8'
def get_vagas():
    data = request.get_json()
    cargo = data['cargo']
    cidade = data['cidade']

    prompt = (
        f"Liste 5 vagas de emprego para o cargo '{cargo}' em '{cidade}'. "
        "Cada vaga deve ter: título, empresa, tipo de contrato, requisitos principais e link de candidatura fictício."
        "Responda em JSON com uma lista chamada 'vagas'."
    )

    # Chamada à Gemini (exemplo genérico)
    response = genai.chat(model="gemini-pro", messages=[{"role": "user", "content": prompt}])
    text = response.text

    # Parse do JSON retornado
    import json
    try:
        data = json.loads(text)
        return jsonify(data['vagas'])
    except Exception as e:
        print(e)
        return jsonify([]), 500

if __name__ == '__main__':
    app.run(port=8000)

@app.before_request
def force_utf8():
    if request.content_type == 'application/json':
        request.charset = 'utf-8'
        
# --- Configuração Firebase Admin SDK ---
SERVICE_ACCOUNT_KEY_PATH = 'matchjobs-d13e0-firebase-adminsdk-fbsvc-0cf16b9b3b.json' 
PROJECT_ID = "matchjobs-d13e0" 
STORAGE_BUCKET_NAME = "matchjobs-d13e0.appspot.com"  # CORRIGIDO: .app → .com

# Prints de debug
print(f"DEBUG: SERVICE_ACCOUNT_KEY_PATH = {SERVICE_ACCOUNT_KEY_PATH}")
print(f"DEBUG: PROJECT_ID = {PROJECT_ID}")
print(f"DEBUG: STORAGE_BUCKET_NAME = {STORAGE_BUCKET_NAME}")

try:
    if not firebase_admin._apps:
        cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
        firebase_admin.initialize_app(cred, {
            'projectId': PROJECT_ID,
            'storageBucket': STORAGE_BUCKET_NAME
        })
        print("Firebase Admin SDK inicializado com sucesso.")
    db = firestore.client(database_id='machjob')
    bucket = storage.bucket()
except Exception as e:
    print(f"Erro ao inicializar Firebase Admin SDK: {e}")
    db = None
    bucket = None

# --- Configuração da Gemini API ---
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-2.0-flash')
    print("Gemini API configurada.")
else:
    print("AVISO: Variável de ambiente GEMINI_API_KEY não definida.")
    gemini_model = None

# --- Função de análise com Gemini ---
async def generate_ai_analysis(prompt_text):
    if not gemini_model:
        return "Erro: Gemini API Key não configurada."
    try:
        response = await gemini_model.generate_content_async(
            contents=[{'role': 'user', 'parts': [{'text': prompt_text}]}]
        )
        return response.text
    except Exception as e:
        print(f"Erro ao chamar Gemini: {e}")
        return f"Erro: {e}"

# --- Teste de status ---
@app.route('/')
def home():
    return jsonify({"message": "Backend MatchJobs está online!"}), 200

# --- Rota de submissão ---
@app.route('/submit-profile', methods=['POST'])
async def submit_profile():
    if db is None or bucket is None:
        return jsonify({"message": "Erro: Firebase não inicializado."}), 500

    try:
        data = request.json
        form_data = data.get('formData', {})
        curriculo_base64 = data.get('curriculoBase64')
        curriculo_filename = data.get('curriculoFilename')
        
        curriculo_url = None
        if curriculo_base64 and curriculo_filename:
            try:
                _, encoded = curriculo_base64.split(',', 1)
                file_bytes = base64.b64decode(encoded)
                unique_filename = f"curriculos/{uuid.uuid4()}_{curriculo_filename}"
                blob = bucket.blob(unique_filename)

                content_type = 'application/octet-stream'
                if curriculo_filename.lower().endswith('.pdf'):
                    content_type = 'application/pdf'
                elif curriculo_filename.lower().endswith('.docx'):
                    content_type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                elif curriculo_filename.lower().endswith('.doc'):
                    content_type = 'application/msword'

                blob.upload_from_string(file_bytes, content_type=content_type)
                blob.make_public()
                curriculo_url = blob.public_url
                print(f"Currículo enviado: {curriculo_url}")
            except Exception as e:
                curriculo_url = f"Erro ao enviar: {e}"

        form_data['curriculo_url'] = curriculo_url

        # Gere as análises de IA
        colaboration_text = form_data.get('trabalhoEquipe', '')
        problem_solving_text = form_data.get('raciocinioLogico', '')

        form_data['ai_colaboration_analysis'] = await generate_ai_analysis(
            f"Analise o seguinte texto sobre colaboração: \"{colaboration_text}\". Resuma em 50 palavras."
        )
        form_data['ai_problem_solving_analysis'] = await generate_ai_analysis(
            f"Analise o seguinte texto sobre resolução de problemas: \"{problem_solving_text}\". Resuma em 50 palavras."
        )

        # Função auxiliar para gerar nota
        async def generate_score(prompt):
            score_text = await generate_ai_analysis(prompt)
            match = re.search(r'\d+', score_text)
            if match:
                score = int(match.group())
                return max(1, min(score, 5))
            return None

        # Gere as notas comportamentais com campos em inglês
        form_data['nota_collaboration'] = await generate_score(
            f"Dê uma nota de 1 a 5 para a colaboração neste texto: \"{colaboration_text}\"."
        )

        form_data['nota_problem_solving'] = await generate_score(
            f"Dê uma nota de 1 a 5 para a capacidade de resolver problemas: \"{problem_solving_text}\"."
        )

        form_data['nota_proactivity'] = await generate_score(
            f"Dê uma nota de 1 a 5 para a proatividade mostrada: \"{form_data.get('proatividade', '')}\"."
        )

        form_data['nota_communication'] = await generate_score(
            f"Dê uma nota de 1 a 5 para a comunicação: \"{form_data.get('comunicacao', '')}\"."
        )

        form_data['nota_adaptability'] = await generate_score(
            f"Dê uma nota de 1 a 5 para a adaptabilidade: \"{form_data.get('adaptabilidade', '')}\"."
        )

        form_data['nota_leadership'] = await generate_score(
            f"Dê uma nota de 1 a 5 para a liderança: \"{form_data.get('lideranca', '')}\"."
        )

        form_data['nota_emotional_intelligence'] = await generate_score(
            f"Dê uma nota de 1 a 5 para a inteligência emocional: \"{form_data.get('inteligenciaEmocional_cenario', '')}\"."
        )

        form_data['submissionDate'] = firestore.SERVER_TIMESTAMP

        user_id = data.get('userId')
        if not user_id:
            return jsonify({"message": "Erro: userId não fornecido."}), 400

        doc_ref = db.collection('candidatos').document(user_id)
        doc_ref.set(form_data)

        return jsonify({
            "message": "Perfil salvo com sucesso!",
            "id": doc_ref.id,
            "curriculo_url": curriculo_url,
            "ai_colaboration_analysis": form_data['ai_colaboration_analysis'],
            "ai_problem_solving_analysis": form_data['ai_problem_solving_analysis'],
            "notas": {
                "collaboration": form_data['nota_collaboration'],
                "problem_solving": form_data['nota_problem_solving'],
                "proactivity": form_data['nota_proactivity'],
                "communication": form_data['nota_communication'],
                "adaptability": form_data['nota_adaptability'],
                "leadership": form_data['nota_leadership'],
                "emotional_intelligence": form_data['nota_emotional_intelligence']
            }
        }), 200

    except Exception as e:
        print(f"Erro ao processar: {e}")
        return jsonify({"message": f"Erro: {e}"}), 500
# --- Rota de consulta dos resultados da IA ---

@app.route('/get-analysis', methods=['GET'])
def get_analysis():
    if db is None:
        return jsonify({"message": "Error: Firebase not initialized."}), 500

    try:
        user_id = request.args.get('userId')

        if not user_id:
            return jsonify({"message": "Error: Missing userId in query string."}), 400

        doc_ref = db.collection('candidatos').document(user_id)
        doc = doc_ref.get()

        if not doc.exists:
            return jsonify({"message": "Candidate not found."}), 404

        data = doc.to_dict()

        return jsonify({
            # === BASIC PROFILE INFO ===
            "full_name": data.get('nomeCompleto', ''),
            "email": data.get('email', ''),
            "phone": data.get('telefone', ''),
            "area_of_expertise": data.get('areaAtuacao', ''),
            "experience_total": data.get('experienciaTotal', ''),
            "qualification": data.get('qualificacaoAcademica', ''),
            "skills": data.get('habilidades', []),
            "linkedin": data.get('linkedin', ''),
            "portfolio": data.get('portfolio', ''),
            "summary_professional": data.get('sumarioProfissional', ''),
            "curriculum_url": data.get('curriculo_url', ''),
            "career_goal": data.get('objetivoCarreira', ''),

            # === AI SUMMARIES ===
            "ai_colaboration_analysis": data.get('ai_colaboration_analysis', ''),
            "ai_problem_solving_analysis": data.get('ai_problem_solving_analysis', ''),

            # === MAIN SOFT SKILLS SCORES ===
            "nota_collaboration": data.get('nota_collaboration', 0),
            "nota_problem_solving": data.get('nota_problem_solving', 0),
            "nota_proactivity": data.get('nota_proactivity', 0),
            "nota_communication": data.get('nota_communication', 0),
            "nota_adaptability": data.get('nota_adaptability', 0),
            "nota_leadership": data.get('nota_leadership', 0),
            "nota_emotional_intelligence": data.get('nota_emotional_intelligence', 0),

            # === BIG FIVE TRAITS ===
            "big_five": {
                "conscientiousness": int(data.get('bigFive_consciencia', 0)),
                "extroversion": int(data.get('bigFive_extroversao', 0)),
                "openness": int(data.get('bigFive_abertura', 0)),
                "agreeableness": int(data.get('bigFive_amabilidade', 0)),
                "neuroticism": int(data.get('bigFive_neuroticismo', 0))
            },

            # === MINDSET AND EMOTIONAL INTELLIGENCE ===
            "growth_mindset": data.get('mentalidadeCrescimento', ''),
            "tolerance_for_ambiguity": data.get('toleranciaAmbiguidade', ''),
            "conflict_management": data.get('conflitoInterpessoal', ''),
            "emotional_intelligence_scenario": data.get('inteligenciaEmocional_cenario', ''),

            # === MOTIVATION & VALUES ===
            "motivation": data.get('motivacao', ''),
            "challenge_motivation": data.get('motivacaoDesafio', ''),
            "values_company": data.get('valoresEmpresa', []),
            "personal_values_company": data.get('valoresPessoaisEmpresa', ''),
            "ethics_values": data.get('valoresEtica', ''),

            # === ENVIRONMENT PREFERENCES ===
            "environment_preferences": data.get('preferenciasAmbiente', []),

            # === RAW FIELDS (OPTIONAL / FULL TEXTS) ===
            "raw_fields": {
                "teamwork": data.get('trabalhoEquipe', ''),
                "problem_solving_text": data.get('resolucaoProblemas', ''),
                "logical_reasoning": data.get('raciocinioLogico', ''),
                "numerical_problem": data.get('problemaNumericoLogico', ''),
                "creativity_problem": data.get('criatividadeProblema', ''),
                "divergent_thinking": data.get('pensamentoDivergente', ''),
                "proactivity": data.get('proatividade', ''),
                "communication": data.get('comunicacao', ''),
                "leadership": data.get('lideranca', ''),
                "adaptability": data.get('adaptabilidade', ''),
                "self_development": data.get('autodesenvolvimento', '')
            }
        }), 200

    except Exception as e:
        print(f"Error while retrieving analysis: {e}")
        return jsonify({"message": f"Error: {e}"}), 500


# --- Rodar o servidor ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)
