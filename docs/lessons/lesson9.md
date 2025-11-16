# Lesson 9: The Friendship Bracelet - Building KNN From Scratch 🧵

Welcome back, master builder!

You've seen the power of `scikit-learn`, but to truly understand an algorithm, there's nothing like building it yourself. Today, we're going to build the K-Nearest Neighbors algorithm from scratch using nothing but pure Python. No libraries, no hidden magic.

This will be a challenge, but by the end, you'll have a deep, powerful understanding of how a computer can "learn" by looking at its neighbors.

---

### Part 1: The Plan (Our Recipe)

Every good project starts with a plan. Here's our four-step recipe for building a KNN model:

1.  **Measure Friendship:** For our new data point, we'll calculate the "distance" to every single data point in our training set.
2.  **Find the Inner Circle:** We'll sort all those distances and find the "K" closest neighbors.
3.  **Ask the Friends:** We'll look at the labels of those K neighbors.
4.  **Make a Prediction:** Based on what the neighbors say, we'll make our final prediction.

---

### Part 2: Measuring Friendship (The Distance Formula)

How do we measure "distance" between data points? The most common way is called **Euclidean Distance**.

**The Analogy:** Imagine two points on a treasure map. The Euclidean distance is the "as the crow flies" straight-line distance between them.

If we have two students, Student 1 ($p_1$) and Student 2 ($p_2$), with features $(x_1, y_1)$ and $(x_2, y_2)$, the formula is:

$$
d(p_1, p_2) = \sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}
$$

It looks a bit scary, but it's just what we're doing in the code below!

Here's how we can write a `euclidean_distance` function in pure Python:

```python
def euclidean_distance(point1, point2):
    """Calculates the straight-line distance between two points."""
    sum_of_squares = 0
    # Loop through each feature (e.g., 'Likes Games', 'Likes Heroes')
    for i in range(len(point1)):
        sum_of_squares += (point1[i] - point2[i]) ** 2
    
    # The ** 0.5 is the same as doing a square root!
    return sum_of_squares ** 0.5

# --- Example Calculation ---
# Our training data has a student, Alex, at [1, 1]
# Our new student, Frank, is at [1, 0]
alex = [1, 1]
frank = [1, 0]

# Input: Two points
distance = euclidean_distance(alex, frank)

# Output: The distance
print("The distance between Alex and Frank is:", distance) 
# Expected Output: 1.0
```

---

### Part 3: The Code, Step-by-Step

Now let's build our algorithm, one function at a time.

#### **Step 1: Get the Neighbors**
This function will take our training data, a new student, and our choice of "K", and it will find the K closest friends.

```python
def get_neighbors(train_data, new_student, k):
    """Finds the K nearest neighbors."""
    distances = []
    for train_student in train_data:
        # Separate the features from the label
        features = train_student[:-1]
        label = train_student[-1]
        
        # Calculate the distance
        dist = euclidean_distance(new_student, features)
        distances.append((dist, label))
    
    # Sort the list of neighbors by their distance
    distances.sort(key=lambda tup: tup[0])
    
    # Get just the top K neighbors
    neighbors = []
    for i in range(k):
        neighbors.append(distances[i][1])
        
    return neighbors
```

#### **Step 2A: Predict for Classification (Majority Vote)**
This function takes the list of neighbors and finds the most common label.

```python
def predict_classification(neighbors):
    """Predicts the class based on a majority vote."""
    votes = {}
    for neighbor_label in neighbors:
        if neighbor_label in votes:
            votes[neighbor_label] += 1
        else:
            votes[neighbor_label] = 1
            
    # Find the label with the most votes
    # The `sorted` function here is a clever way to get the max value from a dictionary
    prediction = sorted(votes.items(), key=lambda item: item[1], reverse=True)
    return prediction[0][0]
```

> **🤔 The "Even K" Problem:** What happens if you choose K=2 and one neighbor is a "Pizza Lover" and the other is a "Pizza Hater"? It's a tie! This is why for classification problems, data scientists almost always choose an **odd number** for K (like 1, 3, 5) to avoid ties.

#### **Step 2B: Predict for Regression (The Average)**
This function takes the list of neighbors and finds their average value.

```python
def predict_regression(neighbors):
    """Predicts a number based on the average of the neighbors."""
    total = 0
    for neighbor_label in neighbors:
        total += neighbor_label
        
    return total / len(neighbors)
```

---

### Part 4: Putting It All Together

Now we can combine our functions to build a complete, from-scratch model!

#### **Example 1: The Pizza Classifier**

```python
# Our training data, with the label at the end
pizza_data = [
    [1, 1, 1],  # Alex: Likes Games, Likes Heroes, Likes Pizza
    [0, 1, 1],  # Ben
    [1, 0, 1],  # Chloe
    [0, 0, 0]   # David
]

# Our new student, Frank
frank_features = [1, 0]

# --- Let's Predict! ---
# 1. Get the 3 nearest neighbors
k = 3
frank_neighbors = get_neighbors(pizza_data, frank_features, k)
print("Frank's 3 closest neighbors have labels:", frank_neighbors)

# 2. Make a prediction
prediction = predict_classification(frank_neighbors)
print("So, we predict Frank's result is:", prediction)

# Expected Output:
# Frank's 3 closest neighbors have labels: [1, 1, 1]
# So, we predict Frank's result is: 1 (Likes Pizza)
```

#### **Example 2: The Test Score Regressor**

```python
# Data: [Hours Studied, Past Score, Current Score]
score_data = [
    [2, 80, 85],
    [4, 90, 92],
    [1, 75, 78],
    [5, 95, 98]
]

# A new student who studied for 3 hours and got an 85 on the last test
new_student_features = [3, 85]

# --- Let's Predict! ---
# 1. Get the 2 nearest neighbors
k = 2
new_student_neighbors = get_neighbors(score_data, new_student_features, k)
print("The new student's 2 closest neighbors have scores:", new_student_neighbors)

# 2. Make a prediction
prediction = predict_regression(new_student_neighbors)
print("So, we predict the new student's score will be:", prediction)

# Expected Output:
# The new student's 2 closest neighbors have scores: [85, 92]
# So, we predict the new student's score will be: 88.5
```

---

### Part 5: Let's Discuss!

1.  Now that you've built it, what do you think is the "hardest" part of the KNN algorithm for the computer to do?
2.  How would our `euclidean_distance` function need to change if we had three features instead of two?
3.  Why was it important that we built two different prediction functions (`predict_classification` and `predict_regression`)?

---

**What's Next?**

This is a huge accomplishment! You have built a complete, working machine learning algorithm from the ground up using nothing but basic Python. You are no longer just a user of AI tools—you are a creator.

This concludes our introductory series. You have journeyed from the highest-level ideas of AI to the nitty-gritty details of writing your own learning algorithms. The world of AI is now open to you.

Keep experimenting, keep building, and most importantly, stay curious!