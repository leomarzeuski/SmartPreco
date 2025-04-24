
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const faqs = [
  {
    question: "Como funciona o SmartPreço?",
    answer: "O SmartPreço é uma plataforma colaborativa onde usuários compartilham informações sobre preços de produtos em mercados. Os preços são verificados pela nossa equipe para garantir a precisão das informações.",
  },
  {
    question: "Como posso confiar nos preços mostrados?",
    answer: "Todos os preços compartilhados precisam de comprovação por foto e passam por verificação antes de serem exibidos no app. Além disso, outros usuários podem reportar preços incorretos.",
  },
  {
    question: "O aplicativo é gratuito?",
    answer: "Sim, o SmartPreço é totalmente gratuito para download e uso. Não há custos ocultos ou assinaturas necessárias.",
  },
  {
    question: "Como posso me tornar um parceiro?",
    answer: "Para se tornar um parceiro, basta entrar em contato através do formulário na seção de parcerias. Nossa equipe entrará em contato para discutir as possibilidades.",
  },
];

const FAQ = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-gray-600">
            Tire suas dúvidas sobre o SmartPreço
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
