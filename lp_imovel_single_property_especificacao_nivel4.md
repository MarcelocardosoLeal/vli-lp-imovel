# Landing Page de Imóvel — Especificação Nível 4

## Finalidade do documento
Este documento define, com regras rígidas e separação de camadas, como um agente deve construir uma landing page mobile-first para divulgação de **um único imóvel ou um único empreendimento específico**, usando somente dados fornecidos. O objetivo é reduzir ao máximo ambiguidade, improviso e mistura entre conteúdo visível, estrutura HTML e SEO invisível.

A página deve ser pensada para:
- tráfego pago via Google Ads;
- SEO orgânico;
- leitura eficiente por mecanismos de busca, agentes de IA e interfaces de busca por voz;
- conversão em lead no mobile.

---

# 1. Regra mestra

O agente deve seguir esta ordem lógica:
1. validar os dados de entrada;
2. mapear cada dado para a seção correta;
3. construir a hierarquia visual da página;
4. aplicar SEO visível sem comprometer a clareza;
5. aplicar SEO estrutural no HTML;
6. aplicar dados estruturados invisíveis no código;
7. revisar consistência entre seções, metadados e CTA.

O agente **não pode** usar criatividade para inventar dados técnicos do imóvel.
A criatividade só pode existir em:
- composição visual;
- microdecisões de layout;
- distribuição estética;
- intensidade visual da página;
- ritmo entre seções.

---

# 2. Separação obrigatória de camadas

## 2.1 Camada A — Conteúdo visível ao usuário
É tudo o que aparece na interface.
Exemplos:
- título principal;
- subtítulos;
- ficha técnica;
- galeria;
- diferenciais;
- localização;
- FAQ visível;
- CTAs;
- formulário.

## 2.2 Camada B — Estrutura HTML e semântica
É a organização do código que sustenta a página.
Exemplos:
- `title`;
- `meta description`;
- `h1`, `h2`, `h3`;
- `alt` de imagens;
- landmarks semânticas (`header`, `main`, `section`, `footer`);
- ordem correta do DOM;
- links, botões e formulários com marcação adequada.

## 2.3 Camada C — SEO invisível / dados estruturados
É conteúdo voltado para mecanismos, não para interface visual.
Exemplos:
- JSON-LD;
- `FAQPage`;
- `Product` adaptado à oferta imobiliária quando fizer sentido;
- `RealEstateAgent` ou `Organization`/`LocalBusiness` para a empresa anunciante, quando houver dados suficientes;
- metadados Open Graph e Twitter Card.

## 2.4 Regra crítica de isolamento
Nada da Camada C deve ser exibido visualmente.
Nada da Camada B deve ser apresentado como bloco de texto ao usuário.
Nada da Camada A pode depender exclusivamente de metadado invisível para existir.

---

# 3. Proibições rígidas

O agente não deve:
- exibir JSON-LD na interface;
- criar atributos do imóvel não informados;
- inferir quantidade de quartos, suítes, vagas, banheiros ou metragem;
- inventar preço, condição comercial ou prazo de entrega;
- transformar ausência de dado em promessa vaga;
- trocar a ordem das seções obrigatórias sem motivo técnico forte;
- usar textos genéricos longos para substituir falta de dados objetivos;
- esconder a ficha técnica em accordion profundo ou seção obscura;
- fazer uma página só emocional e deixar o produto pouco identificável;
- tratar um imóvel único como se fosse página institucional de construtora;
- repetir a mesma informação sem função de escaneabilidade ou reforço semântico;
- colocar imagens sem `alt`;
- deixar CTA apenas no rodapé;
- usar headings fora de ordem lógica;
- usar blocos inteiros em imagem sem equivalente textual relevante;
- depender de texto embutido em imagem para informações importantes.

---

# 4. Dados de entrada obrigatórios

## 4.1 Identificação do imóvel
- `nome_imovel`
- `tipo_imovel`
- `bairro`
- `cidade`

## 4.2 Características principais
- `dormitorios`
- `suites` (se não houver, informar 0 ou nulo validado)
- `banheiros`
- `vagas`
- `area_m2_min`
- `area_m2_max`

## 4.3 Status e origem
- `status_imovel` ou `status_obra`
- `nome_construtora_ou_anunciante`

## 4.4 Mídia
- `imagem_hero`
- `imagens_galeria[]`
- `plantas[]` (se existirem)
- `video_tour` (opcional)

## 4.5 Diferenciais
- `lista_diferenciais[]`

## 4.6 Localização
- `endereco` ou `coordenadas_mapa`
- `pontos_interesse[]` (opcional, mas recomendado)

## 4.7 Comercial
- `preco` (opcional)
- `condicao_pagamento` (opcional)
- `texto_comercial_curto` (opcional, se fornecido por quem fizer a copy)

## 4.8 Captação
- `telefone`
- `email` (opcional)
- `whatsapp` (opcional, mas recomendado)
- `nome_empresa`

## 4.9 FAQ factual
- `faq[]` contendo perguntas e respostas baseadas em dados reais.
Se o FAQ não for fornecido, o agente pode gerar perguntas apenas a partir de dados objetivos existentes.

---

# 5. Validação pré-render obrigatória

Antes de montar a página, o agente deve validar:

## 5.1 Mínimo absoluto para gerar a LP
Só gerar a LP se existirem:
- `nome_imovel`
- `tipo_imovel`
- `bairro`
- `cidade`
- `imagem_hero`
- pelo menos 1 CTA funcional
- pelo menos 1 dado técnico relevante entre dormitórios, vagas, banheiros ou metragem

## 5.2 Mínimo recomendado para gerar versão completa
- galeria com pelo menos 5 imagens;
- ficha técnica com os principais dados preenchidos;
- mapa ou referência geográfica utilizável;
- bloco de diferenciais com pelo menos 4 itens úteis;
- formulário funcional.

## 5.3 Regra de ausência de dado
Se algum dado estiver ausente:
- não inventar;
- omitir o item específico;
- manter a seção, desde que ainda faça sentido;
- não usar placeholders visíveis do tipo “a definir”, “em breve”, “consulte”.

---

# 6. Estrutura obrigatória da landing page

A ordem abaixo é a ordem padrão obrigatória.
Mudanças só são permitidas se melhorarem usabilidade mobile sem afetar clareza do produto.

## Seção 1 — Hero principal
### Objetivo
Identificar imediatamente o imóvel e capturar atenção.

### Deve conter
- imagem hero;
- nome do imóvel;
- tipo do imóvel;
- localização resumida: bairro + cidade;
- CTA principal;
- opcionalmente, um resumo comercial curto fornecido pela copy.

### Deve ser visível
- acima da dobra no mobile: título principal e CTA.

### SEO visível
- `h1` deve conter o principal termo de intenção, preferencialmente combinando tipo do imóvel + localização + nome do imóvel quando isso não ficar artificial.

### Mapeamento de dados
- `nome_imovel` → título principal;
- `tipo_imovel` → título ou subtítulo;
- `bairro` e `cidade` → subtítulo/localização;
- `imagem_hero` → imagem principal.

---

## Seção 2 — Resumo técnico escaneável
### Objetivo
Fazer o usuário entender rapidamente o produto sem ler bloco longo.

### Deve conter
- dormitórios;
- suítes;
- banheiros;
- vagas;
- metragem mínima e máxima;
- tipo do imóvel.

### Formato obrigatório
- cards curtos, lista com ícones ou grade simples.

### Regra
A leitura dessa seção deve funcionar em 3 a 5 segundos.

### Mapeamento de dados
- `dormitorios` → item técnico;
- `suites` → item técnico;
- `banheiros` → item técnico;
- `vagas` → item técnico;
- `area_m2_min` e `area_m2_max` → item técnico;
- `tipo_imovel` → reforço de contexto.

---

## Seção 3 — Apresentação visual / galeria
### Objetivo
Aumentar desejo, tangibilizar o imóvel e sustentar percepção de valor.

### Deve conter
- imagens internas;
- imagens externas;
- áreas comuns, se existirem;
- fachada;
- lifestyle, se fornecido.

### Formato
- slider, grid ou combinação dos dois;
- priorizar imagens otimizadas e navegação touch.

### Regra de ordenação recomendada
1. imagem hero replicada ou correlata;
2. fachada;
3. sala/área social;
4. cozinha;
5. quartos;
6. banheiros;
7. varanda/lazer;
8. diferenciais externos.

### SEO estrutural
Todas as imagens precisam de `alt` descritivo e natural, sem stuffing.

---

## Seção 4 — Diferenciais do imóvel
### Objetivo
Transformar atributos em leitura rápida e valorização do produto.

### Deve conter
- lista de diferenciais reais fornecidos.

### Formato obrigatório
- grade com ícones ou lista modular;
- cada item curto, claro e escaneável.

### Exemplos de campo
- piscina;
- academia;
- varanda gourmet;
- rooftop;
- coworking;
- portaria;
- segurança;
- área gourmet;
- pet place;
- proximidade estratégica.

### Regra
Não converter ausência de diferencial em texto genérico.

---

## Seção 5 — Plantas
### Objetivo
Dar compreensão espacial e técnica.

### Deve conter
- plantas disponíveis;
- identificação por metragem ou tipologia, se fornecida.

### Formato obrigatório
- exibição clara;
- possibilidade de ampliar;
- legenda quando houver dado confiável para isso.

### Regra
Se não existirem plantas, omitir a seção inteira.

---

## Seção 6 — Ficha técnica completa
### Objetivo
Centralizar a leitura factual e servir como referência objetiva para usuário, mecanismos e IA.

### Deve conter
- tipo do imóvel;
- dormitórios;
- suítes;
- banheiros;
- vagas;
- área mínima;
- área máxima;
- status;
- nome da construtora/anunciante.

### Formato obrigatório
- lista vertical ou tabela simples;
- não usar texto corrido.

### Regra de prioridade
Essa seção não pode ficar escondida demais. Deve aparecer antes da localização.

---

## Seção 7 — Localização
### Objetivo
Ancorar decisão de compra e reforçar relevância geográfica.

### Deve conter
- bairro;
- cidade;
- mapa incorporado ou bloco visual de localização;
- lista de pontos próximos, se houver.

### Formato recomendado
- mapa + lista;
- mapa + texto de apoio curto;
- blocos de proximidade com ícones.

### Regra
Sempre que possível, usar linguagem natural do tipo “localizado em”, “próximo a”, “perto de”, pois isso ajuda leitura humana e busca conversacional.

---

## Seção 8 — FAQ factual
### Objetivo
Atender intenção informacional, reforçar leitura por IA, busca por voz e featured snippets.

### Deve conter
Perguntas e respostas curtas baseadas em fatos do imóvel.

### Tipos de pergunta recomendados
- Quantos quartos o imóvel possui?
- Qual a metragem do imóvel?
- O imóvel tem vagas de garagem?
- Onde o imóvel está localizado?
- Quais são os diferenciais do imóvel?
- O imóvel está pronto, em obras ou em lançamento?

### Formato obrigatório
- pergunta objetiva;
- resposta objetiva com 1 a 3 frases curtas;
- sem copy exagerada.

### Regra crítica
Não responder perguntas sem base factual.

---

## Seção 9 — Bloco comercial
### Objetivo
Informar condição de entrada comercial quando houver dados.

### Deve conter, se disponível
- preço;
- faixa de preço;
- condição comercial;
- chamada para contato.

### Regra
Se não houver preço, a seção pode existir apenas como ponte de conversão, sem inventar número.

---

## Seção 10 — Captação principal
### Objetivo
Converter visita em lead.

### Deve conter
- formulário com nome e telefone como mínimo;
- email opcional;
- CTA textual claro;
- opcionalmente botão de WhatsApp.

### Regra de UX
- formulário curto;
- CTA forte;
- boa área clicável no mobile;
- confirmação visual de envio.

---

## Seção 11 — Reforço final e CTA
### Objetivo
Fechar leitura com reforço do produto e nova ação.

### Deve conter
- CTA repetido;
- um resumo final curto baseado no imóvel;
- acesso rápido ao contato.

### Regra
CTA final não substitui os anteriores. É reforço, não única oportunidade.

---

## Seção 12 — Rodapé
### Objetivo
Fechar com confiança institucional.

### Deve conter
- nome da empresa/anunciante;
- telefone;
- email, se houver;
- links úteis, se existirem;
- política de privacidade se houver coleta de dados.

---

# 7. Mapeamento campo → seção

## 7.1 Campos usados em múltiplas seções
- `nome_imovel` → hero, title, Open Graph, FAQ contextual;
- `tipo_imovel` → hero, resumo técnico, ficha técnica, title, schema;
- `bairro` → hero, localização, title, meta description, schema;
- `cidade` → hero, localização, title, meta description, schema;
- `dormitorios` → resumo técnico, ficha técnica, FAQ, schema quando aplicável;
- `suites` → resumo técnico, ficha técnica;
- `banheiros` → resumo técnico, ficha técnica;
- `vagas` → resumo técnico, ficha técnica, FAQ;
- `area_m2_min` e `area_m2_max` → resumo técnico, ficha técnica, FAQ, schema;
- `lista_diferenciais[]` → diferenciais, FAQ, meta description se pertinente;
- `imagem_hero` → hero, Open Graph;
- `imagens_galeria[]` → galeria;
- `plantas[]` → plantas;
- `status_imovel` → ficha técnica, FAQ, schema se suportado;
- `nome_construtora_ou_anunciante` → ficha técnica, rodapé, schema organizacional;
- `endereco` / `coordenadas_mapa` → localização, schema;
- `pontos_interesse[]` → localização, FAQ contextual;
- `preco` → bloco comercial, schema de oferta se for exposto;
- `telefone` / `whatsapp` → CTA, formulário, rodapé.

## 7.2 Campos que não devem aparecer no hero técnico
- FAQ completo;
- ficha técnica completa;
- políticas;
- blocos de texto longos.

## 7.3 Campos que não devem ficar só no código
- dormitórios;
- vagas;
- metragem;
- tipo do imóvel;
- localização principal.

Esses precisam existir visualmente na LP.

---

# 8. Regras de construção visual e UX

## 8.1 Mobile-first real
A página deve ser desenhada primeiro para largura móvel.
Prioridades:
- carregamento rápido;
- leitura com polegar;
- CTA fácil de alcançar;
- blocos curtos;
- densidade visual controlada.

## 8.2 Ritmo visual recomendado
- hero forte;
- dado técnico rápido;
- impacto visual;
- diferenciais;
- prova técnica;
- localização;
- FAQ;
- conversão.

## 8.3 Distribuição de CTA
Deve haver CTA em pelo menos estes pontos:
- hero;
- após galeria ou diferenciais;
- após ficha técnica/localização;
- final da página.

## 8.4 Escaneabilidade
Priorizar:
- listas;
- cards;
- ícones úteis;
- espaçamento generoso;
- parágrafos curtos.

## 8.5 Legibilidade
- contraste forte;
- tipografia limpa;
- evitar textos longos sobre imagens;
- evitar excesso de sobreposição.

---

# 9. SEO visível — o que deve estar na interface

## 9.1 Headings
- 1 único `h1` na página;
- `h2` para cada seção principal;
- `h3` apenas para subdivisões internas.

## 9.2 Texto visível com valor semântico
A interface deve deixar claro:
- que imóvel é esse;
- onde está localizado;
- principais atributos;
- quais diferenciais possui;
- como entrar em contato.

## 9.3 FAQ visível
O FAQ deve aparecer de forma legível na página. Não deve existir apenas no schema invisível.

## 9.4 Linguagem conversacional útil para voz
As respostas da FAQ e alguns blocos descritivos devem ser fáceis de ler em voz alta.
Exemplo de padrão ideal de frase:
- “O imóvel possui 3 dormitórios, 2 banheiros e 2 vagas de garagem.”

---

# 10. SEO estrutural — o que deve estar no HTML

## 10.1 Title tag
Modelo recomendado:
`[tipo_imovel] à venda em [bairro], [cidade] | [nome_imovel]`

Se o foco for empreendimento novo, pode usar:
`[nome_imovel] — [tipo_imovel] em [bairro], [cidade]`

## 10.2 Meta description
Deve resumir:
- tipo do imóvel;
- localização;
- 2 ou 3 atributos-chave;
- CTA implícito de descoberta.

## 10.3 URL slug
Curta, limpa e sem stopwords desnecessárias.
Modelo sugerido:
`/imovel/[tipo]-[bairro]-[cidade]-[nome]`

## 10.4 Alt text das imagens
Todos os `alt` devem ser descritivos e naturais.
Modelos úteis:
- `fachada do empreendimento [nome_imovel] em [bairro]`;
- `sala do [tipo_imovel] no [nome_imovel]`;
- `planta do imóvel com [metragem] m² em [bairro]`.

## 10.5 Semântica HTML
A página deve usar:
- `header`
- `main`
- `section`
- `footer`
- listas reais quando forem listas;
- botões reais quando forem ações.

## 10.6 Open Graph / compartilhamento
Implementar pelo menos:
- `og:title`
- `og:description`
- `og:image`
- `og:type`
- `og:url`

---

# 11. SEO invisível — dados estruturados

## 11.1 Regra geral
Usar apenas schemas compatíveis com os dados disponíveis.
Nunca preencher propriedade inventada.

## 11.2 Schema organizacional
Implementar `Organization` ou `LocalBusiness` quando houver:
- nome da empresa;
- telefone;
- email ou URL;
- endereço, se aplicável.

## 11.3 Schema de FAQ
Implementar `FAQPage` se o FAQ estiver visível na página.
As perguntas do schema devem ser as mesmas da interface.

## 11.4 Schema do imóvel/oferta
Quando não houver tipo padronizado perfeito, usar estrutura compatível e conservadora.
O mais seguro costuma ser:
- `Product` com descrição factual do imóvel e `offers` quando houver preço;
- complementar com `Place`/`PostalAddress` quando a implementação estiver madura.

Campos que podem entrar, se existirem:
- `name`
- `description`
- `image`
- `brand` ou organização relacionada
- `offers.price`
- `offers.priceCurrency`
- `address`
- `floorSize` ou campo equivalente aplicável

## 11.5 Regra de coerência
O que estiver no schema deve existir também, de forma coerente, no conteúdo visível.

---

# 12. SEO para busca por voz e agentes de IA

## 12.1 Objetivo
Ajudar mecanismos conversacionais a extrair respostas diretas.

## 12.2 Regras obrigatórias
- usar perguntas reais que um usuário faria;
- responder com frases curtas e completas;
- repetir os principais atributos em blocos diferentes, mas sem excesso;
- usar listas e estruturas claras;
- evitar metáforas, floreios e abstrações onde a informação factual for mais importante.

## 12.3 Pontos que ajudam IA e voz
- FAQ factual;
- ficha técnica legível;
- localização clara;
- headings explícitos;
- title e meta coerentes;
- schema consistente;
- linguagem natural com baixo ruído.

---

# 13. Performance técnica obrigatória

## 13.1 Requisitos principais
- HTML leve;
- CSS enxuto;
- JavaScript mínimo e justificado;
- imagens comprimidas;
- lazy loading em galerias;
- fonte com estratégia de carregamento eficiente;
- evitar bibliotecas pesadas sem necessidade.

## 13.2 Prioridades de carregamento
Carregar primeiro:
- hero;
- título;
- CTA;
- resumo técnico.

Galeria secundária pode ser adiada via lazy loading.

## 13.3 Core Web Vitals
A implementação deve visar boa experiência de carregamento, interação e estabilidade visual. O Google trata experiência de página e Core Web Vitals como sinais relevantes para busca. citeturn0search0turn0search1

---

# 14. Critérios mínimos de qualidade para Google Ads e SEO

## 14.1 A página deve deixar claro
- qual é o imóvel;
- onde ele está;
- o que ele oferece;
- como o usuário pode agir.

## 14.2 O conteúdo da LP deve ser coerente com o tráfego
O anúncio e a página de destino precisam ser consistentes entre si. O Google Ads avalia a experiência no destino, não apenas o texto do anúncio. citeturn0search2turn0search3

## 14.3 Transparência factual
Informações relevantes sobre a oferta não devem ficar excessivamente ocultas. As políticas do Google exigem transparência e boa experiência em anúncios e destinos. citeturn0search2turn0search4

---

# 15. Checklist final de saída do agente

Antes de considerar a LP pronta, o agente deve verificar:

## Estrutura
- [ ] Existe hero com identificação clara do imóvel
- [ ] Existe resumo técnico escaneável
- [ ] Existe galeria funcional
- [ ] Existe bloco de diferenciais
- [ ] Existe ficha técnica completa
- [ ] Existe localização
- [ ] Existe FAQ factual
- [ ] Existe formulário e CTA repetido
- [ ] Existe rodapé institucional

## SEO visível
- [ ] Há um único H1
- [ ] Headings seguem ordem lógica
- [ ] FAQ está visível
- [ ] Dados centrais do imóvel estão visíveis

## SEO estrutural
- [ ] Title definido corretamente
- [ ] Meta description definida
- [ ] Alt em todas as imagens
- [ ] URL limpa
- [ ] Open Graph implementado

## SEO invisível
- [ ] FAQPage implementado se FAQ existir
- [ ] Schema organizacional implementado se houver dados
- [ ] Schema de oferta/produto só usa dados reais
- [ ] Nada do schema aparece visualmente

## UX e mobile
- [ ] CTA está acima da dobra
- [ ] Botões são clicáveis no mobile
- [ ] Formulário é curto
- [ ] A página carrega rápido
- [ ] Não há blocos excessivamente densos

## Consistência
- [ ] Nenhum dado foi inventado
- [ ] Os dados repetidos são coerentes entre hero, ficha, FAQ e schema
- [ ] O anúncio pode ser derivado da LP sem conflito factual

---

# 16. Instrução final para o agente executor

Construa a landing page como página de alta conversão para um único imóvel, usando o padrão visual premium de mercado, mas com clareza técnica superior. Priorize mobile, velocidade, escaneabilidade e consistência factual. Use o máximo possível de dados reais do imóvel. Onde não houver dados, omita sem improvisar. Mantenha separação absoluta entre conteúdo visível, estrutura HTML e SEO invisível.
