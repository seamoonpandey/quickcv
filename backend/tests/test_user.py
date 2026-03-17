import pytest
from app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_get_profile_unauthenticated(client):
    res = client.get("/api/user/profile")
    assert res.status_code == 401


def test_update_profile_unauthenticated(client):
    res = client.put("/api/user/profile", json={"full_name": "New"})
    assert res.status_code == 401
