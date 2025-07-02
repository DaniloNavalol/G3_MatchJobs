import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const [cidade, setCidade] = useState('São Luís - MA');
  const [keyword, setKeyword] = useState('');

  const handleGoToAuth = () => {
    navigate('/auth');
  };

  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:8000/get-vagas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: keyword,
          cidade: cidade
        }),
      });

      if (response.ok) {
        const vagas = await response.json();
        console.log('Vagas encontradas:', vagas);
        navigate('/job_listing', { state: { vagas } });
      } else {
        console.error('Erro na API:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
    }
  };

  return (
    <>
      {/* Preloader Start */}
      <div id="preloader-active">
        <div className="preloader d-flex align-items-center justify-content-center">
          <div className="preloader-inner position-relative">
            <div className="preloader-circle"></div>
            <div className="preloader-img pere-text">
              <img src="/assets/img/logo/Matchjobslogo.png" alt="MatchJobs Logo" />
            </div>
          </div>
        </div>
      </div>
      {/* Preloader End */}

      {/* Header Start */}
      <header>
        <div className="header-area header-transparrent">
          <div className="headder-top header-sticky border-bottom border-secondary bg-light">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-3 col-md-2">
                  <div className="logo">
                    <img src="/assets/img/logo/matchjoblogo.png" alt="MatchJobs" style={{ width: '240px' }} />
                  </div>
                </div>
                <div className="col-lg-9 col-md-9">
                  <div className="menu-wrapper">
                    <div className="main-menu">
                      <nav className="d-none d-lg-block">
                        <ul id="navigation">
                          <li><a href="/">Inicio</a></li>
                          <li><a href="/job_listing">Buscar Vagas</a></li>
                        </ul>
                      </nav>
                    </div>
                    <div className="header-btn d-none f-right d-lg-block">
                      <button onClick={handleGoToAuth} className="btn head-btn1">Cadastrar</button>
                      <button onClick={handleGoToAuth} className="btn head-btn2">Entrar</button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="mobile_menu d-block d-lg-none"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Header End */}

      <main>
        {/* Slider Area Start */}
        <div className="slider-area">
          <div className="slider-active">
            <div
              className="single-slider slider-height d-flex align-items-center"
              style={{ backgroundImage: `url("/assets/img/hero/h1_hero.jpg")` }}
            >
              <div className="container">
                <div className="row">
                  <div className="col-xl-6 col-lg-9 col-md-10">
                    <div className="hero__caption">
                      <h1>
                        Encontre o <span style={{ color: 'hsl(25, 100%, 70%)' }}>emprego</span> dos seus sonhos
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-8">
                    <div className="search-box border border-light rounded p-3">
                      <div className="input-form mb-2">
                        <input
                          type="text"
                          className="form-control border border-secondary"
                          placeholder="Cargo ou palavra-chave"
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                        />
                      </div>
                      <div className="select-form mb-2">
                        <div className="select-itms">
                          <select
                            id="select1"
                            className="form-select border border-secondary"
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                          >
                            <option value="São Luís - MA">São Luís - MA</option>
                            <option value="São José de Ribamar - MA">São José de Ribamar - MA</option>
                            <option value="Paço do Lumiar - MA">Paço do Lumiar - MA</option>
                            <option value="Raposa - MA">Raposa - MA</option>
                          </select>
                        </div>
                      </div>
                      <div className="search-form">
                        <button
                          type="button"
                          onClick={handleSearch}
                          className="btn btn-outline-secondary w-100"
                        >
                          Buscar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Slider Area End */}

        {/* How Apply Process Start */}
        <div
          className="apply-process-area apply-bg pt-150 pb-150"
          style={{ backgroundImage: `url("/assets/img/gallery/how-applybg.png")` }}
        >
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-tittle white-text text-center">
                  <span>Processo de Inscrição</span>
                  <h2>Como Funciona</h2>
                </div>
              </div>
            </div>
            <div className="row">
              {[
                {
                  icon: 'flaticon-search',
                  title: '1. Encontre uma vaga',
                  desc: 'Encontre oportunidades que combinam com suas habilidades e interesses. Filtre por área, localização ou tipo de contrato.',
                },
                {
                  icon: 'flaticon-curriculum-vitae',
                  title: '2. Candidate-se',
                  desc: 'Envie seu currículo de forma rápida e fácil. Aproveite nossas ferramentas de Analise Comportamental para se destacar entre os candidatos.',
                },
                {
                  icon: 'flaticon-tour',
                  title: '3. Conquiste seu emprego',
                  desc: 'Agora é só aguardar o retorno das empresas. Aqui, você está mais perto de trabalhar no emprego dos seus sonhos!',
                },
              ].map((step, idx) => (
                <div key={idx} className="col-lg-4 col-md-6">
                  <div className="single-process text-center mb-30">
                    <div className="process-ion">
                      <span className={step.icon}></span>
                    </div>
                    <div className="process-cap">
                      <h5>{step.title}</h5>
                      <p>{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* How Apply Process End */}
      </main>

      <footer>
        {/* Footer Start */}
        <div className="footer-area footer-bg footer-padding">
          <div className="container">
            <div className="row d-flex justify-content-between">
              {/* ...footer columns here... */}
            </div>
          </div>
        </div>
        <div className="footer-bottom-area footer-bg">
          <div className="container">
            <div className="footer-border">
              <div className="row d-flex justify-content-between align-items-center">
                <div className="col-xl-10 col-lg-10"></div>
                <div className="col-xl-2 col-lg-2">
                  <div className="footer-social f-right">
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fas fa-globe"></i></a>
                    <a href="#"><i className="fab fa-behance"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer End */}
      </footer>
    </>
  );
}

