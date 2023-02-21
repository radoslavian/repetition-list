import unittest
from app import create_app, db
from app.fake import fake_tasks
from app.models import Task


class AppTester(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
        self.client = self.app.test_client(use_cookies=True)

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()


def add_fake_tasks(number=10):
    """Adds fake tasks to testing database and returns a dictionary
    of added tasks.
    """
    tasks = fake_tasks(number)
    db.session.add_all([Task(**task) for task in tasks])
    db.session.commit()
    return tasks


def get_tasks_titles(response):
    return [resp_item["title"] for resp_item in response.json]


def route_ending(expected_route, obtained_route):
    """Cuts a domain name from the route returned from
    the url_for() - for routes comparison.
    """
    return obtained_route[-len(expected_route):]
