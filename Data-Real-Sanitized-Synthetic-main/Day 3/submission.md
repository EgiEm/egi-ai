# 📊 Day 3 · Daily Challenge: Measure Trust in Your Golden Set

> **Main Deliverable**: Double-label a 20-row slice of the golden set, measure inter-annotator agreement using Cohen's Kappa ($\kappa$), and adjudicate every disagreement against the annotation guideline.

---

## 📌 Part A · Double-Labelled Slice (20 Rows)

A 20-row representative slice was drawn from the Day-2 golden set and independently annotated across two separate passes (**Pass 1 / Annotator A** vs. **Pass 2 / Annotator B**) following `guideline.md`.

| ID | Sanitised Utterance | Pass 1 (Annotator A) | Pass 2 (Annotator B) | Status |
| :---: | :--- | :---: | :---: | :---: |
| **1** | Call `<NAME>` at `<PHONE>` to discuss the meeting | `place_call` | `place_call` | ✅ Match |
| **2** | Email the invoice to `<EMAIL>` right away | `out_of_scope` | `out_of_scope` | ✅ Match |
| **3** | Transfer rent payment to `<IBAN>` 7 for August | `out_of_scope` | `out_of_scope` | ✅ Match |
| **4** | Ship the package to `<ADDRESS>` tomorrow morning | `create_task` | `create_task` | ✅ Match |
| **5** | Ruf `<NAME>` unter `<PHONE>` an | `place_call` | `place_call` | ✅ Match |
| **9** | Remind me to call `<NAME>` at `<EMAIL>` tomorrow | `create_task` | `place_call` | ❌ **Disagreement** |
| **11** | Send a text message to `<PHONE>` saying I will be late | `out_of_scope` | `out_of_scope` | ✅ Match |
| **12** | Save note that my passport number is stored at `<ADDRESS>` | `save_memory` | `save_memory` | ✅ Match |
| **13** | Book a haircut appointment with `<NAME>` at `<EMAIL>` for Friday | `create_task` | `create_task` | ✅ Match |
| **14** | Contact customer support at `<EMAIL>` regarding issue | `out_of_scope` | `place_call` | ❌ **Disagreement** |
| **15** | Remind me to buy milk on the way home | `create_task` | `create_task` | ✅ Match |
| **16** | Set a timer for 15 minutes for baking | `set_timer` | `set_timer` | ✅ Match |
| **17** | What is the capital of Switzerland and its population | `answer_question` | `answer_question` | ✅ Match |
| **18** | Pay electric bill to IBAN `<IBAN>` 9 | `out_of_scope` | `out_of_scope` | ✅ Match |
| **19** | Call `<NAME>` at `<PHONE>` about the contract | `place_call` | `place_call` | ✅ Match |
| **22** | Remind `<NAME>` to bring the documentation to the meeting | `create_task` | `create_task` | ✅ Match |
| **24** | Call doctor Office on +`<PHONE>`567 to reschedule | `create_task` | `place_call` | ❌ **Disagreement** |
| **25** | Note down that `<NAME>`'s email is `<EMAIL>` | `save_memory` | `save_memory` | ✅ Match |
| **28** | Log that the garage entry code is 4492 | `save_memory` | `save_memory` | ✅ Match |
| **30** | What is the current temperature in Zurich | `answer_question` | `answer_question` | ✅ Match |

---

## 📈 Part B · Measured Trust & Cohen's Kappa ($\kappa$)

Using our `cohen_kappa()` implementation, we compute the raw observed agreement ($p_o$), expected chance agreement ($p_e$), and Cohen's Kappa ($\kappa$):

$$\kappa = \frac{p_o - p_e}{1 - p_e}$$

### Results Summary:
* **Total Evaluated Rows ($n$):** 20
* **Exact Matches:** 17 / 20
* **Observed Agreement ($p_o$):** **0.850** ($85.0\%$)
* **Chance Agreement ($p_e$):** **0.190** ($19.0\%$)
* **Cohen's Kappa ($\kappa$):** **0.815**
* **Agreement Band:** **Near-perfect** (trustworthy benchmark quality $\ge 0.80$)

> **Interpretation**: Although raw agreement was 85%, chance agreement accounted for 19.0% due to label distribution across the 6 intents. The resulting $\kappa = 0.815$ places this slice in the **Near-perfect** band, confirming that our golden set is highly defensive and reliable.

---

## ⚖️ Part C · Adjudication Log (Row-by-Row Resolution)

Every disagreed row was reviewed against `guideline.md` to produce an explicit, defensible decision:

1. **Row ID 9**: `"Remind me to call <NAME> at <EMAIL> tomorrow"`
   * **Annotator A**: `create_task` | **Annotator B**: `place_call`
   * **Decision**: **Accepted Pass 1 (`create_task`)**
   * **Deciding Guideline Clause**: **Clause 2.1 Tie-Breaker**: If an utterance mentions contacting or calling a person but includes a reminder trigger or future time (*"remind me to call..."*), it must be classified as `create_task`. `place_call` is strictly reserved for immediate phone dialing.

2. **Row ID 14**: `"Contact customer support at <EMAIL> regarding issue"`
   * **Annotator A**: `out_of_scope` | **Annotator B**: `place_call`
   * **Decision**: **Accepted Pass 1 (`out_of_scope`)**
   * **Deciding Guideline Clause**: **Clause 2.6 Tie-Breaker (Unsupported Communication Channel)**: The request specifies reaching support via `<EMAIL>`. Since email dispatch is not one of the supported core voice assistant actions, it falls into `out_of_scope`.

3. **Row ID 24**: `"Call doctor Office on +<PHONE>567 to reschedule"`
   * **Annotator A**: `create_task` | **Annotator B**: `place_call`
   * **Decision**: **Accepted Pass 2 (`place_call`)**
   * **Deciding Guideline Clause**: **Clause 2.2 Tie-Breaker**: The user gives an immediate directive to dial a phone number ("Call doctor Office on +<PHONE>567..."). Mentioning "reschedule" describes their conversational goal during the call, but the immediate action requested from the assistant is initiating a live phone call (`place_call`).

---

## 🔧 Part D · Intent Boundary Analysis & Guideline Fix

### Primary Contested Boundary: `create_task` vs. `place_call`
The primary source of human disagreement stems from utterances that blend phone action words ("call", "contact") with secondary conversational goals ("to reschedule") or time triggers ("remind me").

### Concrete Guideline Fix (Refinement to `guideline.md` Clause 2.2):
To eliminate lingering ambiguity in future labelling batches:

> **Addendum to Clause 2.2 (`place_call`)**:
> *"The presence of secondary purpose clauses (e.g., 'to reschedule an appointment', 'about the contract', 'to ask a question') does NOT negate `place_call` as long as the primary action is an immediate instruction to dial a phone number or contact a person right now."*
