
import { Bell, Search, ShoppingBag, Users } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const features = [
  {
    icon: Search,
    title: "Preços em Tempo Real",
    description: "Acompanhe os preços dos produtos em diferentes mercados da sua região.",
  },
  {
    icon: Bell,
    title: "Alertas de Preço",
    description: "Receba notificações quando os produtos da sua lista atingirem o preço desejado.",
  },
  {
    icon: Users,
    title: "Comunidade Ativa",
    description: "Compartilhe e receba informações atualizadas de preços da nossa comunidade.",
  },
  {
    icon: ShoppingBag,
    title: "Economia Garantida",
    description: "Compare preços e economize em suas compras do mercado.",
  },
];

const Features = () => {
  return (
    <section id="funcionalidades" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Funcionalidades Principais
          </h2>
          <p className="text-xl text-gray-600">
            Descubra como o SmartPreço pode te ajudar a economizar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="border-none shadow-lg">
              <CardContent className="pt-6">
                <div className="rounded-full bg-brand-green/10 w-12 h-12 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-brand-green" />
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

export default Features;
