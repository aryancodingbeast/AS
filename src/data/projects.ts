export interface Project {
  id: string;
  title: string;
  description: string;
  topics: string[];
  files: {
    name: string;
    content: string;
    description: string;
  }[];
  explanation: string;
}

export const projects: Project[] = [
  {
    id: 'variables-datatypes',
    title: 'Python Variables and Data Types',
    description: 'Learn about Python variables, basic data types, and type conversion.',
    topics: ['Variables', 'Numbers', 'Strings', 'Type Conversion', 'Comments'],
    files: [
      {
        name: 'variables.py',
        content: `# Basic variable declarations
name = "John Doe"
age = 25
height = 1.75
is_student = True

# Printing variables and their types
print(f"Name: {name} (Type: {type(name)})")
print(f"Age: {age} (Type: {type(age)})")
print(f"Height: {height} (Type: {type(height)})")
print(f"Is Student: {is_student} (Type: {type(is_student)})")

# Type conversion
age_str = str(age)  # Convert integer to string
height_int = int(height)  # Convert float to integer
number_str = "100"
number_int = int(number_str)  # Convert string to integer

print(f"\\nConverted Types:")
print(f"Age as string: {age_str} (Type: {type(age_str)})")
print(f"Height as integer: {height_int} (Type: {type(height_int)})")
print(f"String number converted to integer: {number_int} (Type: {type(number_int)})")`,
        description: 'Basic examples of variable declarations and type conversions in Python.'
      }
    ],
    explanation: 'This project demonstrates how to work with variables and different data types in Python. It covers string formatting, type checking, and type conversion.'
  },
  {
    id: 'control-flow',
    title: 'Control Flow in Python',
    description: 'Learn about if statements, loops, and basic control flow structures.',
    topics: ['If Statements', 'For Loops', 'While Loops', 'Break/Continue'],
    files: [
      {
        name: 'control_flow.py',
        content: `# If statements
age = 18

if age < 13:
    print("Child")
elif age < 20:
    print("Teenager")
else:
    print("Adult")

# For loop with range
print("\\nCounting from 1 to 5:")
for i in range(1, 6):
    print(i)

# For loop with list
print("\\nIterating through a list:")
fruits = ["apple", "banana", "orange"]
for fruit in fruits:
    print(fruit)

# While loop with break
print("\\nWhile loop with break:")
counter = 0
while True:
    print(counter)
    counter += 1
    if counter >= 5:
        break

# Continue statement
print("\\nSkipping odd numbers:")
for i in range(10):
    if i % 2 != 0:
        continue
    print(i)`,
        description: 'Examples of different control flow structures in Python.'
      }
    ],
    explanation: 'This project shows how to use control flow structures in Python, including conditional statements and different types of loops.'
  },
  {
    id: 'functions',
    title: 'Python Functions',
    description: 'Learn about function definitions, parameters, and return values.',
    topics: ['Function Definition', 'Parameters', 'Return Values', 'Default Arguments'],
    files: [
      {
        name: 'functions.py',
        content: `# Basic function definition
def greet(name):
    return f"Hello, {name}!"

# Function with multiple parameters
def calculate_rectangle_area(length, width):
    return length * width

# Function with default parameters
def power(base, exponent=2):
    return base ** exponent

# Function with multiple return values
def get_min_max(numbers):
    return min(numbers), max(numbers)

# Testing the functions
print(greet("Alice"))

area = calculate_rectangle_area(5, 3)
print(f"Rectangle area: {area}")

print(f"2 squared: {power(2)}")
print(f"2 cubed: {power(2, 3)}")

numbers = [1, 5, 3, 8, 2]
minimum, maximum = get_min_max(numbers)
print(f"Min: {minimum}, Max: {maximum}")`,
        description: 'Examples of different types of functions in Python.'
      }
    ],
    explanation: 'This project covers function definitions, parameters, return values, and default arguments in Python.'
  }
];