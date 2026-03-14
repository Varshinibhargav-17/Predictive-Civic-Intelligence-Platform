import re

# severity keywords
SEVERITY_KEYWORDS = [
    "accident",
    "injury",
    "flood",
    "fire",
    "danger",
    "collapse",
    "blocked",
    "overflow",
    "huge pothole"
]


def score_urgency(text: str, category: str = "Other") -> int:
    """
    Compute urgency score for a complaint based on text severity.

    Returns an urgency score between 0 and 100.
    """

    score = 0

    text = text.lower()

    # severity keyword check
    for word in SEVERITY_KEYWORDS:
        if re.search(word, text):
            score += 35
            break

    # baseline urgency based on category
    if category == "Road & Potholes":
        score += 55
    elif category == "Electricity":
        score += 75
    elif category in ["Drainage", "Sanitation & Garbage"]:
        score += 65
    elif category == "Water Supply":
        score += 60
    elif category == "Encroachment":
        score += 45
    else:
        score += 30

    # cap score
    return min(score, 100)