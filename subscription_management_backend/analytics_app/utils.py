import os
from openai import OpenAI
from django.conf import settings

client = OpenAI()  


def generate_ai_suggestions(subscriptions):
    suggestions = []
    total_cost = sum(sub.cost for sub in subscriptions)
    
    for sub in subscriptions:
        if sub.cost > 50:
            suggestions.append({
                "subscription": sub.service_name,
                "type": "cost_review", 
                "message": f"High cost subscription ({sub.cost}). Consider reviewing necessity.",
                "classification": "optional"
            })
        elif sub.billing_cycle == "yearly" and sub.cost > 100:
            suggestions.append({
                "subscription": sub.service_name,
                "type": "billing_optimization",
                "message": "Consider switching to monthly billing for better cash flow.",
                "classification": "necessary"
            })
    
    if total_cost > 200:
        suggestions.append({
            "type": "overall",
            "message": f"Total monthly spending: ${total_cost}. Consider canceling underused services.",
            "potential_savings": total_cost * 0.2
        })
    
    return suggestions
