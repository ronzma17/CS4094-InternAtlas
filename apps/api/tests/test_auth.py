import pytest

from conftest import register_and_login


@pytest.mark.asyncio
async def test_register_login_me_and_cookie(client):
    register = await client.post("/auth/register", json={"email": "auth@test.com", "password": "password"})
    assert register.status_code == 200
    assert "internatlas_token" in register.headers.get("set-cookie", "")

    login = await client.post("/auth/login", json={"email": "auth@test.com", "password": "password"})
    assert login.status_code == 200
    assert "internatlas_token" in login.headers.get("set-cookie", "")

    me = await client.get("/me")
    assert me.status_code == 200
    assert me.json()["email"] == "auth@test.com"


@pytest.mark.asyncio
async def test_logout_clears_cookie(client):
    await register_and_login(client, email="logout@test.com")
    response = await client.post("/auth/logout")
    assert response.status_code == 200
    assert "internatlas_token=" in response.headers.get("set-cookie", "")


@pytest.mark.asyncio
async def test_duplicate_registration_fails(client):
    await register_and_login(client, email="dupe@test.com")
    dupe = await client.post("/auth/register", json={"email": "dupe@test.com", "password": "password"})
    assert dupe.status_code == 400
