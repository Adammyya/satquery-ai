import json
import os

def load_profiles():
    profile_path = os.path.join(os.path.dirname(__file__), 'profiles.json')
    if os.path.exists(profile_path):
        with open(profile_path, 'r') as f:
            return json.load(f)
    return {}

def evaluate_results(manifest_path: str):
    """
    Consumes a structured JSON manifest of benchmark examples and computes basic metrics.
    Manifest format expected:
    [
      {
         "task": "satellite_vqa",
         "query": "Is there a flood?",
         "expected_answer_keywords": ["flood", "water"],
         "actual_result": { "answer": "...", "confidence": 0.85, "evidence": {...} }
      }
    ]
    """
    if not os.path.exists(manifest_path):
        print("Manifest not found.")
        return

    with open(manifest_path, 'r') as f:
        data = json.load(f)

    metrics = {
        "total": len(data),
        "success": 0,
        "failed": 0,
        "average_confidence": 0.0,
        "evidence_available_count": 0
    }
    
    total_conf = 0.0
    conf_count = 0

    for item in data:
        result = item.get("actual_result", {})
        ans = result.get("answer", "").lower()
        
        # Exact/Semantic match (basic keyword check for demo purposes)
        keywords = item.get("expected_answer_keywords", [])
        if any(k.lower() in ans for k in keywords):
            metrics["success"] += 1
        else:
            metrics["failed"] += 1
            
        conf = result.get("confidence")
        if conf is not None:
            total_conf += float(conf)
            conf_count += 1
            
        evidence = result.get("evidence", {})
        if evidence.get("spatial_evidence_available") or evidence.get("visual_difference_available") or evidence.get("type"):
            metrics["evidence_available_count"] += 1

    if conf_count > 0:
        metrics["average_confidence"] = total_conf / conf_count
        
    print("=== SATQUERY AI Evaluation Report ===")
    print(json.dumps(metrics, indent=2))
    print("\nNote: True model fine-tuning requires offline domain adaptation.")
    return metrics

if __name__ == "__main__":
    # Example usage (would run over a real dataset JSON)
    # evaluate_results("dataset_manifest.json")
    print("Evaluation scaffold ready.")
