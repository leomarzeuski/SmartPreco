
import { CheckCircle2, Smartphone, Upload, User } from "lucide-react";

const steps = [
  {
    icon: Smartphone,
    title: "Baixe o App",
    description: "Disponível gratuitamente para iOS e Android",
  },
  {
    icon: User,
    title: "Crie sua Conta",
    description: "Cadastre-se em poucos segundos",
  },
  {
    icon: Upload,
    title: "Compartilhe Preços",
    description: "Ajude a comunidade com informações de preços",
  },
  {
    icon: CheckCircle2,
    title: "Economize",
    description: "Encontre os melhores preços na sua região",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Como Funciona
          </h2>
          <p className="text-xl text-gray-600">
            Comece a economizar em 4 passos simples
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center">
              <div className="relative">
                <div className="w-16 h-16 mx-auto rounded-full bg-brand-green/10 flex items-center justify-center mb-6">
                  <step.icon className="w-8 h-8 text-brand-green" />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-brand-green/20" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
