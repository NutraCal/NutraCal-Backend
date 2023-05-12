import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

def generate_meal_plan(fitness_goal):
    # Load the dataset
    data = pd.read_csv('E:/Flask/recipes_with_categories.csv')

    # Replace NaN values with column means
    data = data.fillna(data.mean())

    # Exclude meals with missing values in 'Calories', 'Proteins', 'Fats', and 'Carbs' columns
    data = data.dropna(subset=['Calories', 'Proteins', 'Fats', 'Carbs','Title'])

    # Split the dataset into features (X) and target (y)
    X = data[['Calories', 'Proteins', 'Fats', 'Carbs', 'Breakfast', 'Lunch', 'Dinner']]
    y = data['Calorie_Category']

    # Split the dataset into training and testing data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

    # Create a decision tree classifier model
    model = DecisionTreeClassifier()

    # Train the model
    model.fit(X_train, y_train)

    # Predict the suitable meals for the user's fitness goal
    predictions = model.predict(X)

    # Create a dictionary of meal types
    meal_types = {'Breakfast': 1, 'Lunch': 2, 'Dinner': 3}

    # Create a list of meals for each day
    meal_plan = []
    selected_meals = set()
    for i in range(7):
        daily_meals = []
        for meal_type, index in meal_types.items():
            # Filter the meals for the current day and meal type
            filtered_data = data[(data[meal_type] == 1) & (predictions == fitness_goal)]
            # Exclude the meals that have already been selected
            filtered_data = filtered_data[~filtered_data['Title'].isin(selected_meals)]
            # Exclude meals with missing values in 'Calories', 'Proteins', 'Fats', and 'Carbs' columns
            filtered_data = filtered_data.dropna(subset=['Calories', 'Proteins', 'Fats', 'Carbs'])
            if filtered_data.empty:
                # If there are no available meals left, select a random meal from the entire dataset
                filtered_data = data[(data[meal_type] == 1) & (predictions == fitness_goal)]
                filtered_data = filtered_data.dropna(subset=['Calories', 'Proteins', 'Fats', 'Carbs'])
            # Select a random meal from the filtered data
            meal = filtered_data.sample(1)
            # Add the meal to the daily meals list and the set of selected meals
            daily_meals.append(meal.iloc[0]['Title'])
            selected_meals.add(meal.iloc[0]['Title'])
        # Add the daily meals list to the meal plan
        meal_plan.append(daily_meals)
    
    return meal_plan
