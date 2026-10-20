# 👑 Culto do Empreendedor • União da Vitória - PR
## Mural de Oração & Painel do Intercessor

Aplicativo desenvolvido para o **Culto do Empreendedor de União da Vitória - PR**, estruturado nas duas etapas:
1. **Formulário Público (index.html)**: O link personalizado com a logo oficial do evento para enviar aos irmãos e empreendedores, onde preenchem apenas os 3 campos e **não têm acesso** aos pedidos das outras pessoas.
2. **Painel do Administrador (admin.html)**: O mural protegido por PIN onde **somente você (pastor/líder/intercessor)** vê todos os pedidos recebidos, com filtros por **Dia (Hoje)**, **Semana** e **Mês**.

---

## 🎨 Logotipo Oficial
- O sistema já vem com a logomarca vetorial em alta definição em [logo.svg](file:///C:/Users/Usuario/.gemini/antigravity/scratch/oracoes-app/logo.svg).
- **Personalização com sua própria imagem:** Se você tiver a imagem exata da sua igreja ou do seu designer em arquivo `.png` ou `.jpg`, basta salvá-la dentro da pasta `C:\Users\Usuario\.gemini\antigravity\scratch\oracoes-app` com o nome **`logo.png`**. O aplicativo a detectará e substituirá automaticamente!

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
- **🏥 Visita Presencial em Hospitais (Capelania Pastoral):** Campo exclusivo com ícone de hospital e subtítulo explicativo onde familiares e membros podem solicitar a visita de um pastor ao leito de enfermos internados (perguntas: Confirmação de desejo da visita, Nome do Paciente, Hospital com seleção de hospitais de União da Vitória e Porto União, Número do Quarto/Leito/Ala e Telefone do Acompanhante).
- **📸 Instagram Oficial:** Botão direto com link para o perfil exclusivo **`@cultodoempreendedoruva`** (https://www.instagram.com/cultodoempreendedoruva/).

---

### 2️⃣ Parte 2: Painel Privado do Administrador (`admin.html`)
- **Acesso Restrito:** Protegido por PIN de segurança (o PIN padrão inicial é **`1234`**, que você pode alterar a qualquer momento nas configurações).
- **Mural Exclusivo:** Somente você tem acesso aos pedidos recebidos.
- **Filtros Temporais Exigidos:**
  - 📅 **Por Dia (Hoje)**: Mostra somente os pedidos que chegaram no dia de hoje.
  - 🗓️ **Por Semana**: Mostra os pedidos dos últimos 7 dias.
  - 📆 **Por Mês**: Mostra os pedidos dos últimos 30 dias.
  - 📋 **Todos**: Histórico completo de pedidos.
- **Recursos para o Intercessor:**
  - Botão **"Interceder Agora 🙏"**: Incrementa o contador de orações realizadas e marca o pedido como orado com toque suave de sino.
  - Botão **"Graça Alcançada 🎉"**: Registra testemunhos de orações respondidas.
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
  - Dê um duplo clique em [admin.html](file:///C:/Users/Usuario/.gemini/antigravity/scratch/oracoes-app/admin.html) e digite o PIN `1234`.

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

