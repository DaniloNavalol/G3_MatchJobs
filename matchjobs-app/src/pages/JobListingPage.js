import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function JobListingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const vagas = location.state?.vagas || [];

  return (
    <div className="container py-12 px-4 mx-auto max-w-5xl">
      <h2 className="text-3xl font-bold mb-6 text-center">Vagas Encontradas</h2>

      {vagas.length === 0 ? (
        <p className="text-center text-gray-600">Nenhuma vaga encontrada para os critérios selecionados.</p>
      ) : (
        <div className="grid gap-6">
          {vagas.map((vaga, index) => (
            <div
              key={index}
              className="border border-gray-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
            >
              <h3 className="text-xl font-semibold mb-2">{vaga.titulo}</h3>
              <p><strong>Empresa:</strong> {vaga.empresa}</p>
              <p><strong>Tipo de Contrato:</strong> {vaga.contrato}</p>
              <p><strong>Requisitos:</strong> {vaga.requisitos}</p>
              <div className="mt-4">
                <a
                  href={vaga.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Ver detalhes e candidatar-se
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors"
        >
          Voltar para Home
        </button>
      </div>
    </div>
  );
}
