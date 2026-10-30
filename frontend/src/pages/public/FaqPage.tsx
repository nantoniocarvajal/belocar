const FAQS = [
  {
    question: '¿Puedo comprar solo una botella?',
    answer: 'No, en Distribuidora Belocar la venta es exclusivamente por caja cerrada, no se venden botellas sueltas.',
  },
  {
    question: '¿Los precios están publicados en el sitio?',
    answer:
      'No. Los precios varían según la cantidad de cajas solicitadas y se entregan por WhatsApp una vez que envías tu cotización.',
  },
  {
    question: '¿Cómo pago mi pedido?',
    answer: 'El pago se coordina por transferencia bancaria, una vez confirmado el precio final por WhatsApp.',
  },
  {
    question: '¿Tienen despacho a domicilio?',
    answer:
      'Sí. Existen zonas con despacho gratuito y otras donde se cotiza el valor del transporte según tu comuna. También puedes retirar tu pedido.',
  },
  {
    question: '¿Cualquier persona puede comprar?',
    answer:
      'La venta de bebidas alcohólicas es exclusiva para mayores de 18 años. Nos reservamos el derecho de solicitar confirmación de edad al coordinar la entrega.',
  },
]

export function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-bold text-ink-900">Preguntas frecuentes</h1>

      <div className="mt-6 space-y-3">
        {FAQS.map((faq) => (
          <details key={faq.question} className="group rounded-lg border border-ink-100 bg-white p-4">
            <summary className="cursor-pointer list-none font-semibold text-ink-900 marker:content-none">
              {faq.question}
            </summary>
            <p className="mt-2 text-sm text-ink-600">{faq.answer}</p>
          </details>
        ))}
      </div>

      <p className="mt-8 rounded-lg bg-brand-50 p-4 text-sm font-medium text-ink-800">
        Venta de bebidas alcohólicas solo para mayores de 18 años. Prohibida su venta o entrega a
        menores de edad.
      </p>
    </div>
  )
}
