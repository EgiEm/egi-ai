import numpy as np

def predict_head(weights: list[list[float]], bias: list[float], x: list[float]) -> int:
    """
    Computes linear score for each class c:
        score_c = weights[c][0]*x[0] + weights[c][1]*x[1] + bias[c]
    and returns the index of the highest-scoring class (argmax).
    
    Pure Python & NumPy implementation matching Day 2 Lab 6 requirement.
    """
    best_class = 0
    best_score = float('-inf')
    
    num_classes = len(weights)
    for c in range(num_classes):
        # Linear dot product + bias
        score = sum(w * xi for w, xi in zip(weights[c], x)) + bias[c]
        if score > best_score:
            best_score = score
            best_class = c
            
    return best_class

def main():
    print("=== Day 2 Lab 6: Manual Logistic Head Verification ===")
    
    # 5 test 2-D embeddings
    X = [
        [2.5, 1.2],
        [-1.0, 3.4],
        [0.5, -2.1],
        [3.1, 0.8],
        [-0.8, 2.9]
    ]
    
    # Weights (3 classes x 2 dimensions) and Biases (3 classes)
    weights = [
        [1.5, -0.5],   # Class 0 weights
        [-1.0, 2.0],   # Class 1 weights
        [0.2, -1.8]    # Class 2 weights
    ]
    bias = [0.5, -0.2, 0.1]
    
    # Expected gold labels for test inputs
    gold_labels = [0, 1, 2, 0, 1]
    
    correct = 0
    for idx, (x, gold) in enumerate(zip(X, gold_labels)):
        pred = predict_head(weights, bias, x)
        is_correct = (pred == gold)
        if is_correct:
            correct += 1
        print(f"input {idx}: predicted {pred} (gold: {gold}) -> {'OK' if is_correct else 'ERR'}")
        
    print(f"\nResult: correct {correct}/{len(gold_labels)}")
    assert correct == len(gold_labels), "Manual head prediction failed test cases!"
    print("[PASSED] Manual logistic head calculation verified!")

if __name__ == "__main__":
    main()
