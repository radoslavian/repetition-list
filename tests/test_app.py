from tests.tests_helpers import AppTester


class TestApp(AppTester):
    def test_main_route(self):
        """Test the '/' route."""
        response = self.client.get("/")

        self.assertEqual(response.status_code, 200)
