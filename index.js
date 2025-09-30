// AI Menu Master Backend
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'AI Menu Master Backend is running!',
    endpoints: {
      generatePlan: 'POST /api/generate-plan'
    }
  });
});

// Generate meal plan endpoint
app.post('/api/generate-plan', async (req, res) => {
  try {
    const { formData } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured.' 
      });
    }

    const prompt = `You are a UK-based meal planning expert. Generate a ${formData.days}-day meal plan for ${formData.people} people with the following constraints:

Dietary styles: ${formData.mealStyles.join(', ') || 'No restrictions'}
Budget: £${formData.budget} total
Prep speed: ${formData.prepSpeed} (<25min for quick, 25-45min for standard, >45min for weekend)
Complexity: ${formData.complexity}
Allergens to AVOID: ${formData.allergens.join(', ') || 'None'}
Cuisine preferences: ${formData.cuisines.join(', ') || 'Mixed'}
Supermarket: ${formData.supermarket}

IMPORTANT RULES:
- Minimize food waste by reusing ingredients across meals
- Use UK measurements (g, ml, tsp, tbsp) and terms (courgette, aubergine, mince)
- Provide realistic UK supermarket prices
- Focus on overlapping ingredients
- Ensure allergen safety with clear substitutions
- Keep within budget by using cost-effective ingredients

Return ONLY valid JSON in this exact format:
{
  "meals": [
    {
      "day": 1,
      "name": "Meal Name",
      "cookTime": 30,
      "difficulty": "Simple",
      "costPerPortion": 2.50,
      "calories": 550,
      "protein": 35,
      "carbs": 45,
      "fat": 15,
      "allergens": ["Dairy"],
      "ingredients": [
        {"item": "Chicken breast", "amount": "400g", "price": 3.50},
        {"item": "Basmati rice", "amount": "200g", "price": 0.80}
      ],
      "steps": [
        "Dice the chicken into bite-sized pieces",
        "Heat oil in a large pan over medium-high heat",
        "Cook chicken for 6-8 minutes until golden"
      ],
      "tips": "Use chicken thighs for a more economical option"
    }
  ],
  "shoppingList": [
    {
      "category": "Meat
