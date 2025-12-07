import React, { useState, useEffect } from 'react';
import { Phone, Mail, SquareGantt, Shovel, PencilRuler, AppWindow, FolderKanban, BadgeDollarSign, Info, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import LoginModal from '../components/LoginModal';
import PreviewModal from '../components/previewModal';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
import logo from '../assets/icons/logo.png';
import facebook from '../assets/icons/facebook.png';
import instagram from '../assets/icons/instagram.png';
import whatsapp from '../assets/icons/whatsapp.png';
import aboutBg from '../assets/images/about_bg.jpeg';
import mauricio from '../assets/images/mauricio_munoz.png';
import leonardo from '../assets/images/Leonardo_Bertiola.png';
import nelson from '../assets/images/Nelson_Campos.png';
import management from '../assets/images/asesoria_gestion.png';
import development from '../assets/images/desarrollo_proyectos.png';
import construction from '../assets/images/construction.png';
import onlinePlatform from '../assets/images/online.png';
import badget from '../assets/images/presupuesto.png';
import control from '../assets/images/control_obras.png';
import carrusel1 from '../assets/images/carrusel1.jpg';
import carrusel2 from '../assets/images/carrusel2.jpg';
import carrusel3 from '../assets/images/carrusel3.jpg';
import carrusel4 from '../assets/images/carrusel4.jpg';
import carrusel5 from '../assets/images/carrusel5.jpg';
import carrusel6 from '../assets/images/carrusel6.jpg';
import carrusel7 from '../assets/images/carrusel7.jpg';
import carrusel8 from '../assets/images/carrusel8.jpg';
import carrusel9 from '../assets/images/carrusel9.jpg';
import carrusel10 from '../assets/images/carrusel10.jpg';
import carrusel11 from '../assets/images/carrusel11.jpg';
import carrusel12 from '../assets/images/carrusel12.jpg';


const LandingPage: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdvModalOpen, setIsAdvModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isRemodelingModalOpen, setIsRemodelingModalOpen] = useState(false);
  const [isOnlineModalOpen, setIsOnlineModalOpen] = useState(false);
  const [isTenderModalOpen, setIsTenderModalOpen] = useState(false);
  const [isControlModalOpen, setIsControlModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const { t } = useLanguage();

  const carouselImages = [
  carrusel1,
  carrusel2,
  carrusel3,
  carrusel4,
  carrusel5,
  carrusel6,
  carrusel7,
  carrusel8,
  carrusel9,
  carrusel10,
  carrusel11,
  carrusel12,
];
  
const encodedMessage = encodeURIComponent(t('landing.contact.whatsapp.text'));
const [currentIndex, setCurrentIndex] = useState(0);
 const [isTransitioning, setIsTransitioning] = useState(false);

const handleContactSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Handle contact form submission
  console.log('Contact form submitted:', contactForm);
  setContactForm({ subject: '', message: '' });
  alert('Thank you for your message! We will get back to you soon.');
};

useEffect(() => {
  const delay = 5000;
  const interval = setInterval(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, delay);

  return () => clearInterval(interval);
}, [carouselImages.length]);
  
    const handlePrevious = () => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
      setTimeout(() => setIsTransitioning(false), 500);
    };
  
    const handleNext = () => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsTransitioning(false), 500);
    };
  

  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg fixed w-full top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={logo} alt="NLH Logo" className="h-12 w-12 ml-2" />
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                {t('nav.services')}
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                {t('nav.about')}
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                {t('nav.contact')}
              </a>
              <LanguageSelector />
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all transform hover:scale-105"
              >
                {t('nav.login')}
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
         {carouselImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
        </div>
      ))}
        <div className="relative max-w-10xl mx-auto px-8 sm:px-6 lg:px-10 pt-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t('landing.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6 max-w-6xl mx-auto">
              {t('landing.hero.subtitle')}
            </p>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto">
              {t('landing.hero.subtitle2')}
            </p>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:from-cyan-500 hover:to-blue-600 transition-all transform hover:scale-105 shadow-xl"
            >
              {t('nav.login')}
            </button>
          </div>
        </div>
             <div className="absolute bottom-8 left-8 flex gap-3">
        <button
          onClick={handlePrevious}
          disabled={isTransitioning}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all disabled:opacity-50"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={handleNext}
          disabled={isTransitioning}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all disabled:opacity-50"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="absolute bottom-8 right-8 flex gap-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 w-2 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
      </div>

      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('landing.services.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-all" >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <SquareGantt className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('landing.services.subtitle1')}</h3>
              <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" onClick={() => setIsAdvModalOpen(true)}>
                <div className="flex items-center justify-center">
                  Saber Más
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all" >
              <div className="bg-gradient-to-r from-green-600 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <PencilRuler className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('landing.services.subtitle2')}</h3>
              <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" onClick={() => setIsNewModalOpen(true)}>
                <div className="flex items-center justify-center">
                  Saber Más
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 hover:shadow-lg transition-all" >
              <div className="bg-gradient-to-r from-purple-600 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shovel className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('landing.services.subtitle3')}</h3>
              <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" onClick={() => setIsRemodelingModalOpen(true)}>
                <div className="flex items-center justify-center">
                  Saber Más
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>
          <br />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-all" >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <AppWindow className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('landing.services.subtitle4')}</h3>
              <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" onClick={() => setIsOnlineModalOpen(true)}>
                <div className="flex items-center justify-center">
            Saber Más
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all" >
              <div className="bg-gradient-to-r from-green-600 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderKanban className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('landing.services.subtitle5')}</h3>
              <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" onClick={() => setIsTenderModalOpen(true)}>
                <div className="flex items-center justify-center">
                 Saber Más
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 hover:shadow-lg transition-all" >
              <div className="bg-gradient-to-r from-purple-600 to-indigo-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BadgeDollarSign className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('landing.services.subtitle6')}</h3>
              <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" onClick={() => setIsControlModalOpen(true)}>
                <div className="flex items-center justify-center">
                 Saber Más
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>
          <br />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t('landing.about.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('landing.about.description')}
              </p>
              <div className="grid grid-cols-3">
                <div>
                  <div>
                    <img
                      src={mauricio}
                      alt={"Mauricio Muñoz"}
                      className="size-2/4 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{"Mauricio Muñoz"}</p>
                    <p className="text-sm text-gray-500">{"mauricio@nlh.cl"}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <img
                      src={nelson}
                      alt={"Nelson Campos"}
                      className="size-2/4 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{"Nelson Campos"}</p>
                    <p className="text-sm text-gray-500">{"nelson@nlh.cl"}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <img
                      src={leonardo}
                      alt={"Leonardo Bertiola"}
                      className="size-2/4 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{"Leonardo Bertiola"}</p>
                    <p className="text-sm text-gray-500">{"leonardo@nlh.cl"}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img
                src={aboutBg}
                alt="Construction team"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('landing.contact.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('landing.contact.name')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('landing.contact.email')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('landing.contact.message')}
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all"
                >
                  {t('landing.contact.submit')}
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('landing.contact.phone')}</h3>
                  <p className="text-gray-600">{t('landing.contact.phone.number')}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 w-12 h-12 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{t('landing.contact.email')}</h3>
                  <p className="text-gray-600">{t('landing.contact.email.address')}</p>
                </div>
              </div>

              <div className="flex items-center pt-64 space-x-4 space-y-2">
                <div className="rounded-full flex items-center justify-center" style={{ marginTop: '10px' }}>
                  <a href={t('landing.contact.whatsapp.link')+encodedMessage} target="_blank" rel="noopener noreferrer"><img
                      src={whatsapp}
                      alt="WhatsApp"
                      className="h-12 w-12" /></a>
                </div>
                <div className="rounded-xl flex items-center justify-center">
                 <a href="https://www.instagram.com/nlhnosotroslohacemos/" target="_blank" rel="noopener noreferrer"> <img
                      src={instagram}
                      alt="Instagram"
                      className="h-12 w-12" /></a>
                </div>
                <div className="rounded-xl flex items-center justify-center">
                   <a href="https://facebook.com/nlhchile" target="_blank" rel="noopener noreferrer">  <img
                      src={facebook}
                      alt="Facebook"
                      className="h-12 w-12" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img src={logo} alt="NLH Logo" className="h-12 w-12 ml-2" />
            </div>
            <p className="text-gray-400">
              © 2025 NLH (Nosotros Lo Hacemos). All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <PreviewModal isOpen={isAdvModalOpen} title={t('landing.services.subtitle1')} imageSrc={management} textDescription={t('landing.services.description1ext')} onClose={() => setIsAdvModalOpen(false)} />
      <PreviewModal isOpen={isNewModalOpen} title={t('landing.services.subtitle2')} imageSrc={development} textDescription={t('landing.services.description2')} onClose={() => setIsNewModalOpen(false)} />
      <PreviewModal isOpen={isRemodelingModalOpen} title={t('landing.services.subtitle3')} imageSrc={construction} textDescription={t('landing.services.description3')} onClose={() => setIsRemodelingModalOpen(false)} />
      <PreviewModal isOpen={isOnlineModalOpen} title={t('landing.services.subtitle4')} imageSrc={onlinePlatform} textDescription={t('landing.services.description4')} onClose={() => setIsOnlineModalOpen(false)} />
      <PreviewModal isOpen={isTenderModalOpen} title={t('landing.services.subtitle5')} imageSrc={badget} textDescription={t('landing.services.description5')} onClose={() => setIsTenderModalOpen(false)} />
      <PreviewModal isOpen={isControlModalOpen} title={t('landing.services.subtitle6')} imageSrc={control} textDescription={t('landing.services.description6')} onClose={() => setIsControlModalOpen(false)} />
    </div>
  );
};

export default LandingPage;