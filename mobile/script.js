// Mobile Grocery Budget Planner JavaScript
class GroceryBudgetPlanner {
    constructor() {
        this.weeklyBudget = 0;
        this.categories = {};
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Budget input
        document.getElementById('set-budget-btn').addEventListener('click', () => this.setBudget());
        document.getElementById('weekly-budget').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.setBudget();
        });

        // Category input
        document.getElementById('add-category-btn').addEventListener('click', () => this.addCategory());
        document.getElementById('category-amount').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addCategory();
        });

        // New budget button
        document.getElementById('new-budget-btn').addEventListener('click', () => this.startNewBudget());
    }

    setBudget() {
        const budgetInput = document.getElementById('weekly-budget');
        const budget = parseFloat(budgetInput.value);

        if (isNaN(budget) || budget <= 0) {
            this.showError('Please enter a valid budget amount greater than 0.');
            return;
        }

        this.weeklyBudget = budget;
        this.showCategoriesSection();
        this.updateBudgetSummary();
    }

    addCategory() {
        const nameInput = document.getElementById('category-name');
        const amountInput = document.getElementById('category-amount');
        
        const name = nameInput.value.trim();
        const amount = parseFloat(amountInput.value);

        if (!name) {
            this.showError('Please enter a category name.');
            return;
        }

        if (isNaN(amount) || amount < 0) {
            this.showError('Please enter a valid amount.');
            return;
        }

        const totalAllocated = this.getTotalAllocated();
        if (totalAllocated + amount > this.weeklyBudget) {
            this.showError(`This would exceed your budget. You have $${(this.weeklyBudget - totalAllocated).toFixed(2)} remaining.`);
            return;
        }

        this.categories[name] = amount;
        this.updateCategoriesList();
        this.updateBudgetSummary();
        
        // Clear inputs
        nameInput.value = '';
        amountInput.value = '';
        nameInput.focus();
    }

    removeCategory(categoryName) {
        delete this.categories[categoryName];
        this.updateCategoriesList();
        this.updateBudgetSummary();
    }

    updateCategoriesList() {
        const container = document.getElementById('categories-list');
        container.innerHTML = '';

        Object.entries(this.categories).forEach(([name, amount]) => {
            const percentage = (amount / this.weeklyBudget * 100).toFixed(1);
            
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            categoryItem.innerHTML = `
                <div class="category-info">
                    <div class="category-name">${name}</div>
                    <div class="category-amount">$${amount.toFixed(2)}</div>
                    <div class="category-percentage">${percentage}% of budget</div>
                </div>
                <button class="btn btn-danger" onclick="budgetPlanner.removeCategory('${name}')">Remove</button>
            `;
            container.appendChild(categoryItem);
        });
    }

    updateBudgetSummary() {
        const totalAllocated = this.getTotalAllocated();
        const remaining = this.weeklyBudget - totalAllocated;

        document.getElementById('total-allocated').textContent = `$${totalAllocated.toFixed(2)}`;
        document.getElementById('remaining-budget').textContent = `$${remaining.toFixed(2)}`;

        // Show results if we have categories
        if (Object.keys(this.categories).length > 0) {
            this.showResults();
        }
    }

    getTotalAllocated() {
        return Object.values(this.categories).reduce((sum, amount) => sum + amount, 0);
    }

    showCategoriesSection() {
        document.getElementById('budget-section').classList.add('hidden');
        document.getElementById('categories-section').classList.remove('hidden');
        document.getElementById('category-name').focus();
    }

    showResults() {
        document.getElementById('results-section').classList.remove('hidden');
        this.updateBudgetBreakdown();
        this.updateBudgetAnalysis();
    }

    updateBudgetBreakdown() {
        const container = document.getElementById('budget-breakdown');
        const totalAllocated = this.getTotalAllocated();
        const remaining = this.weeklyBudget - totalAllocated;

        // Sort categories by amount (descending)
        const sortedCategories = Object.entries(this.categories)
            .sort(([,a], [,b]) => b - a);

        let html = '<div class="budget-breakdown">';
        
        sortedCategories.forEach(([name, amount]) => {
            const percentage = (amount / this.weeklyBudget * 100).toFixed(1);
            const barWidth = Math.min(percentage, 100);
            
            html += `
                <div class="breakdown-item">
                    <div>
                        <div style="font-weight: 600;">${name}</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${barWidth}%"></div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: bold; color: #4CAF50;">$${amount.toFixed(2)}</div>
                        <div style="font-size: 0.9rem; color: #666;">${percentage}%</div>
                    </div>
                </div>
            `;
        });

        // Add totals
        html += `
            <div class="breakdown-item">
                <div>Weekly Budget</div>
                <div>$${this.weeklyBudget.toFixed(2)}</div>
            </div>
            <div class="breakdown-item">
                <div>Total Allocated</div>
                <div>$${totalAllocated.toFixed(2)}</div>
            </div>
            <div class="breakdown-item">
                <div>Remaining</div>
                <div>$${remaining.toFixed(2)}</div>
            </div>
        `;

        html += '</div>';
        container.innerHTML = html;
    }

    updateBudgetAnalysis() {
        const container = document.getElementById('budget-analysis');
        const totalAllocated = this.getTotalAllocated();
        const remaining = this.weeklyBudget - totalAllocated;
        const utilization = (totalAllocated / this.weeklyBudget * 100).toFixed(1);

        let html = '<div class="budget-analysis">';
        html += `<h3>📊 Analysis</h3>`;
        html += `<p><strong>Budget Utilization:</strong> ${utilization}%</p>`;

        if (remaining < 0) {
            html += `
                <div class="analysis-item error">
                    <strong>❌ OVER BUDGET!</strong><br>
                    You've allocated $${Math.abs(remaining).toFixed(2)} more than your weekly budget.
                </div>
            `;
        } else if (remaining === 0) {
            html += `
                <div class="analysis-item success">
                    <strong>✅ Perfect Planning!</strong><br>
                    Your budget is fully allocated with no waste.
                </div>
            `;
        } else if (remaining < this.weeklyBudget * 0.1) {
            html += `
                <div class="analysis-item warning">
                    <strong>⚠️ Budget Almost Full</strong><br>
                    You have $${remaining.toFixed(2)} remaining. Consider if you need to adjust allocations.
                </div>
            `;
        } else {
            html += `
                <div class="analysis-item success">
                    <strong>✅ Good Budget Allocation</strong><br>
                    You have $${remaining.toFixed(2)} remaining for adjustments or additional categories.
                </div>
            `;
        }

        // Category balance analysis
        if (Object.keys(this.categories).length > 1) {
            const amounts = Object.values(this.categories);
            const maxAmount = Math.max(...amounts);
            const minAmount = Math.min(...amounts);
            
            if (maxAmount > minAmount * 3) {
                html += `
                    <div class="analysis-item warning">
                        <strong>⚠️ Unbalanced Categories</strong><br>
                        Your highest category is more than 3x your lowest. Consider rebalancing.
                    </div>
                `;
            }
        }

        html += '</div>';
        container.innerHTML = html;
    }

    startNewBudget() {
        this.weeklyBudget = 0;
        this.categories = {};
        
        document.getElementById('weekly-budget').value = '';
        document.getElementById('category-name').value = '';
        document.getElementById('category-amount').value = '';
        
        document.getElementById('budget-section').classList.remove('hidden');
        document.getElementById('categories-section').classList.add('hidden');
        document.getElementById('results-section').classList.add('hidden');
        
        document.getElementById('weekly-budget').focus();
    }

    showError(message) {
        // Simple error display - you could enhance this with a toast notification
        alert(message);
    }
}

// Initialize the app when the page loads
let budgetPlanner;
document.addEventListener('DOMContentLoaded', () => {
    budgetPlanner = new GroceryBudgetPlanner();
});

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
