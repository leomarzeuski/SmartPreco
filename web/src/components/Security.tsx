
import { Shield, Lock, Info } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const securityFeatures = [
  {
    icon: Shield,
    title: "Verificação de Preços",
    description: "Todos os preços são verificados pela nossa equipe antes de serem publicados."
  },
  {
    icon: Lock,
    title: "Dados Protegidos",
    description: "Suas informações pessoais são criptografadas e protegidas seguindo os mais altos padrões de segurança."
  },
  {
    icon: Info,
    title: "Transparência",
    description: "Sistema de reputação para usuários e histórico completo de alterações de preços."
  }
];

const Security = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Segurança e Privacidade
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {securityFeatures.map((feature, index) => (
            <Card 
              key={index}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="pt-6">
                <div className="rounded-full bg-brand-blue/10 w-12 h-12 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-brand-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Security;
