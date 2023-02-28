import datetime
from flask import url_for
from app.models import Task, ReviewData
from datetime import date, timedelta
from app import db
from tests.tests_helpers import AppTester, add_fake_tasks, get_tasks_titles, \
    test_for_adding_task_with_invalid_fields, test_for_add_task_with_intro_date, \
    test_for_getting_task


class TestV1Api(AppTester):
    """API Version 1 tests."""
    test_get_task = test_for_getting_task("/v1/task/{}")
    test_add_task_with_intro_date = test_for_add_task_with_intro_date(
        "/v1/add-task")
    test_add_task_invalid_fields = test_for_adding_task_with_invalid_fields(
        "/v1/add-task")

    def test_add_task(self):
        """Test adding a valid task into the database through the REST API."""

        task_data = {"title": "Read a book again",
                     "description": "John Kowolski. Title.",
                     "due_date": "2022-08-04",
                     "multiplier": 1.8}
        response = self.client.post("/v1/add-task", json=task_data)
        # the "Created" response code
        self.assertEqual(response.status_code, 201)

        # check if task has been created in a database
        task = Task.query.first()
        self.assertEqual(task.id, response.json["taskId"])
        self.assertEqual(task.title, "Read a book again")
        self.assertEqual(task.multiplier, 1.8)

    def test_add_task_wrong_multiplier(self):
        """Test if app refuses to add task with incorrect multiplier."""
        task_data = {"title": "Read a book again",
                     "multiplier": 0.9}
        response = self.client.post("/v1/add-task", json=task_data)
        self.assertEqual(response.status_code, 400)

    def test_add_task_bad_request(self):
        """Test server response to the bad request in creating a task."""

        response = self.client.post("/v1/add-task",
                                    json={"occupation": "abbot"})
        self.assertEqual(response.status_code, 400)

    def test_task_update(self):
        task = Task(**{"title": "Read a book again",
                       "due_date": datetime.datetime(2022, 2, 22),
                       "intro_date": datetime.datetime(2021, 2, 22),
                       "multiplier": 1.8,
                       "active": True,
                       "description": "Original task."})
        db.session.add(task)
        db.session.commit()

        task_update_data = {
            "description": "John Novak. Second Title.",
            "multiplier": 2.0
        }
        response = self.client.patch(
            f"/v1/task/{task.id}/update",
            json=task_update_data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["description"],
                         task_update_data["description"])
        self.assertEqual(response.json["multiplier"],
                         task_update_data["multiplier"])

    def test_ticking_off(self):
        """Test 'ticking-off' reviewed tasks."""

        due_task_past = Task(**{
            "title": "task 1",
            "description": "Description 1",
            "intro_date": date(1999, 1, 1),
            "due_date": date(2000, 2, 2)})
        todays_task = Task(**{
            "title": "task 2",
            "description": "Description 2",
            "intro_date": datetime.date.today() - datetime.timedelta(days=3),
            "due_date": datetime.date.today()})
        future_task = Task(**{
            "title": "task 3",
            "description": "Description 3"})
        inactive_task = Task(**{
            "title": "task 1",
            "description": "Description 1",
            "active": False,
            "intro_date": datetime.date.today() - datetime.timedelta(days=3),
            "due_date": datetime.date.today()})

        db.session.add_all([due_task_past, todays_task,
                            future_task, inactive_task])
        db.session.commit()

        for task in due_task_past, todays_task:
            response = self.client.put(f"/v1/task/{task.id}/tick-off")
            self.assertEqual(response.status_code, 200)

        for task in future_task, inactive_task:
            response = self.client.put(f"/v1/task/{task.id}/tick-off")
            self.assertEqual(response.status_code, 400)

    def test_deleting_task(self):
        """Test deleting task from the database."""

        task = Task(title="Review book chapter",
                    intro_date=date(2022, 1, 1),
                    description="John Kowolski. Title. Chapter 1.",
                    reviews=[
                        ReviewData(reviewed_on=date(2022, 3, 17),
                                   prev_due_date=date(2022, 9, 1),
                                   multiplier=1.5),
                        ReviewData(reviewed_on=date(2022, 1, 31),
                                   prev_due_date=date(2022, 3, 17),
                                   multiplier=1.5)
                    ])
        db.session.add(task)
        db.session.commit()

        self.assertEqual(self.client.delete(
            url_for("api_v1.delete_task",
                    task_id=task.id)).status_code, 204)
        self.assertFalse(Task.query.all())
        self.assertFalse(ReviewData.query.all())

    def test_change_task_status(self):
        """Test removing/reintroducing task into queue."""
        task = Task(title="Review book chapter",
                    active=True,
                    description="John Kowolski. Title. Chapter 1.")
        db.session.add(task)
        db.session.commit()

        self.assertEqual(self.client.patch(
            url_for("api_v1.change_task_status",
                    task_id=task.id)).status_code, 200)
        self.assertFalse(Task.query.first().active)

        self.client.patch(url_for("api_v1.change_task_status",
                                  task_id=task.id))
        self.assertTrue(Task.query.first().active)

    def test_reset_task(self):
        self.test_ticking_off()
        task = Task.query.all()[0]

        self.assertEqual(len(task.reviews), 1)
        self.assertEqual(self.client.patch(
            url_for("api_v1.reset_task",
                    task_id=task.id)).status_code, 200)
        self.assertEqual(len(task.reviews), 0)
        self.assertEqual(task.intro_date, date.today())
        self.assertEqual(task.due_date, date.today()
                         + timedelta(days=Task.default_interval))

    def test_getting_reviewdata(self):
        self.test_ticking_off()
        task = Task.query.all()[0]
        response = self.client.get(f"/v1/task/{task.id}/reviews")
        keys = ["multiplier", "prev_due_date", "reviewed_on"]

        # test if response contains all valid keys
        self.assertTrue(all(key in response.json[0] for key in keys))

        # test if there's data under the keys
        self.assertTrue(all(response.json[0].get(key, None) for key in keys))


class TestTaskUpdate(AppTester):
    def setUp(self):
        super().setUp()

        self.task_data = {"title": "Read a book again",
                          "due_date": str(
                              datetime.datetime(2022, 2, 22)).split(" ")[0],
                          "intro_date": str(
                              datetime.datetime(2021, 2, 22)).split(" ")[0],
                          "multiplier": 1.8,
                          "active": True,
                          "description": "Original task."}
        task_data = {"title": "Read a book again",
                     "due_date": datetime.datetime(2022, 2, 22),
                     "intro_date": datetime.datetime(2021, 2, 22),
                     "multiplier": 1.8,
                     "active": True,
                     "description": "Original task."}

        self.task = Task(**task_data)
        db.session.add(self.task)
        db.session.commit()

    def test_response_wrongid(self):
        """Tests if server returns 400 response code to the wrong
        task id request.
        """
        self.assertEqual(self.client.patch(
            f"/v1/task/{self.task.id+11}/update").status_code, 400)

    def test_title_update(self):
        """Test successful title update status code and check if data has
        actually changed.
        """
        response = self.client.patch(
            f"/v1/task/{self.task.id}/update",
            json={"title": "John Novak. Second Title."})
        self.assertEqual(response.status_code, 200)

        task_data = {
            **self.task_data, "id": self.task.id,
            "title": "John Novak. Second Title.",
            "reviews": []
        }
        response = self.client.get(f"/v1/task/{self.task.id}")
        self.assertDictEqual(task_data, dict(response.json))

    def test_empty_title(self):
        """Test if app allows updating task with an empty title.
        """
        response = self.client.patch(
            f"/v1/task/{self.task.id}/update",
            json={"title": ""})
        self.assertEqual(response.status_code, 400)

    def test_update_description_multiplier(self):
        self.client.patch(
            f"/v1/task/{self.task.id}/update",
            json={"description": "New description.",
                  "multiplier": 1.5})
        response = self.client.get(f"/v1/task/{self.task.id}")

        task_data = {
            **self.task_data,
            "reviews": [],
            "id": self.task.id,
            "description": "New description.",
            "multiplier": 1.5
        }
        self.assertDictEqual(task_data, dict(response.json))

    def test_update_due_date_intro_date(self):
        """Test if both intro_date and due_date update sucessfully.
        """
        dates = {
            "intro_date": "1997-02-13",
            "due_date": "1999-01-13"
        }
        response = self.client.patch(
            f"/v1/task/{self.task.id}/update",
            json=dates)
        response = self.client.get(f"/v1/task/{self.task.id}")

        task_data = {**self.task_data, **dates, "reviews": [],
                     "id": self.task.id}
        self.assertDictEqual(task_data,
                             dict(response.json))

    def test_update_date_intro_date(self):
        """Test if intro_date updates sucessfully."""
        response = self.client.patch(
            f"/v1/task/{self.task.id}/update",
            json={"intro_date": "1997-02-13"})

        self.assertEqual(response.status_code, 200)

    def test_update_date_due_date(self):
        """Test if due_date updates sucessfully."""
        response = self.client.patch(
            f"/v1/task/{self.task.id}/update",
            json={"due_date": "1997-02-13"})

        self.assertEqual(response.status_code, 200)

    def test_update_malformed_dates(self):
        dates = {
            "intro_date": "abc-13",
            "due_date": "1999-de-f"
        }
        response = self.client.patch(
            f"/v1/task/{self.task.id}/update",
            json=dates)

        self.assertEqual(response.status_code, 400)

    def test_update_no_data(self):
        data = {}
        response = self.client.patch(
            f"/v1/task/{self.task.id}/update",
            json=data)

        self.assertEqual(response.status_code, 400)

    def test_invalid_data(self):
        data = {"aa": "bb"}
        response = self.client.patch(
            f"/v1/task/{self.task.id}/update", json=data)

        self.assertEqual(response.status_code, 400)

    def test_multiplier(self):
        """Test if the Task refuses to accept multiplier < 1."""

        data = {"multiplier": .3}
        response = self.client.patch(
            f"/v1/task/{self.task.id}/update", json=data)
        self.assertEqual(response.status_code, 400)
        self.assertTrue(response.is_json)
        self.assertEqual(response.json.get("status"),
                         "Task multiplier must be > 0.")

    def test_wrong_id(self):
        """Test response to attempt to update non-existent task."""

        response = self.client.patch(
            f"/v1/task/{self.task.id+1}/update", json={"title": "new title"})
        self.assertEqual(response.status_code, 404)
