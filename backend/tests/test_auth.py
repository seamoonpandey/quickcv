import pytest
from app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_health(client):
    res = client.get("/api/health")
    assert res.status_code == 200


def test_register_missing_fields(client):
    res = client.post("/api/auth/register", json={})
    assert res.status_code == 400


def test_login_invalid(client):
    res = client.post("/api/auth/login", json={"email": "fake@test.com", "password": "wrong"})
    assert res.status_code == 401


def test_me_unauthenticated(client):
    res = client.get("/api/auth/me")
    assert res.status_code == 401