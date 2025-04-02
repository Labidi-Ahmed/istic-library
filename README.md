## Running the Client Server
cd client
npm install
npm run dev

## Running the FastAPI Server
cd server
python -m venv .venv
source .venv/bin/activate  # For Windows use `.venv\Scripts\activate`
pip install -r requirements-dev.txt

Uncomment the following line in main.py:
#models.Base.metadata.create_all(bind=engine)

Then run:
uvicorn main:app --reload
