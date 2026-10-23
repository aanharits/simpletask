"""Integration tests for the /tasks API endpoints against PostgreSQL."""

from fastapi.testclient import TestClient


class TestListTasks:
    def test_list_tasks_empty(self, client: TestClient):
        response = client.get("/tasks")
        assert response.status_code == 200
        assert response.json() == []

    def test_list_tasks_ordered_by_id_asc(self, client: TestClient):
        res1 = client.post("/tasks", json={"title": "First Task"})
        res2 = client.post("/tasks", json={"title": "Second Task"})
        assert res1.status_code == 201
        assert res2.status_code == 201

        response = client.get("/tasks")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 2
        assert data[0]["id"] < data[1]["id"]
        assert data[0]["title"] == "First Task"
        assert data[1]["title"] == "Second Task"


class TestCreateTask:
    def test_create_task_minimal(self, client: TestClient):
        response = client.post("/tasks", json={"title": "Minimal Task"})
        assert response.status_code == 201
        data = response.json()
        assert isinstance(data["id"], int)
        assert data["title"] == "Minimal Task"
        assert data["description"] == ""
        assert data["status"] == "Todo"

    def test_create_task_full(self, client: TestClient):
        payload = {
            "title": "Full Task",
            "description": "Detailed explanation",
            "status": "In Progress",
        }
        response = client.post("/tasks", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Full Task"
        assert data["description"] == "Detailed explanation"
        assert data["status"] == "In Progress"

    def test_create_task_trims_title(self, client: TestClient):
        response = client.post("/tasks", json={"title": "   Untrimmed Title   "})
        assert response.status_code == 201
        assert response.json()["title"] == "Untrimmed Title"

    def test_create_task_rejects_empty_title(self, client: TestClient):
        response = client.post("/tasks", json={"title": ""})
        assert response.status_code == 422

    def test_create_task_rejects_whitespace_title(self, client: TestClient):
        response = client.post("/tasks", json={"title": "    "})
        assert response.status_code == 422

    def test_create_task_rejects_invalid_status(self, client: TestClient):
        response = client.post("/tasks", json={"title": "Task", "status": "Archived"})
        assert response.status_code == 422

    def test_create_task_rejects_title_exceeding_max_length(self, client: TestClient):
        response = client.post("/tasks", json={"title": "A" * 121})
        assert response.status_code == 422

    def test_create_task_rejects_description_exceeding_max_length(self, client: TestClient):
        response = client.post("/tasks", json={"title": "Valid", "description": "A" * 2001})
        assert response.status_code == 422


class TestUpdateTask:
    def test_update_status_only(self, client: TestClient):
        create_res = client.post(
            "/tasks",
            json={"title": "Task To Update", "description": "Original notes"},
        )
        task_id = create_res.json()["id"]

        update_res = client.put(f"/tasks/{task_id}", json={"status": "Done"})
        assert update_res.status_code == 200
        data = update_res.json()
        assert data["status"] == "Done"
        assert data["title"] == "Task To Update"
        assert data["description"] == "Original notes"

    def test_update_title_and_description(self, client: TestClient):
        create_res = client.post(
            "/tasks",
            json={"title": "Old Title", "description": "Old notes", "status": "In Progress"},
        )
        task_id = create_res.json()["id"]

        update_res = client.put(
            f"/tasks/{task_id}",
            json={"title": "New Title", "description": "New notes"},
        )
        assert update_res.status_code == 200
        data = update_res.json()
        assert data["title"] == "New Title"
        assert data["description"] == "New notes"
        assert data["status"] == "In Progress"

    def test_update_nonexistent_task_returns_404(self, client: TestClient):
        response = client.put("/tasks/999999", json={"title": "New Title"})
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    def test_update_with_empty_body_rejected(self, client: TestClient):
        create_res = client.post("/tasks", json={"title": "Existing Task"})
        task_id = create_res.json()["id"]

        response = client.put(f"/tasks/{task_id}", json={})
        assert response.status_code == 422

    def test_update_with_explicit_null_title_rejected(self, client: TestClient):
        create_res = client.post("/tasks", json={"title": "Existing Task"})
        task_id = create_res.json()["id"]

        response = client.put(f"/tasks/{task_id}", json={"title": None})
        assert response.status_code == 422

    def test_update_with_blank_title_rejected(self, client: TestClient):
        create_res = client.post("/tasks", json={"title": "Existing Task"})
        task_id = create_res.json()["id"]

        response = client.put(f"/tasks/{task_id}", json={"title": "   "})
        assert response.status_code == 422

    def test_update_with_invalid_status_rejected(self, client: TestClient):
        create_res = client.post("/tasks", json={"title": "Existing Task"})
        task_id = create_res.json()["id"]

        response = client.put(f"/tasks/{task_id}", json={"status": "Finished"})
        assert response.status_code == 422


class TestDeleteTask:
    def test_delete_task_success(self, client: TestClient):
        create_res = client.post("/tasks", json={"title": "To Delete"})
        task_id = create_res.json()["id"]

        delete_res = client.delete(f"/tasks/{task_id}")
        assert delete_res.status_code == 204
        assert delete_res.content == b""

        # Verify task no longer exists
        list_res = client.get("/tasks")
        assert all(t["id"] != task_id for t in list_res.json())

    def test_delete_nonexistent_task_returns_404(self, client: TestClient):
        response = client.delete("/tasks/999999")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
