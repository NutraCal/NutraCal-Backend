from flask import Flask,request

app = Flask(__name__)
from utils import decision_tree_classifier as util

@app.route('/flask', methods=['GET'])
def flask():
    response = "Flask server"
    print(response)
    return response

@app.route('/dietPlan',methods=['POST'])
def dietPlan():
    goal = request.args.get('goal')
    buffer = util.generate_meal_plan(goal)
    print(buffer)
    return buffer

if __name__ == "__main__":
    app.run(port=5000, debug=True)
