'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Coffee, 
  ArrowRight, 
  ShieldCheck, 
  Link as LinkIcon, 
  Gem, 
  CheckCircle,
  Users,
  BarChart3,
  Globe,
  Leaf,
  Truck,
  Factory
} from 'lucide-react';

// Hook para Text Scramble otimizado
const useScrambleText = (text, enabled = true) => {
  const [displayText, setDisplayText] = useState(enabled ? '' : text);
  
  useEffect(() => {
    if (!enabled) {
      setDisplayText(text);
      return;
    }

    let currentText = '';
    let currentIndex = 0;
    const scrambleChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~';
    
    const scrambleInterval = setInterval(() => {
      if (currentIndex < text.length) {
        // Para os próximos caracteres, mostra caracteres aleatórios
        const scrambled = text.split('').map((char, index) => {
          if (index <= currentIndex) {
            return text[index];
          }
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }).join('');
        
        setDisplayText(scrambled);
        currentIndex += 0.5;
      } else {
        clearInterval(scrambleInterval);
        setDisplayText(text);
      }
    }, 40);

    return () => clearInterval(scrambleInterval);
  }, [text, enabled]);

  return displayText;
};

const LandingPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const handleGetStarted = () => {
    navigate('/login');
  };

  const cn = (...classes) => classes.filter(Boolean).join(' ');

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full overflow-x-hidden bg-gray-950 text-white font-sans"
    >
      {/* Background Effects Otimizados */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2">
        <div className="h-[44rem] w-[90rem] bg-[radial-gradient(50%_50%_at_50%_50%,#785a28_0%,rgba(120,90,40,0)_100%)] opacity-10" />
      </div>

      {/* Blobs de Fundo Simples */}
      <div className="fixed inset-0 -z-10 overflow-hidden opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-300/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-950/90 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Coffee className="h-8 w-8 text-amber-400" />
            </div>
            <span className="text-2xl font-semibold font-serif text-slate-100">CoffeLedger</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-300 hover:text-amber-400 transition-colors">Recursos</a>
            <a href="#how-it-works" className="text-slate-300 hover:text-amber-400 transition-colors">Como Funciona</a>
            <a href="#benefits" className="text-slate-300 hover:text-amber-400 transition-colors">Vantagens</a>
          </nav>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 rounded-lg border border-amber-400/50 text-amber-400 hover:bg-amber-400/10 transition-all duration-300 backdrop-blur-sm"
          >
            Entrar
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto flex min-h-[calc(100vh-5rem)] items-center px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 font-mono text-sm uppercase tracking-widest text-amber-400/80"
            >
              Blockchain para a Cadeia do Café
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-serif text-5xl font-bold tracking-tight text-slate-100 sm:text-6xl lg:text-7xl mb-6"
            >
              <span className="bg-gradient-to-b from-slate-100 to-slate-400 bg-clip-text text-transparent">
                Rastreabilidade
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                Transparente
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl leading-8 text-slate-300/90 mb-8 max-w-2xl mx-auto"
            >
              Conecte toda a cadeia produtiva do café com tecnologia blockchain. 
              Do produtor ao consumidor, garantimos origem, qualidade e sustentabilidade.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button 
                onClick={handleGetStarted}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl shadow-amber-500/20 transition-all hover:shadow-amber-500/40 hover:scale-105"
              >
                <span className="relative flex items-center space-x-2">
                  <span>Começar Agora</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
              
              <button className="px-8 py-4 text-lg font-semibold text-slate-300 border border-slate-600 rounded-lg hover:border-amber-400/50 hover:text-amber-400 transition-all">
                Agendar Demonstração
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-slate-700/50"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">500+</div>
                <div className="text-sm text-slate-400">Produtores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">50K+</div>
                <div className="text-sm text-slate-400">Lotes Rastreados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">12</div>
                <div className="text-sm text-slate-400">Países</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">99.9%</div>
                <div className="text-sm text-slate-400">Disponibilidade</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-slate-900/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-serif text-4xl font-bold text-slate-100 mb-4"
              >
                Tecnologia que Transforma
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-slate-400 max-w-2xl mx-auto"
              >
                Uma plataforma completa para toda a cadeia produtiva do café
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={ShieldCheck}
                title="Certificação Digital"
                description="Cada lote recebe um certificado blockchain imutável com todas as informações de origem, processamento e qualidade."
                features={["Autenticidade Garantida", "Sem Falsificação", "Histórico Completo"]}
              />
              
              <FeatureCard
                icon={LinkIcon}
                title="Cadeia Conectada"
                description="Integre todos os participantes: produtores, cooperativas, transportadoras, torrefadores e varejistas."
                features={["Comunicação em Tempo Real", "Documentação Automatizada", "Processos Otimizados"]}
              />
              
              <FeatureCard
                icon={Gem}
                title="Valor Agregado"
                description="Aumente o valor do seu café com provas de origem, sustentabilidade e qualidade premium."
                features={["Premiumização", "Mercado Internacional", "Consumidor Consciente"]}
              />
              
              <FeatureCard
                icon={Leaf}
                title="Sustentabilidade"
                description="Comprove práticas sustentáveis e rastreie o impacto ambiental em toda a cadeia."
                features={["Certificação Verde", "Carbon Footprint", "Práticas Sustentáveis"]}
              />
              
              <FeatureCard
                icon={BarChart3}
                title="Analytics Avançado"
                description="Dashboards inteligentes com dados de produção, qualidade, mercado e tendências."
                features={["Insights em Tempo Real", "Previsões de Safra", "Otimização de Custos"]}
              />
              
              <FeatureCard
                icon={Globe}
                title="Mercado Global"
                description="Conecte-se com compradores internacionais e amplie seu mercado com segurança."
                features={["Comércio Internacional", "Pagamentos Seguros", "Logística Integrada"]}
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-serif text-4xl font-bold text-slate-100 mb-4"
              >
                Como Funciona
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-slate-400 max-w-2xl mx-auto"
              >
                Simples, seguro e eficiente para todos os participantes
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <ProcessStep
                step={1}
                icon={Users}
                title="Cadastro"
                description="Produtores e participantes se cadastram na plataforma com verificação de identidade"
              />
              <ProcessStep
                step={2}
                icon={Leaf}
                title="Registro"
                description="Cada lote é registrado com dados de plantio, colheita e processamento"
              />
              <ProcessStep
                step={3}
                icon={Truck}
                title="Rastreamento"
                description="Movimentação e transformação são registradas em tempo real na blockchain"
              />
              <ProcessStep
                step={4}
                icon={Factory}
                title="Certificação"
                description="Certificado digital único é emitido para cada produto final"
              />
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 bg-slate-900/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="font-serif text-4xl font-bold text-slate-100 mb-6"
                >
                  Vantagens para Cada Participante
                </motion.h2>
                
                <div className="space-y-4">
                  <BenefitItem 
                    title="Para Produtores"
                    benefits={[
                      "Valorização do produto",
                      "Acesso a mercados premium",
                      "Transparência nas transações"
                    ]}
                  />
                  <BenefitItem 
                    title="Para Torrefadores"
                    benefits={[
                      "Garantia de origem e qualidade",
                      "Processos otimizados",
                      "Diferencial competitivo"
                    ]}
                  />
                  <BenefitItem 
                    title="Para Varejistas"
                    benefits={[
                      "História autêntica para o consumidor",
                      "Certificação de sustentabilidade",
                      "Fidelização de clientes"
                    ]}
                  />
                  <BenefitItem 
                    title="Para Consumidores"
                    benefits={[
                      "Transparência total",
                      "Qualidade garantida",
                      "Consumo consciente"
                    ]}
                  />
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-2xl p-8 backdrop-blur-sm border border-amber-400/20">
                  <h3 className="text-2xl font-serif font-bold text-slate-100 mb-4">Dados da Indústria</h3>
                  
                  <div className="space-y-4">
                    <StatItem 
                      value="+40%"
                      label="Valorização em cafés rastreados"
                    />
                    <StatItem 
                      value="+80%"
                      label="Consumidores preferem produtos com origem"
                    />
                    <StatItem 
                      value="15%"
                      label="Redução de perdas na cadeia"
                    />
                    <StatItem 
                      value="+60%"
                      label="Aumento na confiança do consumidor"
                    />
                  </div>
                  
                  <div className="mt-6 p-4 bg-amber-400/10 rounded-lg border border-amber-400/20">
                    <p className="text-sm text-amber-200">
                      "A rastreabilidade blockchain está revolucionando a indústria do café, 
                      criando valor para todos os participantes da cadeia."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-serif text-4xl font-bold text-slate-100 mb-4"
              >
                Pronto para Transformar seu Negócio?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-slate-400 mb-8"
              >
                Junte-se a centenas de produtores que já estão usando a CoffeLedger
              </motion.p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleGetStarted}
                  className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:shadow-2xl hover:shadow-amber-500/20 transition-all hover:scale-105"
                >
                  Criar Conta Gratuita
                </button>
                <button className="px-8 py-4 text-lg font-semibold text-slate-300 border border-slate-600 rounded-lg hover:border-amber-400/50 hover:text-amber-400 transition-all">
                  Falar com Especialista
                </button>
              </div>
              
              <p className="mt-4 text-sm text-slate-500">
                Experimente gratuitamente por 30 dias • Sem necessidade de cartão
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Coffee className="h-6 w-6 text-amber-400" />
                <span className="text-xl font-semibold font-serif text-slate-100">CoffeLedger</span>
              </div>
              <p className="text-slate-400 text-sm">
                Tecnologia blockchain para transformar a cadeia produtiva do café.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-100 mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-100 mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Carreiras</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-100 mb-4">Contato</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>contato@coffeledger.com</li>
                <li>+55 (11) 99999-9999</li>
                <li>São Paulo, Brasil</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700/50 mt-8 pt-8 text-center text-sm text-slate-500">
            <p>&copy; 2024 CoffeLedger. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Componente FeatureCard
const FeatureCard = ({ icon: Icon, title, description, features }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700/50 hover:border-amber-400/30 transition-all duration-300 hover:transform hover:scale-105"
    >
      <div className="flex items-center mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-400/10 ring-1 ring-inset ring-amber-400/20">
          <Icon className="h-6 w-6 text-amber-400" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 mb-4">{description}</p>
      
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-slate-300">
            <CheckCircle className="h-4 w-4 text-amber-400 mr-2" />
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

// Componente ProcessStep
const ProcessStep = ({ step, icon: Icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: step * 0.1 }}
      className="text-center group"
    >
      <div className="relative inline-flex mb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-400/10 ring-1 ring-inset ring-amber-400/20 group-hover:bg-amber-400/20 transition-colors">
          <Icon className="h-8 w-8 text-amber-400" />
        </div>
        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-slate-900">
          {step}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </motion.div>
  );
};

// Componente BenefitItem
const BenefitItem = ({ title, benefits }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50"
    >
      <h4 className="font-semibold text-amber-400 mb-2">{title}</h4>
      <ul className="space-y-1">
        {benefits.map((benefit, index) => (
          <li key={index} className="text-sm text-slate-300 flex items-center">
            <CheckCircle className="h-3 w-3 text-amber-400 mr-2" />
            {benefit}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

// Componente StatItem
const StatItem = ({ value, label }) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-700/30">
      <span className="text-2xl font-bold text-amber-400">{value}</span>
      <span className="text-sm text-slate-300 text-right">{label}</span>
    </div>
  );
};

export default LandingPage;