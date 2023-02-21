from datetime import datetime

from app import db
from app.models import Task
from tests.tests_helpers import AppTester, route_ending, add_fake_tasks
from flask import url_for


class TestV2Api(AppTester):
    def testPostingNewTask(self):
        """Test adding new task"""
        pass

    def testGettingSingleTask(self):
        """Test getting json-serialized task."""
        pass

    def testGettingTasksRoute(self):
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

    def testUpdatingTask(self):
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

    def testTickingOff(self):
        # test response code (200), response returns whole object
        SUCCESS_RESPONSE = 200
        add_fake_tasks(1)
        task = Task.query.first()
        task.due_date = datetime.today()
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




    def testDeletingTask(self):
        pass

    def testResettingTask(self):
        pass

    def testAlteringStatus(self):
        pass
