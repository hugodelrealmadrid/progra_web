import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
} from 'react-icons/fa';

import logoAMC from '../assets/logo-amc.png';

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#2E3631] text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-12 px-8 py-12 md:flex-row md:items-start md:px-16">
        
        {/* Logo + Redes */}
        <div className="flex flex-col">
          <img
            src={logoAMC}
            alt="AMC"
            className="w-[180px] object-contain"
          />

          <div className="mt-8 flex items-center gap-6">
            <span className="text-3xl font-light">
              Visítanos en:
            </span>

            <div className="flex gap-6 text-2xl">
              <a href="#" className="transition hover:text-gray-300">
                <FaFacebook />
              </a>

              <a href="#" className="transition hover:text-gray-300">
                <FaLinkedin />
              </a>

              <a href="#" className="transition hover:text-gray-300">
                <FaYoutube />
              </a>

              <a href="#" className="transition hover:text-gray-300">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Menú derecho */}
        <div className="grid grid-cols-2 gap-x-24 gap-y-4 text-lg">
          
          <div className="flex flex-col gap-6">
            <Link
              to="/recursos"
              className="transition hover:text-gray-300"
            >
              Recursos
            </Link>

            <Link
              to="/contacto"
              className="transition hover:text-gray-300"
            >
              Contacto Principal
            </Link>

            <Link
              to="/metodos-ensenanza"
              className="transition hover:text-gray-300"
            >
              Métodos de Enseñanza
            </Link>

            <Link
              to="/biblioteca"
              className="transition hover:text-gray-300"
            >
              Biblioteca digital
            </Link>
          </div>

          <div className="flex flex-col gap-6">
            <Link
              to="/explorar"
              className="transition hover:text-gray-300"
            >
              Explorar
            </Link>

            <Link
              to="/especialidades"
              className="transition hover:text-gray-300"
            >
              Especialidades Secundarias
            </Link>

            <Link
              to="/clases"
              className="transition hover:text-gray-300"
            >
              Clases Colectivas
            </Link>

            <Link
              to="/inscripciones"
              className="transition hover:text-gray-300"
            >
              Inscripciones
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}