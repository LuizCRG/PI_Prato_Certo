# 🍽️ PRATO HONESTO — Documentação Completa do Produto
**Slogan:** *coma bem, sem cair em cilada*

> Documento mestre para replicar o aplicativo em outra plataforma.
> Inclui: estrutura de páginas, componentes, fluxos, banco de dados, identidade visual, regras de negócio e textos.

---

## 1. VISÃO GERAL DO PRODUTO

### 1.1 Conceito
Plataforma colaborativa de avaliação de estabelecimentos de comida do dia a dia (marmitarias, restaurantes, lanchonetes, pastelarias) com foco em **transparência, prova social e combate a "ciladas gastronômicas"**.

### 1.2 Pilares do Conceito
- ✔ Avaliações reais e verificadas (com foto obrigatória em notas baixas)
- ✔ Não é permitido apagar avaliações negativas
- ✔ Restaurantes não podem avaliar o próprio negócio
- ✔ Sugestões da comunidade passam por moderação
- ✔ Transparência total: número real de avaliações sempre visível

### 1.3 Tipos de usuário
| Tipo | Permissões |
|---|---|
| **Visitante** (não logado) | Navegar, buscar, filtrar, ver detalhes e rankings |
| **Consumidor** | Avaliar, favoritar, sugerir lugares, gerenciar perfil |
| **Estabelecimento (Business)** | Cadastrar e gerenciar perfil do negócio |
| **Admin** (futuro) | Moderar imagens e sugestões |

---

## 2. IDENTIDADE VISUAL

### 2.1 Paleta de cores (HSL)
| Token | Light | Dark | Uso |
|---|---|---|---|
| `--primary` (laranja) | `20 90% 48%` | `27 95% 60%` | Cor principal, CTAs, ratings importantes |
| `--primary-foreground` | `33 100% 96%` | `12 81% 14%` | Texto sobre primary |
| `--background` | `0 0% 96%` | `0 0% 9%` | Fundo geral |
| `--foreground` | `0 0% 9%` | `0 0% 98%` | Texto principal |
| `--card` | `0 0% 98%` | `0 0% 14%` | Fundos de cards |
| `--secondary` | `0 0% 32%` | `0 0% 45%` | Botões secundários |
| `--accent` | `47 100% 96%` | `20 91% 14%` | Destaques sutis |
| `--accent-foreground` | `37 92% 50%` | `43 96% 56%` | Estrelas (amarelo/dourado) |
| `--muted-foreground` | `0 0% 9%` | `0 0% 98%` | Texto secundário |
| `--destructive` | `0 72% 50%` | `0 84% 60%` | Erros e ratings ruins |
| `--border` | `0 0% 83%` | `0 0% 32%` | Bordas |
| `--radius` | `0.75rem` (12px) | — | Border radius padrão |

### 2.2 Tipografia
- **Sans (corpo):** Roboto
- **Serif (títulos):** Libre Caslon Text
- **Mono:** Roboto Mono

### 2.3 Sombras e radii
- `--radius`: 12px (padrão de cards)
- Sombras suaves de elevação (`shadow-sm`, `shadow-md`, `shadow-lg`)

### 2.4 Logo
- Emoji 🍽️ + "Prato Honesto" em fonte serif laranja
- Subtítulo (desktop): "coma bem, sem cair em cilada" (10px, muted)

---

## 3. ESTRUTURA DE NAVEGAÇÃO (ROTAS)

| Rota | Nome | Acesso |
|---|---|---|
| `/` | Home (Index) | Público |
| `/place/:id` | Detalhes do estabelecimento | Público |
| `/rankings` | Rankings (top lugares) | Público |
| `/login` | Entrar | Público |
| `/signup` | Criar conta | Público |
| `/dashboard` | Minha Conta | Logado |
| `*` | NotFound (404) | Público |

---

## 4. HEADER (presente em todas páginas)

- **Sticky top, fundo card com blur**
- **Esquerda:** logo 🍽️ + "Prato Honesto" (clica → `/`)
- **Direita:**
  - Botão **Rankings** (🏆 ícone Trophy → `/rankings`)
  - Se **deslogado**: botão "Entrar" (laranja, ícone User)
  - Se **logado**: 
    - "Minha Conta" (ícone LayoutDashboard → `/dashboard`)
    - "Sair" (ícone LogOut)
- **Mobile:** apenas ícones (sem texto)

---

## 5. PÁGINA HOME (`/`)

### 5.1 Hero
**Mobile:**
- Gradiente laranja suave (top → bottom)
- Centralizado: emoji 🍽️ + "Prato Honesto" + slogan
- SearchBar abaixo

**Desktop:**
- Imagem banner (foto de comida) com overlay gradiente
- Título e slogan sobrepostos centralizados (h1 4xl/5xl)

### 5.2 SearchBar
- Input com ícone 🔍 à esquerda
- Placeholder: "Buscar lugares..." (mobile) / "Buscar por nome ou tipo de comida..." (desktop)
- Altura 56px (mobile), 48px (desktop), border radius 12px

### 5.3 FilterChips

**Mobile (layout vertical):**
1. **Filtros prioritários** (grid 2 colunas, botões grandes):
   - ⭐ Mais avaliados
   - 💰 Mais baratos
2. **Botão "Todos"** (largura total)
3. **Categorias** (grid 2x2):
   - 🍱 Marmitaria
   - 🍽️ Restaurante
   - 🍔 Lanchonete
   - 🥟 Pastelaria

**Desktop:**
- Chips horizontais (categorias + ordenação)
- Selecionado: fundo laranja, texto branco

### 5.4 Grid de PlaceCards
- **Mobile:** 3 colunas, gap pequeno
- **Tablet:** 2 colunas
- **Desktop:** 3-4 colunas, gap maior
- **Estados:**
  - Loading: 9 skeletons
  - Vazio: 🍽️ + "Nenhum lugar encontrado" + "Tente ajustar os filtros"
  - Erro: "Erro ao carregar lugares"

---

## 6. CARD DO ESTABELECIMENTO (PlaceCard)

### 6.1 Estrutura visual (de cima pra baixo)
1. **Imagem** (aspect ratio 4:3 desktop, 1:1 mobile)
   - Border radius 12px no topo
   - Overlay escuro 10%
   - **Badge de preço** (canto superior direito): fundo branco, texto laranja, arredondado, exibe `$`, `$$`, `$$$` ou `$$$$`
   - Fallback: emoji da categoria centralizado se sem foto

2. **Bloco de informações** (padding interno)
   - **Linha 1 — Nome:** bold, 16-18px (desktop) / 11px (mobile), 1 linha com ellipsis, cor card-foreground
   - **Linha 2 — Avaliação (PRIORIDADE MÁXIMA):**
     - ⭐ estrela dourada
     - Nota numérica em **negrito** (ex: 4.6)
     - "(128 avaliações)" em cinza menor
     - Se nota ≥ 4.5 e total ≥ 5: badge **🔥 Muito elogiado** (laranja)
     - Se nota < 3: nota em vermelho (destructive)
   - **Linha 3 — Localização** (desktop only): 📍 Bairro
   - **Linha 4 — Categoria** (desktop only): emoji + label

### 6.2 Comportamento
- Click → `/place/:id`
- Hover (desktop): sobe 1px, sombra aumenta, imagem sofre zoom suave
- Active (mobile): scale 0.98

---

## 7. PÁGINA DE DETALHES (`/place/:id`)

### 7.1 Header da página
- **Imagem de capa** (h-48 mobile, h-72 desktop)
  - Foto do lugar ou emoji da categoria de fallback
  - Overlay gradiente (background → transparente)
- **Botão voltar** (arrow-left): canto superior esquerdo, fundo card semi-transparente, redondo

### 7.2 Card de informações (sobreposto à imagem com -mt-12)
- Categoria + emoji + price range
- **Nome** (h1, font-serif, 2xl/3xl, bold)
- **Bloco de avaliação destacado:**
  - ⭐⭐⭐⭐⭐ (size lg)
  - Nota grande em bold (text-2xl)
  - "(N avaliações)"
  - Se ≥ 4.5 e ≥ 5 reviews: 🔥 Muito elogiado
- Descrição (se existir)
- 📍 Endereço completo

### 7.3 Seção de avaliações (grid 3 colunas no desktop)
**Coluna esquerda (2/3):**
- Título: "Avaliações (N)"
- Lista de ReviewCards
- Loading: 3 skeletons
- Vazio: 💬 "Seja o primeiro a avaliar!"

**Coluna direita (1/3):**
- Se logado E não avaliou: ReviewForm
- Se logado E já avaliou: card "✅ Você já avaliou este lugar"
- Se deslogado: card 🔐 com CTA "Entrar"

---

## 8. CARD DE AVALIAÇÃO (ReviewCard)

### 8.1 Estrutura
1. **Header** (linha):
   - Avatar circular (foto real ou iniciais sobre fundo laranja)
   - Nome em bold
   - Data relativa em cinza ("há 2 dias", locale ptBR)
2. **Linha de rating:**
   - Estrelas + nota numérica em bold
   - Badge "Recomenda" (verde, ThumbsUp) ou "Não recomenda" (vermelho, ThumbsDown)
3. **Avaliações detalhadas** (se preenchidas):
   - 👨‍🍳 Comida: X/5
   - 💰 Custo-benefício: X/5
   - 🎧 Atendimento: X/5
4. **Comentário** (texto livre)
5. **Galeria de fotos** (se houver):
   - Badge "📷 Avaliação com foto" em laranja
   - Miniaturas 64x64px com border radius 8px
   - Click abre dialog modal com navegação (prev/next, contador)

---

## 9. FORMULÁRIO DE AVALIAÇÃO (ReviewForm)

Card lateral na página de detalhes. Campos:

1. **Avaliação geral *** (estrelas grandes, interactive)
   - Feedback visual abaixo:
     - 1-2 ⭐: 😞 "Experiência ruim" (vermelho)
     - 3 ⭐: 😐 "Razoável" (amarelo)
     - 4 ⭐: 😊 "Boa experiência" (verde)
     - 5 ⭐: 🤩 "Excelente!" (verde)
2. **Avaliações detalhadas** (mini star ratings):
   - Qualidade da comida
   - Custo-benefício
   - Atendimento
3. **Recomendaria?** Botões Sim (👍) / Não (👎)
4. **Upload de fotos** (PhotoUpload):
   - Máx 5 fotos, 5MB cada
   - **OBRIGATÓRIO se nota ≤ 2 ⭐** (avaliações negativas precisam de prova)
5. **Comentário** (textarea, máx 500 chars, contador)
6. Botão "Enviar avaliação"

### 9.1 Regras
- Não permite enviar sem nota
- Avaliações negativas exigem foto
- Um usuário só pode avaliar um lugar uma vez

---

## 10. PÁGINA RANKINGS (`/rankings`)

- Título: "🏆 Rankings"
- Subtítulo: "Os melhores lugares para comer, avaliados por você"
- Grid 2 colunas (desktop):
  1. ⭐ **Melhores Avaliados** (top 5 geral)
  2. 💰 **Melhor Custo-Benefício** (top 5 entre $ e $$)
  3. 🍱 **Melhores Marmitarias** (top 5 da categoria)
  4. 🍽️ **Melhores Restaurantes** (top 5 da categoria)

### 10.1 RankingCard
- Header: ícone + título
- Lista numerada (1º, 2º, 3º...) em laranja
- Cada item: emoji + nome + estrelas + nota + price range
- Click → `/place/:id`

---

## 11. AUTENTICAÇÃO

### 11.1 Login (`/login`)
- AuthForm em card centralizado:
  - Email
  - Senha (mín 6 chars)
- Link "Não tem uma conta? Criar conta"

### 11.2 Cadastro (`/signup`) — Fluxo em 2 passos
**Passo 1: AccountTypeSelector**
- 2 cards lado a lado:
  - 👤 **Consumidor**: "Quero descobrir e avaliar restaurantes..."
  - 🏪 **Estabelecimento**: "Tenho um restaurante, marmitaria..."
- Botão "Continuar"

**Passo 2: Formulário específico**

*Consumidor (ConsumerSignupForm):*
- Nome (mín 2)
- Email
- Senha (mín 6)
- Cria registro em `user_roles` com role `consumer`

*Estabelecimento (BusinessSignupForm):*
- **Dados pessoais:** Nome, Email, Senha
- **Dados do estabelecimento:** Nome do negócio, Categoria (select), Telefone (opcional)
- Cria registros em `user_roles` (`business`) + `business_profiles`

### 11.3 Validação
- Schemas Zod
- Mensagens em português

---

## 12. DASHBOARD (`/dashboard`) — Minha Conta

### 12.1 Estrutura
- Header padrão
- Título: "Minha Conta"
- **UserImpactCard** no topo (ver 12.2)
- **Tabs** (4 abas):
  1. 👤 Perfil
  2. 💬 Avaliações
  3. ❤️ Favoritos
  4. 💡 Sugestões

### 12.2 UserImpactCard
- Avatar com ícone (Award se honest contributor, Shield caso contrário)
- "Contribuidor Honesto" + badge "✨ Verificado" (se aplicável)
- Mensagem: "Você ajudou ~N pessoas a não cair em cilada!" (cálculo: `aprovadas*10 + reviews*3`)
- Stats à direita: ⭐ Avaliações | 💡 Sugestões

### 12.3 ProfileSection
- View mode: avatar (foto, emoji ou inicial) + nome + email
- Edit mode:
  - **ProfilePhotoUpload**: avatar 80x80, botão câmera, botão remover (X)
    - JPG/PNG, máx 2MB, upload bucket `avatars`
  - Input "Nome de exibição"
  - Picker de emoji (40 opções: rostos, comidas, animais, símbolos)
  - Botões Salvar / Cancelar

### 12.4 ReviewsSection
- Lista de avaliações do usuário
- Cada item: nome do lugar + comentário (line-clamp-2) + estrelas + data
- Click → `/place/:id`
- Vazio: "Você ainda não fez nenhuma avaliação."

### 12.5 FavoritesSection
- Lista de lugares favoritados
- Cada item: emoji + nome + endereço + estrelas + total reviews
- Botão lixeira para remover
- Vazio: "Você ainda não tem lugares favoritos."

### 12.6 SuggestionsSection
- Botão "+ Nova Sugestão" (abre Dialog)
- Form de sugestão:
  - Alert: "Todas as sugestões passam por análise antes de serem publicadas"
  - Nome do lugar *
  - Categoria (select)
  - **ExperienceTypeSelector** (chips multi-select):
    - 🍱 Marmita do dia
    - 🍛 Self-service
    - 🍔 Lanche rápido
    - 🥟 Pastelaria
    - 🛵 Delivery
    - 🪑 Comer no local
  - Endereço (opcional)
  - Descrição (opcional)
  - Upload de fotos (até 5)
- Lista de sugestões enviadas com badges de status:
  - 🕐 Pendente (cinza)
  - ✅ Aprovado (verde)
  - ❌ Rejeitado (vermelho)

---

## 13. BANCO DE DADOS (PostgreSQL / Supabase)

### 13.1 Enums
```sql
CREATE TYPE app_role AS ENUM ('consumer', 'business');
CREATE TYPE place_category AS ENUM ('marmitaria', 'restaurant', 'snack', 'pastelaria');
CREATE TYPE price_range AS ENUM ('$', '$$', '$$$', '$$$$');
```

### 13.2 Tabelas

**`profiles`** — perfil público do usuário
| Coluna | Tipo |
|---|---|
| id | uuid PK |
| user_id | uuid (FK auth.users) |
| display_name | text |
| avatar_url | text (URL ou emoji) |
| created_at, updated_at | timestamptz |

**`user_roles`** — papéis (separada por segurança)
| Coluna | Tipo |
|---|---|
| id | uuid PK |
| user_id | uuid |
| role | app_role |

**`business_profiles`** — perfil de estabelecimento
| Coluna | Tipo |
|---|---|
| id | uuid PK |
| user_id | uuid |
| business_name | text |
| business_category | place_category |
| phone | text? |
| photo_url | text? (logo) |
| cover_photo_url | text? |

**`places`** — estabelecimentos cadastrados
| Coluna | Tipo |
|---|---|
| id | uuid PK |
| name | text |
| description | text? |
| category | place_category |
| price_range | price_range |
| address | text |
| photo_url | text? |
| average_rating | numeric (0-5) |
| total_reviews | int |

**`reviews`** — avaliações
| Coluna | Tipo |
|---|---|
| id | uuid PK |
| place_id | uuid (FK places) |
| user_id | uuid |
| rating | int (1-5) |
| comment | text? |
| food_quality | int? (1-5) |
| cost_benefit | int? (1-5) |
| service | int? (1-5) |
| would_recommend | boolean? |
| photo_urls | text[] |
| created_at, updated_at | timestamptz |

UNIQUE (place_id, user_id) — 1 review por usuário por lugar.

**`favorites`** — favoritos do usuário
| Coluna | Tipo |
|---|---|
| id | uuid PK |
| user_id | uuid |
| place_id | uuid (FK places) |

**`suggestions`** — sugestões da comunidade
| Coluna | Tipo |
|---|---|
| id | uuid PK |
| user_id | uuid |
| place_name | text |
| category | text? |
| address | text? |
| description | text? |
| photo_urls | text[] |
| experience_types | text[] |
| status | text ('pending' / 'approved' / 'rejected') |

### 13.3 Funções
- **`has_role(user_id, role)`** SECURITY DEFINER → checa papel sem recursão
- **`search_places(search_term, category_filter, sort_by)`** → busca acento-insensível com `unaccent`
- **`get_user_impact(p_user_id)`** → retorna `{total_suggestions, approved_suggestions, total_reviews, is_honest_contributor}`
- Trigger automático para atualizar `places.average_rating` e `total_reviews` ao inserir/atualizar reviews

### 13.4 Storage Buckets
- **`avatars`** (público): fotos de perfil de usuário (JPG/PNG, 2MB)
- **`review-photos`** (público): fotos anexas a avaliações (até 5MB)

### 13.5 RLS (Row-Level Security) — princípios
- `profiles`, `places`: SELECT público
- `reviews`: SELECT público; INSERT/UPDATE só pelo próprio user_id
- **Restaurante NÃO pode avaliar próprio negócio** (validar via trigger)
- **Avaliação negativa NÃO pode ser deletada por restaurante**
- `favorites`, `suggestions`: SELECT/INSERT só pelo próprio user
- `business_profiles`: SELECT público; UPDATE só pelo dono

---

## 14. REGRAS DE NEGÓCIO

| Regra | Detalhe |
|---|---|
| **1 avaliação por usuário por lugar** | UNIQUE constraint |
| **Foto obrigatória em notas baixas** | Rating ≤ 2 → exige ao menos 1 foto |
| **Restaurantes não avaliam o próprio negócio** | Bloqueio em backend |
| **Restaurantes não apagam avaliações negativas** | Não há permissão de delete em reviews para business |
| **Sugestões passam por moderação** | Status default `pending` |
| **Badges de prova social** | 🔥 Muito elogiado: nota ≥ 4.5 e ≥ 5 reviews |
| **Notas baixas em vermelho** | nota < 3 com ≥ 1 review |
| **Contribuidor Honesto** | Badge automático calculado por `get_user_impact` |
| **Limites de upload** | Avatar: 2MB JPG/PNG; Review: até 5 fotos × 5MB |

---

## 15. STACK TÉCNICA (atual — referência)

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Estilização | Tailwind CSS v3 + shadcn/ui (Radix) |
| Routing | React Router v6 |
| Estado servidor | TanStack Query (React Query) |
| Formulários | React Hook Form + Zod |
| Backend | Supabase (PostgreSQL + Auth + Storage + Edge Functions) |
| Ícones | Lucide React |
| Datas | date-fns (locale pt-BR) |

### Equivalências para outras plataformas
- **Bubble / FlutterFlow:** mantenha as collections/tables exatamente como no schema
- **Next.js:** o roteamento direto se traduz para `app/` directory
- **Firebase:** trocar Supabase por Firestore + Auth + Storage; replicar regras de segurança

---

## 16. TEXTOS-CHAVE (copy)

| Local | Texto |
|---|---|
| Slogan | coma bem, sem cair em cilada |
| Meta description | Encontre marmitas, restaurantes e lanchonetes bem avaliados perto de você. Avaliações reais, fotos de clientes e transparência total. |
| Hero subtítulo | Coma bem, sem cair em cilada — encontre lugares bem avaliados perto de você |
| Vazio (home) | 🍽️ Nenhum lugar encontrado / Tente ajustar os filtros ou a busca |
| CTA login (detalhes) | 🔐 Entre para avaliar / Faça login para deixar sua avaliação |
| Já avaliou | ✅ Você já avaliou este lugar |
| Vazio reviews | 💬 Seja o primeiro a avaliar! |
| Aviso foto negativa | ⚠️ Para avaliações negativas, envie pelo menos uma foto como prova. |
| Aviso sugestão | Todas as sugestões passam por análise antes de serem publicadas. |
| Impact (positivo) | Você ajudou ~N pessoas a não cair em cilada! |

---

## 17. COMPONENTES REUTILIZÁVEIS — INVENTÁRIO

| Componente | Função |
|---|---|
| Header | Topo fixo (logo + nav) |
| SearchBar | Input com ícone de busca |
| FilterChips | Filtros de categoria + ordenação (responsivo) |
| PlaceCard | Card do estabelecimento na listagem |
| StarRating | Estrelas (interativas ou não, 3 tamanhos) |
| MiniStarRating | Linha label + estrelas pequenas |
| RatingFeedback | Emoji + texto colorido por nota |
| ReviewCard | Card de avaliação com galeria modal |
| ReviewForm | Formulário completo de avaliação |
| RankingCard | Lista numerada para Rankings |
| PhotoUpload | Upload múltiplo de fotos (reviews/sugestões) |
| ProfilePhotoUpload | Upload de avatar (1 foto) |
| AccountTypeSelector | Cartões consumidor/estabelecimento |
| ConsumerSignupForm / BusinessSignupForm | Formulários por tipo |
| SignupFlow | Orquestrador do cadastro |
| AuthForm | Login (form simples) |
| ProfileSection / ReviewsSection / FavoritesSection / SuggestionsSection | Abas do dashboard |
| UserImpactCard | Estatísticas do contribuidor |
| ExperienceTypeSelector | Chips multi-select de tipos de experiência |
| NavLink | Link de navegação ativo |

---

## 18. CHECKLIST PARA REPLICAR EM OUTRA PLATAFORMA

- [ ] Configurar paleta HSL e fontes (Roboto + Libre Caslon Text)
- [ ] Criar tabelas e enums conforme seção 13
- [ ] Configurar storage com 2 buckets públicos: `avatars`, `review-photos`
- [ ] Implementar autenticação (email/senha) com 2 papéis
- [ ] Implementar trigger de atualização de `average_rating`
- [ ] Implementar regras: 1 review/usuário/lugar, foto obrigatória em notas baixas
- [ ] Implementar 7 rotas (seção 3)
- [ ] Construir Header sticky com lógica logado/deslogado
- [ ] Construir Home com hero responsivo, busca, filtros e grid de cards
- [ ] Construir página de detalhes com seção de avaliações + form
- [ ] Construir Rankings com 4 categorias
- [ ] Construir fluxo de signup em 2 passos
- [ ] Construir Dashboard com 4 abas + UserImpactCard
- [ ] Configurar moderação de sugestões (status pending/approved/rejected)
- [ ] Aplicar badges visuais: 🔥 Muito elogiado, ✨ Verificado, 📷 Avaliação com foto
- [ ] Garantir mobile-first em todos os cards e formulários
- [ ] Idioma: português do Brasil (textos + locale de datas)

---

**Fim do documento.**
