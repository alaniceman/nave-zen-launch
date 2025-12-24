import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const bonosFAQs: FAQItem[] = [
  {
    question: "¿Cómo funcionan los bonos de sesiones?",
    answer: (
      <>
        Compras un paquete con múltiples sesiones, recibes códigos únicos por email y los usas al reservar en nuestra{" "}
        <Link to="/agenda-nave-studio" className="text-primary hover:underline font-medium">
          agenda
        </Link>.
      </>
    ),
  },
  {
    question: "¿Puedo compartir mis códigos con otras personas?",
    answer:
      "¡Sí! Los códigos son completamente transferibles. Puedes compartirlos libremente con amigos o familiares.",
  },
  {
    question: "¿Cuánto tiempo tengo para usar mis sesiones?",
    answer:
      "La validez de tus códigos se especifica claramente al momento de la compra, pero por lo general es de un año desde la fecha de compra.",
  },
  {
    question: "¿Cómo uso mi código al reservar?",
    answer: (
      <>
        Al reservar una clase en la{" "}
        <Link to="/agenda-nave-studio" className="text-primary hover:underline font-medium">
          agenda
        </Link>
        , ingresa tu código en el <strong>mismo campo donde van los cupones de descuento</strong>. Se descontará automáticamente una sesión de tu bono.
      </>
    ),
  },
  {
    question: "¿Puedo usar un cupón de descuento al comprar?",
    answer: "Sí, durante la compra puedes aplicar un cupón de descuento si tienes uno.",
  },
  {
    question: "¿Qué pasa si no recibo el email con mis códigos?",
    answer:
      "Revisa tu carpeta de spam. Si no lo encuentras, contáctanos por WhatsApp y te ayudaremos.",
  },
  {
    question: "¿Los bonos son reembolsables?",
    answer:
      "Los bonos no son reembolsables, pero los códigos son completamente transferibles a otra persona.",
  },
];

const giftcardsFAQs: FAQItem[] = [
  {
    question: "¿Cómo funciona una Gift Card?",
    answer: (
      <>
        Compras una tarjeta de regalo, recibes los códigos por email junto con un <strong>PDF descargable</strong> que puedes enviar a quien quieras. La persona podrá reservar cuando quiera en nuestra{" "}
        <Link to="/agenda-nave-studio" className="text-primary hover:underline font-medium">
          agenda
        </Link>.
      </>
    ),
  },
  {
    question: "¿Cómo entrego la Gift Card a la persona que la recibirá?",
    answer:
      "Recibirás un email con un PDF descargable con diseño de tarjeta de regalo. Puedes descargar el PDF y enviárselo directamente a la persona, ya sea por WhatsApp, email, o impreso.",
  },
  {
    question: "¿Puedo regalar la Gift Card a quien quiera?",
    answer:
      "¡Sí! La Gift Card viene con códigos que puedes compartir libremente con la persona que quieras.",
  },
  {
    question: "¿El destinatario necesita cuenta para usarla?",
    answer: "No necesita crear cuenta. Solo debe usar el código al momento de reservar.",
  },
  {
    question: "¿Cuánto tiempo tiene validez la Gift Card?",
    answer:
      "La validez se especifica claramente al momento de la compra, pero por lo general es de un año desde la fecha de compra.",
  },
  {
    question: "¿Cómo se usa el código de la Gift Card?",
    answer: (
      <>
        Al reservar en la{" "}
        <Link to="/agenda-nave-studio" className="text-primary hover:underline font-medium">
          agenda
        </Link>
        , se ingresa el código en el <strong>mismo campo donde van los cupones de descuento</strong>. Se descontará automáticamente una sesión.
      </>
    ),
  },
  {
    question: "¿Puedo usar un cupón de descuento al comprar una Gift Card?",
    answer: "Sí, puedes aplicar un cupón de descuento durante la compra.",
  },
  {
    question: "¿Qué servicios puede usar el destinatario?",
    answer:
      "Depende del paquete: algunos son específicos para ciertos servicios, otros son multiservicio. El detalle aparece en la descripción de cada Gift Card.",
  },
  {
    question: "¿Las Gift Cards son reembolsables?",
    answer:
      "Las Gift Cards no son reembolsables, pero los códigos son completamente transferibles.",
  },
];

interface PurchaseFAQProps {
  type: "bonos" | "giftcards";
}

export function PurchaseFAQ({ type }: PurchaseFAQProps) {
  const faqs = type === "bonos" ? bonosFAQs : giftcardsFAQs;

  return (
    <section className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Preguntas Frecuentes</h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
