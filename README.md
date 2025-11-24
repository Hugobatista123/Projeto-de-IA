# Participantes do projeto: Breno Batista, Hugo Batista Aguiar, Gabriel Bortoloti, João Victor da Silva, Lucas Furco Righetto

# IA – Tradução entre CPC e Linguagem Natural

Este projeto tem como objetivo criar um agente de IA capaz de **traduzir artigos e trechos do Código de Processo Civil (CPC)** para uma linguagem natural mais clara e simples, além de fazer o caminho inverso: **pegar frases comuns do dia a dia e transformá-las em uma redação jurídica baseada no CPC**.

O repositório oficial está aqui:  
Vc tem q colocar o seu aqui

---

# 📌 1. Arquitetura do Sistema: 

A arquitetura foi pensada para ser fácil de entender e manter:

1. **Entrada do usuário**  
   Pode ser um artigo do CPC ou uma frase comum.

2. **Pré-processamento**  
   O sistema limpa o texto, identifica números de artigos, prazos, termos jurídicos etc.

3. **Regras manuais + LLM**  
   - Existem regras básicas que mapeiam termos frequentes.  
   - Quando a regra não cobre o caso, um modelo de IA (LLM) entra para ajudar a interpretar e melhorar a tradução.

4. **Pós-processamento**  
   A saída é ajustada para ficar clara, coerente e sem erros de formatação.

5. **Retorno para o usuário**  
   Mostra o texto traduzido + avisos quando algo não estiver muito claro.

### ⚙️ Fluxo simplificado

<img width="1024" height="1536" alt="fluxo simplificado" src="https://github.com/user-attachments/assets/0cee3c50-fca7-4da3-ae6f-ae66878097e0" />

---

# 📌 2. Estratégia de Tradução (Regras + IA)

A tradução funciona em duas etapas principais:

### ✔️ **Quando a tradução é CPC → Linguagem Natural**
- O sistema usa **templates prontos** para artigos conhecidos (ex.: art. 300).
- A IA entra para **simplificar o texto**, deixar mais claro e explicar termos difíceis.

### ✔️ **Quando a tradução é Linguagem Natural → CPC**
- O sistema tenta identificar:
  - Qual artigo pode estar relacionado  
  - Se existem prazos, pedidos, contexto processual
- Se a frase for ambígua, a IA avisa e pede contexto extra.

### Exemplos de regras usadas:

- "Tutela de urgência" → Art. 300 do CPC  
- "Pedir liminar" → Relacionado à tutela provisória  
- "Tenho X dias" → Normalização de prazos  
- Detecção de termos como: sentença, recurso, parte autora, contestação

### Quando a IA é acionada
A IA entra quando:
- O texto é ambíguo  
- Não existe regra exata  
- É necessário explicar um artigo difícil  
- É preciso gerar um texto mais fluido e natural  

---

# 📌 3. Exemplos de Entrada/Saída com Análise

### **Exemplo 1 – CPC → Linguagem Natural**
**Entrada:**  
Art. 300 do CPC

**Saída:**  
“O artigo 300 diz que a tutela de urgência pode ser concedida quando houver provas iniciais do direito e risco de dano.”

**Acerto:** Tradução clara e direta.  
**Possível erro:** A IA pode adicionar detalhes além do texto original (por isso existe pós-processamento).

---

### **Exemplo 2 – Linguagem Natural → CPC**
**Entrada:**  
“Quero pedir uma liminar porque posso perder o bem.”

**Saída:**  
“Isto corresponde a um pedido de tutela provisória com base no art. 300 do CPC, já que há risco de dano.”

**Acerto:** Identificou corretamente o artigo.  
**Alerta:** O sistema orienta a incluir provas quando necessário.

---

### **Exemplo 3 – Frase ambígua**
**Entrada:**  
“Tenho 7 dias para recorrer.”

**Saída:**  
“O sistema identificou um possível prazo recursal. No entanto, existem diferentes prazos dependendo do tipo de recurso. Confirme se é recurso de apelação, agravo ou outro.”

**Acerto:** Detectou o prazo.  
**Limitação:** Precisa de contexto adicional.

---

### **Exemplo 4 – Caso sem dados suficientes**
**Entrada:**  
“O juiz pode negar se a parte não comparecer.”

**Saída:**  
“É necessário saber qual ato processual está sendo tratado (audiência? citação? depoimento?).”

**Acerto:** Não inventou a informação.  
**Limitação:** Depende de contexto.

---

# 📌 4. Limitações e Possíveis Melhorias

### **Limitações atuais**
- A IA pode “chutar” referências legais se não for bem orientada (risco de alucinação).  
- Muitos artigos do CPC ainda não têm regra própria.  
- Frases muito curtas ou vagas ficam difíceis de interpretar.  
- Não substitui análise jurídica profissional.  

### **Melhorias planejadas**
- Criar uma base maior de exemplos reais.  
- Aumentar o número de regras diretas para reduzir dependência da IA.  
- Implementar verificação automática de artigos antes de devolver ao usuário.  
- Criar um modo “explicação passo a passo”.

---

# 📌 5. Como Rodar o Projeto

1. Clone o repositório

2. Instale as dependências (Node ou Python, dependendo do arquivo principal do seu projeto).

3. Configure sua chave de API.

4. Execute:

---

# Demonstração do projeto funcionando

Link do video: https://youtu.be/ScIb9OC5bYg
