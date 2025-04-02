### Client Server

To start the client server, follow these steps:

*   Navigate to the `client` directory.
*   Run the following command to install the required dependencies: ```bash npm install ```
*   Start the development server with: ```bash npm run dev```

### FastAPI Server

To start the FastAPI server, follow these steps:

*   Navigate to the `server` directory.
*   Create a virtual environment: <bash>python -m venv .venv</bash>
*   Activate the virtual environment (on Windows): ```bashsource .venv\Scripts\activate```
*   Install the required dependencies from the `requirements-dev.txt` file: ```bash pip install -r 
requirements-dev.txt```

**Configuring the Database**
---------------------------

To connect to the database, uncomment the following line in `main.py`:
```python
# models.Base.metadata.create_all(bind=engine)
```

Then, start the FastAPI server with:
```bash
uvicorn main:app --reload
```
