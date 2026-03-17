import pytest
from app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_get_cvs_unauthenticated(client):
    res = client.get("/api/cvs/")
    assert res.status_code == 401


def test_create_cv_unauthenticated(client):
    res = client.post("/api/cvs/", json={"title": "Test CV"})
    assert res.status_code == 401