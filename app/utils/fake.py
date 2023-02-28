from faker import Faker
from random import choice
from app.utils.api_helpers import date_from_string

fake = Faker()


def fake_tasks(number=10):
    return [fake_task() for i in range(number)]


def fake_task():
    return {
        "title": fake.text(30),
        "description": fake.text(100),
        "intro_date": fake_date(),
        "multiplier": choice([1.2, 1.3, 1.4, 1.5, 1.8, 2, 3, 4, 5, 6, 7, 8,
                              9, 10]),
        "active": choice([True, False])
    }


def fake_task_for_api():
    task = fake_task()
    del task["intro_date"]
    return task


def fake_date():
    return date_from_string(fake.date())
