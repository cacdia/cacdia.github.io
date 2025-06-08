---
title: "Notícias da Semana"
description: "Confira os destaques da semana no universo de desenvolvimento de software, IA, cloud e ferramentas para devs."
slug: "noticias-semana-2025-06-08"
authors:
  - name: "Equipe CACDIA"
    title: "Curadoria de Conteúdo"
tags: ["notícias", "resumo semanal", "tecnologia", "desenvolvimento", "ia", "cloud"]
image: "https://i.imgur.com/exemplo.png"
hide_table_of_contents: false
---

Acompanhe os principais lançamentos, anúncios e tendências que movimentaram o cenário de tecnologia e desenvolvimento nesta primeira semana de junho de 2025.

<!-- truncate -->

### Apresentando o **ANS**: descoberta segura de agentes de IA inspirada no DNS

O **ANS** é uma estrutura — criada pelo projeto OWASP GenAI Security — para descoberta segura e independente de protocolo de agentes de IA, inspirada no DNS. Ele usa infraestrutura de chave pública (PKI) para verificar identidades de agentes, esquemas JSON estruturados para requisições/respostas e uma camada de Adaptadores de Protocolo modular que dá suporte ao Agent-to-Agent (A2A), Model Context Protocol (MCP) e Agent-Context Protocol (ACP). Entre as inovações estão: ciclo formal de registro e renovação de agentes; convenções de nomenclatura sensíveis a capacidades (**ANSNames**); assinaturas digitais com opção de provas de conhecimento zero para reforçar confiança; e um modelo de ameaças completo, via a estrutura MAESTRO em 7 camadas, que mitiga riscos como personificação, envenenamento de registro e ataques de negação de serviço. [Leia mais](https://genai.owasp.org/resource/agent-name-service-ans-for-secure-al-agent-discovery-v1-0/)



### Apresentando **Embabel**: desenvolvimento avançado de agentes de IA para aplicações Java

**Embabel** é um framework de agentes para JVM, criado por Rod Johnson (criador do Spring), que leva planejamento de ações orientado a objetivos a aplicações Java e Kotlin. Construído sobre o Spring AI e totalmente integrado ao Model Context Protocol, ele oferece abstrações de alto nível e com tipagem forte para definir agentes, combinando um algoritmo de planejamento (não baseado em LLM) com “ferramentas” reutilizáveis alimentadas por LLMs. O design do Embabel enfatiza tipagem forte, composição, testabilidade e mínimo boilerplate, permitindo criar, testar e orquestrar agentes autônomos em ambientes corporativos com poucas linhas de código. [Leia mais](https://www.infoq.com/news/2025/06/introducing-embabel-ai-agent/)



### Amazon libera o **Strands Agents SDK** de código aberto para construir agentes de IA

**Strands Agents** é o SDK open source da AWS que adota uma abordagem orientada a modelo para desenvolvimento de agentes: você define um prompt (o papel do agente), escolhe um provedor de modelo e lista as “ferramentas” externas que ele pode usar. Em tempo de execução, LLMs potentes planejam, refletem e invocam essas ferramentas em um loop iterativo, enquanto o Strands cuida da execução e do gerenciamento de contexto. Há suporte para diversos provedores de LLM (Amazon Bedrock, Anthropic, Ollama, OpenAI etc.), modos de streaming e não-streaming e escalonamento sem atrito de protótipos locais a produção em serviços AWS — facilitando a transição de prova de conceito para implantação corporativa. [Leia mais](https://www.infoq.com/news/2025/06/amazon-strands-agents-sdk/)



### Anthropic lança a família **Claude 4** e o **Claude Code**

A versão **Claude 4** inclui o Claude Opus 4 (novo líder mundial em raciocínio e código) e o Claude Sonnet 4 (sucessor eficiente e preciso). Ambos oferecem o modo beta *extended thinking*, que intercala uso de ferramentas (p. ex., busca web). O **Claude Code** está agora disponível de forma geral, possibilitando *pair-programming* integrado via GitHub Actions, VS Code e JetBrains. [Leia mais](https://www.anthropic.com/news/claude-4)



### **X** altera seus termos para proibir treinamento de modelos de IA com seu conteúdo

A X atualizou o acordo de desenvolvedores para impedir terceiros de usar publicações da plataforma para treinar ou ajustar LLMs, sinalizando que considera o conteúdo de usuários um ativo proprietário da xAI. Enquanto o acordo barra o treinamento externo, a política de privacidade ainda permite que “colaboradores” usem dados (salvo opt-out), e a X continua treinando seu próprio modelo **Grok** com o conteúdo dos usuários. [Leia mais](https://techcrunch.com/2025/06/05/x-changes-its-terms-to-bar-training-of-ai-models-using-its-content/)



### **Adobe** adiciona Agente de Suporte a Produtos para troubleshooting assistido por IA

O novo **Product Support Agent** da Adobe, construído sobre o Agent Orchestrator da Adobe Experience Platform, simplifica o gerenciamento de chamados: coleta contexto automaticamente (logs, metadados, detalhes de sessão), pré-preenche e classifica tickets, prioriza-os e fornece atualizações em tempo real na interface do AI Assistant. Futuras melhorias incluirão notificações proativas de status para reduzir acompanhamento manual. [Leia mais](https://www.infoworld.com/article/4002706/adobe-adds-product-support-agent-for-ai-assisted-troubleshooting.html)



### **Google Gemini** agora executa tarefas agendadas como um assistente

O Google lançou “ações agendadas” para assinantes Gemini AI Pro e Ultra. Usuários podem programar tarefas únicas ou recorrentes — como resumos diários de agenda ou recaps pós-evento — especificando o que e quando precisam. As tarefas são gerenciadas em uma página dedicada de configurações, oferecendo automação similar aos lembretes e ações recorrentes do ChatGPT. [Leia mais](https://www.theverge.com/news/681762/google-gemini-scheduled-actions-planned-tasks)



### **OpenAI** mantém conversas apagadas do ChatGPT devido a processo do NYT

A OpenAI revelou que deve reter indefinidamente conversas excluídas do ChatGPT por ordem judicial no processo de direitos autorais movido pelo *New York Times*, suspendendo a política padrão de exclusão em 30 dias até o fim do recurso. Acesso é restrito a uma pequena equipe jurídica auditada, e a exigência não afeta clientes Enterprise e Edu sob acordos de retenção zero. [Leia mais](https://www.theverge.com/news/681280/openai-storing-deleted-chats-nyt-lawsuit)



### Celulares **Samsung** recebem plataforma de compras por IA “estranha”

A Samsung fez parceria com a Glance AI para lançar uma plataforma de compras gerativa (opt-in) nos Galaxy via Galaxy Store. O recurso combina um aplicativo e um componente de tela de bloqueio que gera diariamente imagens de IA do usuário vestindo roupas compráveis (basta tocar para comprar) e, em algumas regiões, pode exibir anúncios ao lado de notícias e outras atualizações. [Leia mais](https://www.theverge.com/news/679541/samsung-galaxy-glance-ai-lock-screen-app)



### **JDK 25**: novidades do Java 25

A análise do InfoWorld sobre o **JDK 25** aborda 18 recursos finalizados para o próximo lançamento LTS, destacando: API de valores estáveis, concorrência estruturada, *ahead-of-time method profiling*, perfis JFR de tempo de CPU no Linux, GC Shenandoah geracional, pré-visualização de APIs criptográficas PEM-encoding, otimizações incubadas da Vector API, finalização de valores com escopo, corpos de construtor flexíveis, cabeçalhos de objeto compactos, padrões de primitivos em preview e remoção do suporte a x86 de 32 bits — todos voltados a melhorar desempenho, observabilidade e produtividade do desenvolvedor. [Leia mais](https://www.infoworld.com/article/3846172/jdk-25-the-new-features-in-java-25.html)
