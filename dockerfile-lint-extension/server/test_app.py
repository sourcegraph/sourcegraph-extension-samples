from flask import url_for


class TestApp:
    def test_healthcheck(self, client):
        res = client.get(url_for('health_check'))
        assert res.status_code == 200
        assert res.json == {'status': 'ok'}
