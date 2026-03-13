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


def score_urgency(text: str) -> int:
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

    # baseline urgency
    score += 30

    # cap score
    return min(score, 100)