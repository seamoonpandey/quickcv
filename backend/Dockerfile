# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

# Expose port
EXPOSE 5000

# Run with gunicorn in production, fallback to Flask dev server if needed
CMD ["sh", "-c", "if [ \"$FLASK_ENV\" = 'production' ]; then gunicorn -b 0.0.0.0:5000 'app:create_app()'; else python run.py; fi"]
