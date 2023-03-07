from datetime import datetime, timedelta

from app import db
from app.models import Task
from app.utils.fake import fake_task_for_api
from tests.tests_helpers import AppTester, route_ending, add_fake_tasks, \
    test_for_adding_task_with_invalid_fields, test_for_getting_task, \
    test_for_deleting_task, test_for_resetting_task, example_tasks
from flask import url_for


class TestChangingTaskStatus(AppTester):
    def setUp(self):
        super().setUp()
        self.task, *_ = example_tasks()

    def test_task_inactive_to_inactive(self):
        self.make_task_inactive()
        self.assertFalse(self.task.active)
        response = self.client.post(f"/v2/tasks/{self.task.id}/inactive")
        self.assertEqual(response.status_code, 204)
        # is the task still inactive?
        self.assertFalse(self.task.active)

    def test_task_active_to_active(self):
        self.assertTrue(self.task.active)
        response = self.client.post(f"/v2/tasks/{self.task.id}/active")
        self.assertEqual(response.status_code, 204)
        # is the task still active?
        self.assertTrue(self.task.active)

    def test_task_inactive_to_active(self):
        # shall return 200 + task object
        self.make_task_inactive()
        self.assertFalse(self.task.active)
        response = self.client.post(f"/v2/tasks/{self.task.id}/active")

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json["active"])
        self.assertTrue(self.task.active)

    def test_response_carries_data(self):
        self.assertTrue(self.task.active)
        response = self.client.post(f"/v2/tasks/{self.task.id}/inactive")
        self.assertTrue(response.json)
        self.assertEqual(response.json["title"], self.task.title)

    def test_task_active_to_inactive(self):
        # shall return 200 + task object
        self.assertTrue(self.task.active)
        response = self.client.post(f"/v2/tasks/{self.task.id}/inactive")

        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.json["active"])
        self.assertFalse(self.task.active)

    def test_malformed_url(self):
        response = self.client.post(f"/v2/tasks/{self.task.id}/badRequest")
        self.assertEqual(response.status_code, 400)

    def test_task_not_found(self):
        irrational_task_number = 100
        response = self.client.post(
            f"/v2/tasks/{irrational_task_number}/active")
        self.assertEqual(response.status_code, 404)

    def make_task_inactive(self):
        self.task.active = False
        db.session.add(self.task)
        db.session.commit()


class TestV2Api(AppTester):
    # tests from higher-order functions:
    test_get_task = test_for_getting_task("/v2/tasks/{}")
    test_add_task_invalid_fields = test_for_adding_task_with_invalid_fields(
        "/v2/tasks")
    test_deleting_task = test_for_deleting_task("/v2/tasks/{}")
    test_getting_task = test_for_getting_task("/v2/tasks/{}")
    test_resetting_task = test_for_resetting_task(
        "/v2/tasks/{}/reset", "post")


    def test_posting_new_task(self):
        """Test adding new task"""
        route = "/v2/tasks"
        task_data = fake_task_for_api()
        response = self.client.post(route, json=task_data)

        self.assertEqual(response.status_code, 201)

    def test_getting_tasks_route(self):
        """Tests if endpoint exists and is a proper route.
        """
        SUCCESS_RESPONSE = 200
        expected_route = "/v2/tasks"
        obtained_route = url_for("api_v2.get_tasks")
        response = self.client.get(obtained_route)

        self.assertEqual(expected_route,
                         route_ending(expected_route, obtained_route))
        self.assertEqual(response.status_code, SUCCESS_RESPONSE)
        self.assertTrue(response.is_json)

    def test_updating_task(self):
        """Test a route for patching a task (updating a single
        field at a time).
        """
        SUCCESS_RESPONSE = 200
        add_fake_tasks(1)
        task = Task.query.first()

        # /v2/tasks/1 most of the time:
        expected_route = f"/v2/tasks/{task.id}"
        obtained_route = url_for("api_v2.update_task", task_id=task.id)
        new_task_title = task.title + "_new"
        response_updated_task = self.client.patch(
            obtained_route, json={"title": new_task_title})
        response_data_json = response_updated_task.json

        self.assertEqual(response_updated_task.status_code, SUCCESS_RESPONSE)
        self.assertEqual(expected_route,
                         route_ending(expected_route, obtained_route))
        self.assertEqual(response_data_json["title"],
                         new_task_title)
        self.assertIsNotNone(response_data_json["id"])

    def test_ticking_off(self):
        # test response code (200), response returns whole object
        SUCCESS_RESPONSE = 200
        add_fake_tasks(1)

        # I should have another function for making fake tasks for review
        task = Task.query.first()
        task.intro_date = datetime.today() - timedelta(days=3)
        task.due_date = datetime.today() - timedelta(days=1)
        task.active = True
        db.session.add(task)
        db.session.commit()

        expected_route = f"/v2/tasks/{task.id}/tick-off"
        obtained_route = url_for("api_v2.tick_off_task", task_id=task.id)
        response_ticked_off_task = self.client.post(obtained_route)

        self.assertEqual(response_ticked_off_task.status_code,
                         SUCCESS_RESPONSE)
        self.assertEqual(expected_route,
                         route_ending(expected_route, obtained_route))
        self.assertEqual(response_ticked_off_task.json["title"],
                         task.title)
