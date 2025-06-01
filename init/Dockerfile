FROM python:3.13-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    postgresql-client \
    libpq-dev \
    gcc \
    libc6-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy import script
COPY import_transactions_to_pg.py .

# Make script executable
RUN chmod +x import_transactions_to_pg.py

# Set environment variables
ENV POSTGRES_HOST=postgres \
    POSTGRES_PORT=5432 \
    POSTGRES_DB=hackvision \
    POSTGRES_USER=hackvision \
    POSTGRES_PASSWORD=hackvision123

# Run import script
CMD ["python", "import_transactions_to_pg.py"] 