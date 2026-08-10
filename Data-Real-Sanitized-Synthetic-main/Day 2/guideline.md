# Day 2 — Annotation Guideline & Labelling Discipline Spec

## 1. Overview & Purpose
This guideline serves as the single source of truth for annotating user voice/text utterances for the AI Router. The goal of this spec is to eliminate **"labelling on vibes"** and achieve high inter-annotator agreement (reproducibility). 

Every intent in the schema is defined by four required components:
1. **One-Line Definition**
2. **Positive Trigger Phrases**
3. **Explicit Exclusions (`NOT this when...`)**
4. **Tie-Breaker Rule** (against its nearest sibling intent)

---

## 2. Intent Specifications

### 2.1 `create_task`
- **Definition**: Schedule a reminder, alarm, to-do item, or future action for the user.
- **Positive Triggers**:
  - *"remind me to buy milk tomorrow"*
  - *"schedule a meeting with <NAME> for Monday"*
  - *"add groceries to my task list"*
  - *"wake me up at 7 AM"*
- **Explicit Exclusions (`NOT this when...`)**:
  - Asking for existing tasks or notes (`answer_question`).
  - Requesting an immediate live voice call (`place_call`).
  - Setting an immediate relative duration countdown without a named agenda (`set_timer`).
- **Tie-Breaker vs `place_call`**: If a request mentions contacting/calling a person but specifies a future time or reminder trigger (*"remind me to call mom"*), it is **`create_task`**. Only requests to initiate a call immediately right now belong to **`place_call`**.
- **Tie-Breaker vs `set_timer`**: If a duration countdown includes a named action to perform at the end (*"in 10 minutes remind me to stir soup"*), it is **`create_task`**. A pure duration countdown without a named agenda is **`set_timer`**.

---

### 2.2 `place_call`
- **Definition**: Dial or initiate a live, real-time voice call to a person or business immediately.
- **Positive Triggers**:
  - *"call <NAME> at <PHONE>"*
  - *"dial customer support on +41 44 211 11 11"*
  - *"phone Dr. Weber right now"*
- **Explicit Exclusions (`NOT this when...`)**:
  - Scheduling a call for later or asking to be reminded to call (`create_task`).
  - Saving contact information into memory (`save_memory`).
- **Tie-Breaker vs `create_task`**: Only assign **`place_call`** if the user wants the phone line dialed now. If delay or reminder syntax is present (*"schedule a call"*, *"remind me to call"*), assign **`create_task`**.

---

### 2.3 `answer_question`
- **Definition**: Query or retrieve stored user information, calendar items, system state, or general knowledge.
- **Positive Triggers**:
  - *"where is my passport stored"*
  - *"what is the current temperature in Zurich"*
  - *"what is the capital of Switzerland"*
  - *"what are my tasks for today"*
- **Explicit Exclusions (`NOT this when...`)**:
  - Saving a new fact into memory (`save_memory`).
  - Creating a new task or reminder (`create_task`).
- **Tie-Breaker vs `out_of_scope`**: If the question can be answered from stored user data or standard assistant queries, assign **`answer_question`**. If it demands external multi-step app execution beyond assistant capabilities (*"order pizza on UberEats"*), assign **`out_of_scope`**.

---

### 2.4 `save_memory`
- **Definition**: Store a static key-value fact, note, or piece of information for passive future retrieval without setting a time trigger or action item.
- **Positive Triggers**:
  - *"save note that my passport is in the top drawer"*
  - *"log that the garage entry code is 4492"*
  - *"note down that <NAME>'s email is <EMAIL>"*
- **Explicit Exclusions (`NOT this when...`)**:
  - Requesting a reminder or future to-do item (`create_task`).
  - Querying existing stored information (`answer_question`).
- **Tie-Breaker vs `create_task`**: A static fact to remember (with no scheduled action or time component) is **`save_memory`**. If the text contains an actionable to-do item or time trigger, it is **`create_task`**.

---

### 2.5 `set_timer`
- **Definition**: Start an immediate relative duration countdown timer on the user's device.
- **Positive Triggers**:
  - *"set a timer for 15 minutes"*
  - *"start 10 minute countdown"*
  - *"timer 5 minutes for baking"*
- **Explicit Exclusions (`NOT this when...`)**:
  - Setting a clock-time alarm or scheduled event (*"wake me up at 6 PM"*, `create_task`).
- **Tie-Breaker vs `create_task`**: A pure relative countdown with no named agenda (*"set a 10-minute timer"*) is **`set_timer`**. If a specific task is named at the end of the duration (*"in 10 minutes remind me to check the oven"*), it is **`create_task`**.

---

### 2.6 `out_of_scope`
- **Definition**: Requests that fall outside the supported 5 core voice assistant intents (e.g. messaging, complex financial transactions, third-party app controls).
- **Positive Triggers**:
  - *"email the invoice to <EMAIL>"*
  - *"transfer 1200 EUR to <IBAN>"*
  - *"play synthwave playlist on Spotify"*
- **Explicit Exclusions (`NOT this when...`)**:
  - Utterances matching supported core intents (`create_task`, `place_call`, `answer_question`, `save_memory`, `set_timer`).
- **Tie-Breaker vs Supported Intents**: If an utterance requires unsupported external integrations (like sending SMS/emails or performing bank transfers) in the current router schema, it MUST be classified as **`out_of_scope`**.

---

## 3. Documented Boundary Cases

Boundary cases are the core of the guideline. Below are 5 documented edge-case utterances, their assigned intent, and the exact deciding clause:

| # | Utterance | Label | Deciding Clause |
|---|---|---|---|
| 1 | `"remind me to call the dentist"` | `create_task` | **Clause 2.1 Tie-Breaker**: Mentioning a person or a call inside a scheduled reminder is `create_task`, not `place_call`. |
| 2 | `"text mom I'm running late"` | `out_of_scope` | **Clause 2.6 Tie-Breaker**: Direct text message delivery is outside the 5 core voice intents in this schema, so it defaults to `out_of_scope`. |
| 3 | `"in 10 minutes remind me to stir the soup"` | `create_task` | **Clause 2.5 Tie-Breaker**: A duration countdown with a named agenda/task is `create_task`, not a pure `set_timer`. |
| 4 | `"log that the garage entry code is 4492"` | `save_memory` | **Clause 2.4 Tie-Breaker**: Storing a passive fact with no action item or time trigger is `save_memory`, not `create_task`. |
| 5 | `"call doctor Office on +49 30 1234567 to reschedule"` | `place_call` | **Clause 2.2 Tie-Breaker**: Direct request to initiate a phone dial right now is `place_call`, even if the user mentions rescheduling as their objective. |

---

## 4. Normalisation & Near-Deduplication Spec
To prevent text drift (formatting variations like casing, whitespace, or trailing punctuation) from corrupting dataset distribution:
1. **Normalisation Pipeline**:
   $$\text{normalise}(t) = \text{strip\_punct}(\text{lowercase}(\text{collapse\_spaces}(t)))$$
2. **Near-Deduplication**:
   Rows generating identical normalised keys are deduplicated, keeping only the first clean instance.
