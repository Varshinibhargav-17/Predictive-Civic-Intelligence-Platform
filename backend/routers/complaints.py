from fastapi import APIRouter
import pandas as pd

router = APIRouter()

DATA_PATH = "backend/data/classified_complaints.csv"


@router.get("/complaints")
def get_complaints():

    df = pd.read_csv(DATA_PATH)

    # clean NaN values
    df = df.replace([float("inf"), float("-inf")], None)
    df = df.fillna("")

    return df.head(50).to_dict(orient="records")