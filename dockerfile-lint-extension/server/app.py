import logging
import re
from subprocess import run, PIPE

from flask import Flask, render_template, jsonify, request
from flask_cors import CORS


class DockerfileLintProcess:
    dockerfile = None
    result = None

    def __init__(self, dockerfile: str):
        self.dockerfile = dockerfile
        self._validate()

    def _get_lint_results(self, stdout: str):
        lines = stdout.split('\n')
        regex = re.compile(r'^/dev/stdin:([\d]+) (.*)$')
        results = []

        for line in lines:
            try:
                line_number, message = regex.search(line).groups()
                results.append({
                    'line': int(line_number),
                    'lint': message
                })
            except AttributeError:
                pass

        return results

    def _validate(self):
        process = run(['hadolint', '-'], input=request.data.decode('utf-8'),
                      stdout=PIPE, universal_newlines=True)
        self.results = {
            'clean': True if process.returncode == 0 else False,
            'lint': self._get_lint_results(process.stdout)
        }


def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/lint', methods=['POST', 'OPTIONS'])
    def lint():
        return jsonify(DockerfileLintProcess(dockerfile=request.data).results)

    @app.route('/healthz')
    def health_check():
        return jsonify(status='ok')

    return app


if __name__ == '__main__':
    app = create_app()
    logging.getLogger('flask_cors').level = logging.DEBUG
    app.run()
