import pytest


@pytest.mark.asyncio
async def test_seed_is_idempotent(authed_client):
    first = await authed_client.post("/admin/seed")
    second = await authed_client.post("/admin/seed")
    assert first.status_code == 200
    assert second.status_code == 200
    assert second.json()["inserted"] == 0


@pytest.mark.asyncio
async def test_list_opportunities_includes_match_and_explanations(authed_client):
    await authed_client.post("/admin/seed")
    opps = await authed_client.get("/opportunities")
    assert opps.status_code == 200
    first = opps.json()[0]
    assert "match_score" in first
    assert isinstance(first["explanation"].get("overlap_skills"), list)
    assert isinstance(first["explanation"].get("snippets"), list)


@pytest.mark.asyncio
async def test_save_and_saved_only_filter(authed_client):
    await authed_client.post("/admin/seed")
    opps = (await authed_client.get("/opportunities")).json()
    opp_id = opps[0]["id"]

    save = await authed_client.post(f"/opportunities/{opp_id}/save")
    assert save.status_code == 200

    saved_only = await authed_client.get("/opportunities?saved_only=true")
    assert saved_only.status_code == 200
    assert {item["id"] for item in saved_only.json()} == {opp_id}


@pytest.mark.asyncio
async def test_rating_overwrites_existing_rating(authed_client):
    await authed_client.post("/admin/seed")
    opp_id = (await authed_client.get("/opportunities")).json()[0]["id"]

    first = await authed_client.post(f"/opportunities/{opp_id}/rate", json={"rating": 2})
    second = await authed_client.post(f"/opportunities/{opp_id}/rate", json={"rating": 5})
    assert first.status_code == 200
    assert second.status_code == 200
