import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-200 py-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Tu Empresa. Todos los derechos
            reservados.
          </p>
          <p className="text-gray-600 text-sm">
            <a
              href="/terminos-y-condiciones"
              className="text-blue-500 hover:underline"
            >
              Términos y condiciones
            </a>
            &nbsp;|&nbsp;
            <a
              href="/politica-de-privacidad"
              className="text-blue-500 hover:underline"
            >
              Política de privacidad
            </a>
          </p>
        </div>

        <div className="mt-2 md:mt-0">
          <p className="text-gray-600 text-sm">
            ¿Necesitas ayuda?{" "}
            <a href="/contacto" className="text-blue-500 hover:underline">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
