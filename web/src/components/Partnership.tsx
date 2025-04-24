
import { Building2, ChartBar, Users2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  {
    icon: Users2,
    title: "Mais Visibilidade",
    description: "Alcance milhares de consumidores em potencial na sua região",
  },
  {
    icon: ChartBar,
    title: "Aumente as Vendas",
    description: "Atraia mais clientes com preços competitivos",
  },
  {
    icon: Building2,
    title: "Gestão de Reputação",
    description: "Mantenha sua marca relevante no mercado digital",
  },
];

const Partnership = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Formulário enviado!",
      description: "Entraremos em contato em breve.",
    });
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  return (
    <section id="parcerias" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Programa de Parcerias
          </h2>
          <p className="text-xl text-gray-600">
            Seja um parceiro SmartPreço e potencialize seus resultados
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit) => (
            <Card 
              key={benefit.title} 
              className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="pt-6">
                <div className="rounded-full bg-brand-orange/10 w-12 h-12 flex items-center justify-center mb-6">
                  <benefit.icon className="w-6 h-6 text-brand-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="bg-brand-orange hover:bg-brand-orange/90 hover:scale-105 transition-all"
              >
                Quero ser Parceiro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Formulário de Parceria</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Input placeholder="Nome do Estabelecimento" required />
                </div>
                <div>
                  <Input type="email" placeholder="E-mail para contato" required />
                </div>
                <div>
                  <Input placeholder="Telefone" required />
                </div>
                <div>
                  <Textarea placeholder="Mensagem" required />
                </div>
                <Button type="submit" className="w-full bg-brand-orange hover:bg-brand-orange/90">
                  Enviar
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default Partnership;
