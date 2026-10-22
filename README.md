# 💼 Culto do Empreendedor • União da Vitória - PR
## Mural de Oração & Painel do Intercessor (Assembleia de Deus • Templo Sede)

Aplicativo desenvolvido para o **Culto do Empreendedor da Igreja Assembleia de Deus de União da Vitória - PR**, estruturado nas duas etapas:
1. **Formulário Público (index.html)**: O link personalizado com a logo oficial de alta definição do Culto do Empreendedor para enviar aos irmãos, empresários e membros, onde preenchem apenas os 3 campos e **não têm acesso** aos pedidos das outras pessoas.
2. **Painel do Administrador (admin.html)**: O mural protegido por senhas individuais onde a liderança pastoral e obreiros autorizados acessam os pedidos, intercedem e têm suas movimentações e orações registradas com data e hora.

---

## 🔐 Contas de Acesso dos Obreiros & Senhas Individuais

Cada responsável possui sua própria senha de acesso à área administrativa:

| Obreiro | Função | Senha de Acesso | Registro no Painel |
| :--- | :--- | :--- | :--- |
| **Nilzon** | Presbítero | **`0880`** | Registra login, intercessões e anotações como *Presbítero Nilzon* |
| **Moacir** | Presbítero | **`6594`** | Registra login, intercessões e anotações como *Presbítero Moacir* |
| **Arnaldo** | Pastor | **`0566`** | Registra login, intercessões e anotações como *Pastor Arnaldo* |
| **Rodolfo** | Administrador Geral | **`104832`** | Registra login, intercessões e anotações como *Rodolfo* |

### 📋 Registro de Movimentações & Auditoria em Tempo Real
- **Histórico de Acesso (Login/Logout):** Fica gravado exatamente quando cada obreiro entrou ou saiu do painel.
- **Intercessão Nominal:** Ao clicar em **"Interceder Agora 🙏"**, o sistema grava o nome do obreiro que realizou a oração e o horário exato. O cartão do pedido passa a exibir tags de quem já orou por aquela causa (ex: `✓ Pastor Arnaldo (há 5 min)`).
- **Graças Alcançadas e Anotações:** Registra qual obreiro marcou o testemunho de vitória ou atualizou anotações pastorais.
- **Botão "📋 Registro de Movimentações":** No topo do painel administrativo, permite visualizar a tabela completa de logs, com filtro por obreiro.

---

## 🎨 Logotipo Oficial em Alta Definição (HD)
- O poster oficial do **Culto do Empreendedor** (com as 3 silhuetas profissionais e tipografia nobre) está integrado diretamente como **`logo.svg`** em altíssima definição vetorial (lossless/vetor, 100% nítido em qualquer tela retina, celular ou monitor 4K).
- **Proporção Vertical (3:4):** As proporções verticais do poster foram preservadas com `aspect-ratio: 3 / 4`, cantos arredondados e borda sutil dourada, garantindo que a arte nunca fique esticada, achatada ou cortada.
- **Personalização / Fallback:** Caso queira usar o arquivo de imagem raster (.png), basta salvá-lo como **`logo.png`** na mesma pasta. O sistema possui detecção e fallback automático.

---

## 📋 Como Funciona

### 1️⃣ Parte 1: Formulário Público (`index.html`)
- **Para quem você envia:** Compartilhe este link com amigos, familiares, membros da igreja ou nas redes sociais.
- **Os 3 Campos Coletados:**
  1. **Seu Nome** (com opção "Prefiro enviar como Anônimo" e campo opcional de **Telefone / WhatsApp** com opção de marcar para **receber devocionais**);
  2. **Para quem é esta oração?** (Ex: "Por mim mesmo", "Por minha mãe Helena", ou "Deixar anônimo");
  3. **Qual é a sua oração ou propósito?** (Texto livre onde a pessoa abre o coração).
- **Privacidade Total:** A pessoa não vê o mural. Ao clicar em enviar, ela recebe uma mensagem acolhedora de confirmação com um versículo de paz e a certeza de que a causa foi entregue ao intercessor.
- **🏛️ Convite Presencial & Localização:** Opção interativa para quem desejar participar presencialmente do culto, com endereço (Rua Ipiranga, 357 — Centro, União da Vitória - PR) e rota direta no **Google Maps**.
- **🏥 Visita Presencial em Hospitais (Capelania Pastoral):** Campo exclusivo com ícone de hospital e subtítulo explicativo onde familiares e membros podem solicitar a visita de um pastor ao leito de enfermos internados.
  - **🗓️ Dia de Visitas:** As visitas aos hospitais são realizadas **exclusivamente às quartas-feiras**.
  - **Privacidade dos Telefones:** Os números de telefone pessoais dos obreiros foram removidos da tela pública para preservar a privacidade, mantendo a solicitação segura através do formulário.
- **📸 Instagram Oficial:** Botão direto com link para o perfil exclusivo **`@cultodoempreendedoruva`** (https://www.instagram.com/cultodoempreendedoruva/).

---

### 2️⃣ Parte 2: Painel Privado do Administrador (`admin.html`)
- **Acesso Individual dos Obreiros:** Protegido pelas senhas individuais (**`0880`**, **`6594`**, **`0566`**, **`104832`**).
- **Identificação do Usuário:** No topo do painel é exibido um crachá com o nome e cargo do obreiro logado no momento.
- **Mural Exclusivo:** Somente você e os obreiros autorizados têm acesso aos pedidos recebidos.
- **Filtros Temporais Exigidos:**
  - 📅 **Por Dia (Hoje)**: Mostra somente os pedidos que chegaram no dia de hoje.
  - 🗓️ **Por Semana**: Mostra os pedidos dos últimos 7 dias.
  - 📆 **Por Mês**: Mostra os pedidos dos últimos 30 dias.
  - 📋 **Todos**: Histórico completo de pedidos.
- **Recursos para o Intercessor:**
  - Botão **"Interceder Agora 🙏"**: Incrementa o contador de orações, registra qual obreiro intercedeu no log e adiciona a tag do obreiro no cartão.
  - Botão **"Graça Alcançada 🎉"**: Registra testemunhos de orações respondidas com o nome do obreiro que registrou.
  - **Anotações Pastorais**: Campo de anotação privada em cada pedido (ex: *"Orado no culto de quarta"*, *"Ligar para a pessoa"*).
  - **🖨️ Imprimir / PDF**: Gera uma lista limpa para levar para cultos, reuniões de oração ou vigílias.
  - **🏥 Gestão de Visitas Hospitalares**: Destaque com etiqueta ciano e card especial contendo dados do leito, hospital, paciente e botão direto para falar com o acompanhante no WhatsApp.
  - **Filtro Rápido no Painel**: Seleção direta por "🏥 Visitas Hospitalares" no menu de status.

---

## 🚀 Como Executar

Basta abrir os arquivos no seu navegador:
- **Para testar o formulário que você vai mandar para as pessoas:**
  - Dê um duplo clique em [index.html](file:///C:/Users/Usuario/.gemini/antigravity/scratch/oracoes-app/index.html)
- **Para acessar o seu painel de administrador:**
  - Dê um duplo clique em [admin.html](file:///C:/Users/Usuario/.gemini/antigravity/scratch/oracoes-app/admin.html) e entre com a senha de qualquer um dos obreiros:
    - Nilzon: `0880`
    - Moacir: `6594`
    - Arnaldo: `0566`
    - Rodolfo: `104832`

---

## 📁 Estrutura dos Arquivos

```text
oracoes-app/
├── index.html        # Página pública do formulário (link enviado para as pessoas)
├── pedir.js          # Lógica de validação e envio do formulário público
├── admin.html        # Painel privado do administrador (restrito com PIN)
├── admin.js          # Lógica do painel admin com filtros por Dia, Semana e Mês
├── style.css         # Estilização completa das duas telas (desktop e celular)
├── logo.svg          # Logomarca vetorial oficial do Culto do Empreendedor
├── logo.jpg          # (Opcional) Logomarca personalizada em JPG ou PNG
├── vercel.json       # Configuração de URLs limpas para deploy na Vercel
├── .gitignore        # Arquivos ignorados pelo Git
└── README.md         # Manual de instruções do sistema
```

---

## ☁️ Publicação no GitHub e Deploy no Vercel

### 1. Subir para o GitHub (Via Navegador ou Terminal)
1. Crie um novo repositório no seu GitHub (ex: `culto-do-empreendedor-oracoes`).
2. Faça o envio de todos os arquivos desta pasta (`oracoes-app`) para o repositório.

### 2. Publicar no Vercel em 1 Clique
1. Acesse **[vercel.com](https://vercel.com)** e entre com sua conta do GitHub.
2. Clique em **"Add New..."** > **"Project"**.
3. Selecione o repositório `culto-do-empreendedor-oracoes` e clique em **"Deploy"**.
4. Em menos de 1 minuto seu site estará online com link seguro HTTPS!
   - Formulário público: `https://seu-projeto.vercel.app`
   - Painel de administração: `https://seu-projeto.vercel.app/admin`

