
import { Card, CardContent } from "./ui/card";
import { User } from "lucide-react";

const testimonials = [
  {
    name: "Ana Silva",
    role: "Usuária",
    text: "Economizo em média 25% nas compras do mês usando o SmartPreço. É incrível poder comparar preços tão facilmente!",
  },
  {
    name: "Carlos Santos",
    role: "Usuário Premium",
    text: "Os alertas de preço são muito úteis. Já economizei muito esperando o momento certo para comprar.",
  },
  {
    name: "Maria Oliveira",
    role: "Usuária",
    text: "A comunidade é super ativa e os preços são sempre atualizados. Confio totalmente nas informações.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          O que dizem nossos usuários
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="hover:scale-105 transition-transform duration-300"
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-brand-green/10 p-2 rounded-full">
                    <User className="w-6 h-6 text-brand-green" />
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
