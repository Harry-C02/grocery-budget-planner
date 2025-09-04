#!/usr/bin/env python3
"""
Weekly Grocery Budget Planner

A simple and clean tool for managing weekly grocery budgets by category.
Helps you plan and track your grocery spending to stay within budget limits.

Author: Harrison Canfield
Date: 2024
"""

def calculate_weekly_budget():
    """Main function for the grocery budget planner."""
    
    print("=" * 50)
    print("🛒 WEEKLY GROCERY BUDGET PLANNER")
    print("=" * 50)

    # Get weekly budget with better error handling
    while True:
        try:
            weekly_budget = float(input("💰 Enter your weekly grocery budget: $"))
            if weekly_budget > 0:
                break
            else:
                print("❌ Please enter a positive number.")
        except ValueError:
            print("❌ Invalid input. Please enter a valid number.")

    categories = {}
    print("\n📋 Enter your grocery categories and budget per category.")
    print("Type 'done' when finished.\n")

    while True:
        category = input("🏷️  Category name (or 'done'): ").strip()
        if category.lower() == 'done':
            break
        
        if not category:
            print("❌ Category name cannot be empty.")
            continue
            
        try:
            amount = float(input(f"💵 Budget for {category}: $"))
            if amount < 0:
                print("❌ Budget amount cannot be negative.")
                continue
            categories[category] = amount
        except ValueError:
            print("❌ Invalid amount. Please enter a valid number.")

    # Calculate totals
    total_allocated = sum(categories.values())
    
    # Display results with enhanced formatting
    print("\n" + "=" * 50)
    print("📊 BUDGET SUMMARY")
    print("=" * 50)
    
    if categories:
        print(f"\n📋 Category Breakdown:")
        print("-" * 40)
        for cat, amt in categories.items():
            percentage = (amt / weekly_budget * 100) if weekly_budget > 0 else 0
            print(f"• {cat:<20} ${amt:>8.2f} ({percentage:5.1f}%)")
        
        print("-" * 40)
        print(f"💰 Weekly Budget:    ${weekly_budget:>8.2f}")
        print(f"💵 Total Allocated:  ${total_allocated:>8.2f}")
        
        remaining = weekly_budget - total_allocated
        print(f"💸 Remaining:        ${remaining:>8.2f}")
        
        # Budget utilization analysis
        utilization = (total_allocated / weekly_budget) * 100
        print(f"📈 Budget Used:      {utilization:>8.1f}%")
        
        # Enhanced budget analysis
        if remaining < 0:
            print("\n❌ OVER BUDGET! You've allocated more than your weekly budget.")
            print(f"   You're over by ${abs(remaining):.2f}")
        elif remaining == 0:
            print("\n✅ Budget fully allocated - perfect planning!")
        elif remaining < weekly_budget * 0.1:  # Less than 10% remaining
            print("\n⚠️  Budget almost fully allocated.")
            print("   Consider if you need to adjust your allocations.")
        else:
            print("\n✅ Good budget allocation with room for adjustments.")
    else:
        print("\n📋 No categories added.")
        print("💡 Try adding categories like: produce, meat, dairy, pantry")

    print("\n" + "=" * 50)
    print("🎯 Budget Planning Complete!")
    print("=" * 50)


if __name__ == "__main__":
    calculate_weekly_budget()