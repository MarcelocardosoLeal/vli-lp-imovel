# lp-leads — Configurador de Captura de Leads

## Referências canônicas
- **Spec seção 9:** formulário e captação de leads (campos mínimos, LGPD)
- **Spec seção 9.2:** integrações suportadas (WhatsApp, webhook, email, CRM)

## Identidade
Configura **como o lead chega no usuário** quando alguém preenche o formulário ou clica no WhatsApp.

## Opções suportadas
1. **WhatsApp direto** (mais simples)
2. **Email (mailto)** — fallback básico
3. **Webhook genérico** — POST JSON pro endpoint do usuário
4. **FormSubmit** (formsubmit.co) — sem backend, captura em email
5. **Integrações CRM** (futuro): Pipedrive, RD Station, HubSpot

## Fluxo

### Passo 1 — Escolher canal de leads
```
Como você quer receber os contatos dos interessados?

  [1] Só WhatsApp (mais simples, direto no celular)
  [2] WhatsApp + Email (mais seguro, tem histórico)
  [3] WhatsApp + meu sistema/CRM (preciso da URL do webhook)
```

### Passo 2 — Coletar número de WhatsApp (se escolheu [1], [2] ou [3])
```
Qual o seu número de WhatsApp?
(Formato: DDD + número — Ex: 11987654321)
```

**Validação obrigatória:**
- Remover espaços, traços, parênteses, +55
- Verificar: deve ter exatamente 10 ou 11 dígitos (DDD 2 dígitos + 8 ou 9 dígitos)
- Se 11 dígitos com 9: formato correto de celular ✅
- Se 10 dígitos: pode ser fixo, confirmar com usuário

Se inválido, mostrar:
```
Esse número parece estar incorreto. Use o formato:
  ✅ Correto: 11987654321 (DDD + número, sem +55)
  ❌ Não usar: +5511987654321, (11)98765-4321, 5511987654321

Qual o número correto?
```

### Passo 3 — Coletar email (se escolheu [2] ou [3])
- Para captura por email via FormSubmit:

```
Vou usar o FormSubmit para enviar os contatos para o seu email.
É grátis e não precisa de cadastro.

⚠️  IMPORTANTE: Na primeira vez que alguém preencher o formulário,
você receberá um email de confirmação da FormSubmit.
Clique no link de ativação para começar a receber os leads.
Sem isso, os contatos não chegam.

Qual email deve receber os leads?
```

### Passo 4 — Coletar webhook (se escolheu [3])
- Pedir URL do webhook
- Confirmar se é HTTPS (obrigatório)

## Saída
```json
{
  "leads": {
    "whatsapp": "+5511987654321",
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
