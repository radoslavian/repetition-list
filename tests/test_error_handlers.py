from tests.tests_helpers import AppTester


class TestErrorHandlers(AppTester):
    def test_404(self):
        """Test if 404 error response uses proper blueprint route."""

        response = self.client.get("/no/such/path")
        error_message = "Not Found"

        self.assertEqual(response.status_code, 404)
        self.assertTrue(response.is_json)
        self.assertEqual(response.json["error"], error_message)

    def test_400(self):
        # nowe zadanie
        # pobrać zadania
        # z zadania -> id
        # tick-off wg id

        new_task = self.client.post()
        # response = self.client

    def test_405(self):
        pass
