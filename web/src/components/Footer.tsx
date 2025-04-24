
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <img src="/logo.png" alt="SmartPreço" className="h-16 mb-4 bg-slate-50 p-2 rounded-sm" />
            <p className="text-gray-400">
              Economize tempo e dinheiro nas suas compras de mercado.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#funcionalidades" className="text-gray-400 hover:text-white">Funcionalidades</a></li>
              <li><a href="#como-funciona" className="text-gray-400 hover:text-white">Como Funciona</a></li>
              <li><a href="#parcerias" className="text-gray-400 hover:text-white">Parcerias</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-2">
              <li className="text-gray-400">contato@smartpreco.com</li>
              <li className="text-gray-400">0800 123 4567</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Redes Sociais</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} SmartPreço. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
