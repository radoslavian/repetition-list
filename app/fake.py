from faker import Faker
from random import choice


def fake_tasks(number=10):
    fake = Faker()

    return [{
        "title": fake.text(30),
        "description": fake.text(100),
        "intro_date": fake.date(),
        "multiplier": choice([1.2, 1.3, 1.4, 1.5, 1.8, 2])
    } for i in range(number)]
