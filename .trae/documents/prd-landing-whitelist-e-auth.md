## 1. Product Overview
Landing page no domínio principal para apresentar oferta e liberar acesso via whitelist por e-mail. Subdomínio com autenticação/login profissional para acessar o produto, sem credenciais de teste.

## 2. Core Features

### 2.1 User Roles
| Papel | Método de cadastro | Permissões principais |
|------|---------------------|-----------------------|
| Visitante | Sem cadastro | Ver landing, preços e inserir e-mail para checar whitelist |
| Usuário autorizado | Login (e-mail + senha) | Acessar área logada no subdomínio |

### 2.2 Feature Module
1. **Landing (Domínio Principal)**: proposta de valor, seção de preços, validação de whitelist por e-mail, CTA para login/acesso.
2. **Login (Subdomínio)**: autenticação profissional (entrar, criar conta, recuperar senha), estado de sessão.
3. **Área Logada (Subdomínio)**: shell do produto (layout base), confirmação de acesso, logout.

### 2.3 Page Details
| Page Name | Module Name | Feature description |
|-----------|-------------|---------------------|
| Landing (Domínio Principal) | Hero + Proposta | Comunicar benefício principal com CTA primário para “Desbloquear acesso” |
| Landing (Domínio Principal) | Preços | Exibir planos: Vitalício R$799; Grupo até 3: R$600 por pessoa |
| Landing (Domínio Principal) | Whitelist por e-mail | Capturar e-mail, validar formato, consultar whitelist e retornar: autorizado / não autorizado |
| Landing (Domínio Principal) | CTAs de conversão | Direcionar usuário autorizado para o subdomínio (login) e/ou para link de compra configurável |
| Login (Subdomínio) | Entrar | Autenticar com e-mail + senha; mostrar erros claros; lembrar sessão |
| Login (Subdomínio) | Criar conta | Permitir cadastro com e-mail + senha (somente se e-mail estiver na whitelist) |
| Login (Subdomínio) | Recuperar senha | Enviar link de redefinição por e-mail |
| Login (Subdomínio) | Remoção de testes | Remover credenciais de teste, botões “login rápido”, bypass e seeds não essenciais |
| Área Logada (Subdomínio) | Shell do app | Exibir header, estado do usuário logado e área de conteúdo principal (placeholder do produto) |
| Área Logada (Subdomínio) | Acesso | Bloquear sessão caso e-mail não esteja na whitelist (ex.: whitelist revogada) |
| Área Logada (Subdomínio) | Sair | Encerrar sessão com segurança |

## 3. Core Process
**Fluxo (Visitante → Acesso):** você entra na landing, avalia a oferta e preços, informa seu e-mail; se estiver na whitelist, você recebe CTAs para compra e para acessar o subdomínio.

**Fluxo (Usuário autorizado → Login):** você abre o subdomínio, faz login (ou cria conta, se autorizado) e acessa a área logada.

**Fluxo (Segurança):** se o sistema detectar credenciais de teste ou e-mail não autorizado, bloqueia e orienta o usuário.

```mermaid
graph TD
  A["Landing (Domínio Principal)"] --> B["Checagem de Whitelist por E-mail"]
  B -->|"Autorizado"| C["CTA: Ir para Login (Subdomínio)"]
  B -->|"Não autorizado"| D["Mensagem: Acesso restrito"]
  C --> E["Login (Subdomínio)"]
  E --> F["Área Log