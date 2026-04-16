# lp-leads — Configurador de Captura de Leads

## Referências canônicas
- **Spec seção 9:** formulário e captação de leads (campos mínimos, LGPD)
- **Spec seção 9.2:** integrações suportadas (WhatsApp, webhook, email, CRM)

## Identidade
Configura **como o lead chega no usuário** quando alguém preenche o formulário ou clica no WhatsApp.

## Opções suportadas
1. **WhatsApp direto** (mais simples)
   - Pergunta: número com DDI (+55...)
   - Gera link `https://wa.me/55XXXXXXXX?text=Olá! Tenho interesse no [nome]`
2. **Email (mailto)** — fallback básico
3. **Webhook genérico** — POST JSON pro endpoint do usuário
4. **FormSubmit** (formsubmit.co) — sem backend, captura em email
5. **Integrações CRM** (futuro): Pipedrive, RD Station, HubSpot

## Fluxo
1. "Como você quer receber os leads?"
   - [a] Só WhatsApp
   - [b] WhatsApp + Email (mais seguro)
   - [c] WhatsApp + meu CRM/webhook (preciso da URL)
2. Coleta dados conforme escolha
3. Configura `lp.json.leads`
4. Injeta no formulário + nos botões CTA

## Saída
```json
{
  "leads": {
    "whatsapp": "+5511999999999",
    "email": "vendas@imob.com.br",
    "webhook": "https://hooks.zapier.com/...",
    "lgpdConsent": true,
    "redirectThanks": "/obrigado.html"
  }
}
```

## LGPD
- Sempre adiciona checkbox "Concordo com tratamento dos meus dados conforme [Política de Privacidade]"
- Gera `politica-privacidade.html` template (usuário customiza)

## Tom
"Vamos garantir que você não perca nenhuma visita. Quer receber só pelo WhatsApp ou também por email pra ter histórico?"
