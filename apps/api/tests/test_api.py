import pytest


async def signup_and_seed(client):
    await client.post("/auth/register", json={"email": "admin@test.com", "password": "password"})
    await client.post("/admin/seed")


@pytest.mark.asyncio
async def test_auth_register_login(client):
    r = await client.post("/auth/register", json={"email": "a@test.com", "password": "password"})
    assert r.status_code == 200
    r = await client.post("/auth/login", json={"email": "a@test.com", "password": "password"})
    assert r.status_code == 200


@pytest.mark.asyncio
async def test_profile_update(client):
    await client.post("/auth/register", json={"email": "p@test.com", "password": "password"})
    r = await client.put("/me/profile", json={"skills": ["python"], "interests": "ml", "locations": ["Remote"], "grad_year": 2026})
    assert r.status_code == 200
    g = await client.get("/me/profile")
    assert g.json()["skills"] == ["python"]


@pytest.mark.asyncio
async def test_opportunities_match_and_save(client):
    await signup_and_seed(client)
    r = await client.get("/opportunities")
    assert r.status_code == 200
    body = r.json()
    assert "match_score" in body[0]
    assert "explanation" in body[0]
    opp_id = body[0]["id"]
    s = await client.post(f"/opportunities/{opp_id}/save")
    assert s.status_code == 200


@pytest.mark.asyncio
async def test_tracker_stage_change(client):
    await client.post("/auth/register", json={"email": "t@test.com", "password": "password"})
    c = await client.post("/tracker/applications", json={"title_snapshot": "SWE", "org_snapshot": "Org", "stage": "Interested", "notes": "", "url_snapshot": "", "opportunity_id": None})
    app_id = c.json()["id"]
    u = await client.patch(f"/tracker/applications/{app_id}/stage", json={"stage": "Applied"})
    assert u.json()["stage"] == "Applied"


@pytest.mark.asyncio
async def test_seed_idempotent(client):
    await client.post("/auth/register", json={"email": "i@test.com", "password": "password"})
    a = await client.post("/admin/seed")
    b = await client.post("/admin/seed")
    assert a.status_code == 200 and b.status_code == 200
    assert b.json()["inserted"] == 0
