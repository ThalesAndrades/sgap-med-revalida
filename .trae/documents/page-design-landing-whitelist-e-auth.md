# Page Design — Landing (domínio) + App (subdomínio)

## Global Styles (desktop-first, alta performance)
- Layout base: CSS Grid (estrutura) + Flexbox (alinhamentos), espaçamentos em escala 4/8/12/16/24/32.
- Cores (persuasão/contraste):
  - Background: #0B1020 (navy profundo)
  - Surface cards: #111A33
  - Primária (CTA): #7C3AED (roxo vibrante)
  - Secundária: #22C55E (verde confirmação)
  - Texto: #E5E7EB; Muted: #94A3B8
- Tipografia: Inter (ou system-ui fallback). Escala: 14/16/20/28/40.
- Botões: raio 12px; hover com leve elevação (translateY -1px) e sombra; foco visível (outline 2px).
- Performance UX: imagens otimizadas, sem carrosséis pesados, animações curtas (150–200ms), carregar whitelist via request único.

## 1) Landing (Domínio Principal)
### Meta Information
- Title: “Acesso Vitalício — Desbloqueie com seu e-mail”
- Description: “Oferta vitalícia e grupo; acesso liberado por whitelist.”
- OG: título + descrição + imagem hero 1200x630.

### Page Structure
- Coluna central (max-width 1120px), 2 colunas no topo (texto + visual), depois seções empilhadas.

### Sections & Components
1. Top Bar
   - Logo (esquerda) + CTA “Acessar” (direita, link para subdomínio /login).
2. Hero
   - Headline forte (1 linha), subheadline curta, 2 CTAs: “Desbloquear acesso” (primário) e “Ver preços” (secundário âncora).
   - Visual: mock simples (SVG/PNG leve) com fundo degradê sutil.
3. Bloco Whitelist (foco principal)
   - Campo e-mail + botão “Verificar acesso”.
   - Estados: loading; sucesso (badge verde + CTA “Ir para login”); bloqueado (mensagem clara “Acesso restrito para este e-mail”).
   - Regras de microcopy: objetivas, sem culpa; orientar próximo passo.
4. Preços
   - 2 cards lado a lado:
     - Vitalício: R$799
     - Grupo (até 3): R$600 por pessoa
   - Cada card: bullets curtos + CTA “Comprar” (habilitado apenas quando e-mail estiver autorizado).
5. Rodapé
   - Links mínimos: Termos/Privacidade (se existirem) + contato.

## 2) Login (Subdomínio)
### Meta Information
- Title: “Entrar” | Description: “Acesse sua conta com segurança.”

### Layout
- Split layout: esquerda (benefícios/credibilidade) + direita (card de login).

### Sections & Components
1. Header minimal
   - Logo + link “Voltar para o site”.
2. Card de autenticação (max 420px)
   - Tabs/links: “Entrar” e “Criar conta”.
   - Entrar: e-mail, senha, “Esqueci minha senha”, botão primário.
   - Criar conta: e-mail, senha, confirmar senha, aviso “Somente e-mails autorizados”.
   - Erros: inline, linguagem simples.
3. Segurança/Profissionalismo
   - Sem credenciais de teste exibidas.
   - Sem auto-preenchimento de usuários demo.

## 3) Área Logada (Subdomínio)
### Meta Information
- Title: “App” | Description: “Área logada.”

### Layout
- App shell: header fixo + conteúdo central; opcional sidebar recolhível (se necessário).

### Sections & Components
1. Header
   - Nome do produto, status do usuário (e-mail), botão “Sair”.
2. Aviso de acesso
   - Se whitelist revogada: bloquear conteúdo e mostrar callout com instrução.
3. Conteúdo principal
   - Placeholder do produto (card/grid) para integrar