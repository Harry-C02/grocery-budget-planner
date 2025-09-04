# grocery budget
def calculate_weekly_budget():
  

  print("=== Weekly Grocery Budget Planner ===")

try:
    income = float(input("Enter your weekly budget (or 0 to skip): $"))
except ValueError:
    print("Invalid input. Defaulting income to $0.")
    income = 0

categories = {}
print("\nEnter your grocery categories and budget per category.")
print("Type 'done' when finished.\n")

while True:
  category = input("Category name (or 'done): ").strip()
  if category.lower()=='done':
    break
  try:
    amount = float(input(f"Budget for {category}: $"))
    categories[category] = amount
  except ValueError:
    print("Invalid amount. Skipping category.")

total_budget = sum(categories.values())

print("\n=== Budget Summary ===")
for cat, amt in categories.items():
  print(f"{cat:<15}: ${amt:>6.2f}")

pct = (total_budget / income) * 100 if income else 0
print(f"Percent of Budget: {pct:.1f}%")
if pct > 30:
  print("Warning: You're spending more than 30% of income on groceries.")

if __name__ == "__main__":
  calculate_weekly_budget()