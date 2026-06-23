import json
import numpy as np
import pandas as pd
from tqdm import tqdm

from bert_score import score as bert_score
from sentence_transformers import SentenceTransformer
from scipy.spatial.distance import cdist
import ot  # POT: Python Optimal Transport

#python3 -m venv venv
#source venv/bin/activate
#pip install --upgrade pip
#pip install numpy pandas scipy bert-score sentence-transformers pot tqdm

# =========================
# CONFIG
# =========================
AI_FILE = "testsAI-O.json"
HUMAN_FILE = "testG.json"

EMBED_MODEL = "all-MiniLM-L6-v2"


# =========================
# LOAD DATA
# =========================
def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def flatten_test_case(tc):
    """
    Convert test case into a single string representation.
    """
    actions = tc.get("actions", [])
    name = tc.get("name", "")
    expected = str(tc.get("expected", ""))

    return " ".join([name] + actions + [expected])


# =========================
# EMBEDDINGS
# =========================
def compute_embeddings(texts, model):
    return model.encode(texts, show_progress_bar=True, normalize_embeddings=True)


# =========================
# MOVERSCORE (OT-based)
# =========================
def moverscore(sentence_a, sentence_b, model):
    """
    Compute a simplified MoverScore using:
    - token embeddings
    - Earth Mover Distance (Wasserstein distance)
    """

    def tokenize(text):
        return text.lower().split()

    tokens_a = tokenize(sentence_a)
    tokens_b = tokenize(sentence_b)

    if len(tokens_a) == 0 or len(tokens_b) == 0:
        return 0.0

    emb_a = model.encode(tokens_a, normalize_embeddings=True)
    emb_b = model.encode(tokens_b, normalize_embeddings=True)

    # cost matrix (cosine distance)
    cost_matrix = cdist(emb_a, emb_b, metric="cosine")

    # uniform distributions
    a_weights = np.ones(len(tokens_a)) / len(tokens_a)
    b_weights = np.ones(len(tokens_b)) / len(tokens_b)

    # Earth Mover Distance
    emd = ot.emd2(a_weights, b_weights, cost_matrix)

    # Convert distance to similarity
    score = 1.0 / (1.0 + emd)

    return float(score)


# =========================
# MAIN EVALUATION
# =========================
def main():
    ai_data = load_json(AI_FILE)
    human_data = load_json(HUMAN_FILE)

    ai_texts = [flatten_test_case(tc) for tc in ai_data]
    human_texts = [flatten_test_case(tc) for tc in human_data]

    model = SentenceTransformer(EMBED_MODEL)

    print("Encoding texts...")
    ai_emb = compute_embeddings(ai_texts, model)
    human_emb = compute_embeddings(human_texts, model)

    results = []

    print("Computing scores...")

    for i, ai_text in enumerate(tqdm(ai_texts)):
        best_bert = -1
        best_mover = -1
        best_human_idx = -1

        for j, human_text in enumerate(human_texts):

            # -------------------------
            # BERTScore (pairwise)
            # -------------------------
            P, R, F1 = bert_score(
                [ai_text],
                [human_text],
                lang="en",
                verbose=False
            )

            bert_f1 = F1.item()

            # -------------------------
            # MoverScore
            # -------------------------
            mover = moverscore(ai_text, human_text, model)

            # -------------------------
            # Keep best match (can change strategy if needed)
            # -------------------------
            if bert_f1 > best_bert:
                best_bert = bert_f1
                best_mover = mover
                best_human_idx = j

        results.append({
            "ai_index": i,
            "ai_name": ai_data[i].get("name", ""),
            "best_human_match_index": best_human_idx,
            "bert_score_f1": best_bert,
            "moverscore": best_mover
        })

    df = pd.DataFrame(results)

    print("\n===== SUMMARY =====")
    print(df.describe())

    output_file = "evaluation_results.csv"
    df.to_csv(output_file, index=False)

    print(f"\nSaved results to {output_file}")


if __name__ == "__main__":
    main()