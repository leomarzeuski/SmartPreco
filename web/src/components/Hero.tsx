import { ArrowRight, AppleIcon, Gamepad2 } from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <section className="pt-16 pb-16 h-auto flex items-center">
      <div className="container mx-auto px-4">
        {/* Grid que vira coluna única no mobile e 2 colunas a partir de md */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 gap-4 items-center">
          {/* Texto: sempre na primeira coluna no md+, mas no mobile podemos deixá-lo depois da imagem */}
          <div className="space-y-8 pl-2 order-2 md:order-1">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-fade-in">
              Economize tempo e dinheiro nas suas compras de mercado
            </h1>
            <p className="text-xl text-gray-600 animate-fade-in">
              Acompanhe preços em tempo real, receba alertas e compartilhe
              informações com outros usuários para fazer as melhores escolhas.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-brand-green hover:bg-brand-green/90 hover:scale-105 transition-all"
                onClick={() => (window.location.href = "#download")}
              >
                Baixar Agora
                <ArrowRight className="ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => (window.location.href = "#como-funciona")}
                className="hover:scale-105 transition-all"
              >
                Saiba Mais
              </Button>
            </div>
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="hover:scale-105 transition-all"
                onClick={() =>
                  window.open("https://apps.apple.com/app/smartpreco", "_blank")
                }
              >
                <AppleIcon className="mr-2" />
                App Store
              </Button>
              <Button
                variant="outline"
                className="hover:scale-105 transition-all"
                onClick={() =>
                  window.open(
                    "https://play.google.com/store/apps/details?id=com.smartpreco",
                    "_blank"
                  )
                }
              >
                <Gamepad2 className="mr-2" />
                Google Play
              </Button>
            </div>
          </div>

          {/* Imagem: centralizada e com largura controlada no mobile */}
          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            <img
              src="/hero-image.png"
              alt="SmartPreço App"
              className="
                hidden md:block
                animate-fade-in transition-all duration-500 hover:scale-105
                w-full
              "
            />

            <img
              src="/hero-mobile.png"
              alt="SmartPreço App Mobile"
              className="
                block md:hidden
                animate-fade-in transition-all duration-500 hover:scale-105
                w-full
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
