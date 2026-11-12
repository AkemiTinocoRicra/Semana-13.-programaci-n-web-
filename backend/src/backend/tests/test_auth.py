import pytest
from httpx import AsyncClient
from backend.main import app

@pytest.mark.asyncio
async def test_register_and_login_flow():
    async with AsyncClient(app=app, base_url="http://testserver") as client:
        # Register a new user
        register_resp = await client.post("/auth/register", json={"email": "test@example.com", "password": "secret123"})
        assert register_resp.status_code == 200
        data = register_resp.json()
        assert "access_token" in data
        # Ensure cookie set
        assert "set-cookie" in register_resp.headers
        # Login with same credentials
        login_resp = await client.post("/auth/login", json={"email": "test@example.com", "password": "secret123"})
        assert login_resp.status_code == 200
        login_data = login_resp.json()
        assert "access_token" in login_data
        # Access protected endpoint
        me_resp = await client.get("/auth/me", cookies={"access_token": login_data["access_token"]})
        assert me_resp.status_code == 200
        me_data = me_resp.json()
        assert me_data["email"] == "test@example.com"
        # Logout (revokes token)
        logout_resp = await client.post("/auth/logout", cookies={"access_token": login_data["access_token"]})
        assert logout_resp.status_code == 200
        # After logout, token should be revoked
        me_after_resp = await client.get("/auth/me", cookies={"access_token": login_data["access_token"]})
        assert me_after_resp.status_code == 401
