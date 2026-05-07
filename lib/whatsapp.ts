const PHONE_ID = process.env.WHATSAPP_PHONE_ID!
const WA_TOKEN = process.env.WHATSAPP_TOKEN!

export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  params: string[],
) {
  if (!PHONE_ID || !WA_TOKEN || !to) return

  const phone = to.replace(/\D/g, '')
  if (!phone) return

  const body = {
    messaging_product: 'whatsapp',
    to: phone,
    type: 'template',
    template: {
      name: templateName,
      language: { code: 'pt_BR' },
      components: [{
        type: 'body',
        parameters: params.map(p => ({ type: 'text', text: p })),
      }],
    },
  }

  const r = await fetch(`https://graph.facebook.com/v19.0/${PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WA_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!r.ok) {
    const err = await r.text()
    throw new Error(`WhatsApp API error ${r.status}: ${err}`)
  }

  return r.json()
}
